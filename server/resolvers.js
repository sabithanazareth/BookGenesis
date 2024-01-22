import { GraphQLError } from "graphql";
import {
  authors as authorsCollection,
  books as booksCollection,
} from "./config/mongoCollections.js";
import { v4 as uuid } from "uuid";
import { client } from "./config/redisConfig.js";
import { isValidId } from "./utils/index.js";
import {
  isValidGenre,
  isPrice,
  isValidNumber,
  validTitle,
  isArray,
  checkPubDate,
  validIsbn,
  isBookPrice,
} from "./utils/book.js";
import {
  isValidTerm,
  validName,
  checkDate,
  validCity,
  validState,
} from "./utils/author.js";

export const resolvers = {
  Query: {
    authors: async () => {
      try {
        let allAuthors;
        const authCach = await client.exists("allAuthors");
        if (authCach) {
          console.log("From cache");
          allAuthors = client.json.get("allAuthors");
        } else {
          console.log("Not from cache");
          const authors = await authorsCollection();
          allAuthors = await authors.find({}).toArray();
          if (!allAuthors) {
            throw {
              text: "Internal Server Error",
              code: "500 : INTERNAL_SERVER_ERROR",
            };
          }
          if (allAuthors.length !== 0) {
            await client.json.set("allAuthors", "$", allAuthors);
          }
        }
        return allAuthors;
      } catch (e) {
        console.log("Error", e);
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
    books: async () => {
      try {
        let allBooks;
        const bookCach = await client.exists("allBooks");
        if (bookCach) {
          console.log("From cache");
          allBooks = client.json.get("allBooks");
        } else {
          console.log("Not from cache");
          const books = await booksCollection();
          allBooks = await books.find({}).toArray();
          if (!allBooks) {
            throw {
              text: "Internal Server Error",
              code: "500 : INTERNAL_SERVER_ERROR",
            };
          }
          if (allBooks.length !== 0) {
            await client.json.set(`allBooks`, "$", allBooks);
          }
        }
        return allBooks;
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
    getAuthorById: async (_, args) => {
      let author;
      try {
        const authId = isValidId(args._id);
        let authCach = await client.exists(`auth-${authId}`);
        if (authCach) {
          console.log("Auth in Cache");
          author = await client.json.get(`auth-${authId}`);
        } else {
          console.log("Auth not in cache");
          const authors = await authorsCollection();
          author = await authors.findOne({ _id: authId });
          if (!author) {
            throw { text: "Author Not Found", code: "404: NOT_FOUND" };
          }
          await client.json.set(`auth-${authId}`, "$", author);
        }
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
      return author;
    },
    getBookById: async (_, args) => {
      let book;
      try {
        const bookId = isValidId(args._id);
        let bookCach = await client.exists(`book-${bookId}`);
        if (bookCach) {
          console.log("Book in Cache");
          book = await client.json.get(`book-${bookId}`);
        } else {
          console.log("Book not in cache");
          const books = await booksCollection();
          book = await books.findOne({ _id: bookId });
          if (!book) {
            throw { text: "Book Not Found", code: "404: NOT_FOUND" };
          }
          await client.json.set(`book-${bookId}`, "$", book);
        }
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
      return book;
    },
    booksByGenre: async (_, args) => {
      let allBooks;
      try {
        const genreType = isValidGenre(args.genre);
        let genreCach = await client.exists(genreType);
        if (genreCach) {
          console.log("Genre in Cache");
          allBooks = await client.get(genreType);
          allBooks = JSON.parse(allBooks);
        } else {
          console.log("Genre not in cache");
          const books = await booksCollection();
          allBooks = await books
            .find({ genres: { $regex: `^${genreType}$`, $options: "i" } })
            .toArray();
          if (!allBooks) {
            throw {
              text: "Internal Server Error",
              code: "500 : INTERNAL_SERVER_ERROR",
            };
          }
          if (allBooks.length !== 0) {
            const strBook = JSON.stringify(allBooks);
            await client.setEx(genreType, 3600, strBook);
          }
        }
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
      return allBooks;
    },
    booksByPriceRange: async (_, args) => {
      let allBooks;
      try {
        const { minimum, maximum } = isPrice(args.min, args.max);
        let priceCach = await client.exists(`price-${minimum}-${maximum}`);
        if (priceCach) {
          console.log("Price range in Cache");
          allBooks = await client.get(`price-${minimum}-${maximum}`);
          allBooks = JSON.parse(allBooks);
        } else {
          console.log("Price range not in cache");
          const books = await booksCollection();
          allBooks = await books
            .find({
              price: {
                $gte: minimum,
                $lte: maximum,
              },
            })
            .toArray();
          if (!allBooks) {
            throw {
              text: "Internal Server Error",
              code: "500 : INTERNAL_SERVER_ERROR",
            };
          }
          if (allBooks.length !== 0) {
            const strBook = JSON.stringify(allBooks);
            await client.setEx(`price-${minimum}-${maximum}`, 3600, strBook);
          }
        }
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
      return allBooks;
    },
    searchAuthorsByName: async (_, args) => {
      let allAuthors;
      try {
        const searchTerm = isValidTerm(args.searchTerm);
        let searchCach = await client.exists(`search-${searchTerm}`);
        if (searchCach) {
          console.log("SearchTerm in Cache");
          allAuthors = await client.get(`search-${searchTerm}`);
          allAuthors = JSON.parse(allAuthors);
        } else {
          console.log("SearchTerm not in cache");
          const authors = await authorsCollection();
          allAuthors = await authors
            .find({
              $or: [
                { first_name: { $regex: `${searchTerm}`, $options: "i" } },
                { last_name: { $regex: `${searchTerm}`, $options: "i" } },
              ],
            })
            .toArray();
          if (!allAuthors) {
            throw {
              text: "Internal Server Error",
              code: "500 : INTERNAL_SERVER_ERROR",
            };
          }
          if (allAuthors.length !== 0) {
            const strAuth = JSON.stringify(allAuthors);
            await client.setEx(`search-${searchTerm}`, 3600, strAuth);
          }
        }
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
      return allAuthors;
    },
  },
  Book: {
    author: async (parentValue) => {
      const authors = await authorsCollection();
      const author = await authors.findOne({ _id: parentValue.authorId });
      return author;
    },
  },
  Author: {
    books: async (parentValue, args) => {
      let books;
      const authId = parentValue._id;
      const limit = args.limit > 0 ? args.limit : null;
      const book = await booksCollection();
      if (limit) {
        books = await book.find({ authorId: authId }).limit(limit).toArray();
      } else {
        books = await book.find({ authorId: authId }).toArray();
      }
      return books;
    },
    numOfBooks: async (parentValue) => {
      const book = await booksCollection();
      const numOfBooks = await book.count({
        authorId: parentValue._id,
      });
      return numOfBooks;
    },
  },
  Mutation: {
    addAuthor: async (_, args) => {
      let newAuthor;
      try {
        const first_name = validName(args.first_name);
        const last_name = validName(args.last_name);
        const date_of_birth = checkDate(args.date_of_birth);
        const hometownCity = validCity(args.hometownCity);
        const hometownState = validState(args.hometownState);
        newAuthor = {
          _id: uuid(),
          first_name,
          last_name,
          date_of_birth,
          hometownCity,
          hometownState,
          books: [],
        };
        const authors = await authorsCollection();
        let insertedAuthor = await authors.insertOne(newAuthor);
        if (!insertedAuthor?.acknowledged || !insertedAuthor?.insertedId) {
          throw {
            text: `Could not Add Employee.`,
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        await client.json.set(`auth-${newAuthor._id}`, "$", newAuthor);
        const allAuthors = await authors.find({}).toArray();
        if (!allAuthors) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allAuthors.length !== 0) {
          await client.json.set("allAuthors", "$", allAuthors);
        }
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
      return newAuthor;
    },
    editAuthor: async (_, args) => {
      try {
        const { _id, ...updateFields } = args;
        const authId = isValidId(_id);
        if (Object.keys(updateFields).length === 0) {
          throw {
            text: "At least one field to update must be provided.",
            code: "400 : BAD_USER_INPUT",
          };
        }
        const authors = await authorsCollection();
        let newAuthor = await authors.findOne({ _id: authId });
        if (!newAuthor)
          throw {
            text: `Could not find author with id of ${authId}`,
            code: "404 : NOT_FOUND",
          };
        for (const item in updateFields) {
          if (item === "books")
            throw {
              text: `Cannot update the book field`,
              code: "400 : BAD_USER_INPUT",
            };
          if (item === "first_name") {
            newAuthor.first_name = validName(updateFields.first_name);
          }
          if (item === "last_name") {
            newAuthor.last_name = validName(updateFields.last_name);
          }
          if (item === "date_of_birth")
            newAuthor.date_of_birth = checkDate(updateFields.date_of_birth);
          if (item === "hometownCity")
            newAuthor.hometownCity = validCity(updateFields.hometownCity);
          if (item === "hometownState")
            newAuthor.hometownState = validState(updateFields.hometownState);
        }
        const updateInfo = await authors.updateOne(
          { _id: authId },
          { $set: newAuthor }
        );
        if (!updateInfo?.acknowledged || !updateInfo?.modifiedCount)
          throw {
            text: `Could not update employee with _id of ${authId}. Possibly same data`,
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        const updatedAuthor = await authors.findOne({ _id: authId });
        if (await client.exists(`auth-${newAuthor._id}`))
          await client.json.set(`auth-${newAuthor._id}`, "$", updatedAuthor);
        const allAuthors = await authors.find({}).toArray();
        if (!allAuthors) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allAuthors.length !== 0) {
          await client.json.set("allAuthors", "$", allAuthors);
        }
        return updatedAuthor;
      } catch (e) {
        console.log(e);
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
    removeAuthor: async (_, args) => {
      try {
        const authId = isValidId(args._id);
        const authors = await authorsCollection();
        const foundAuthor = await authors.findOne({
          _id: authId,
        });
        if (!foundAuthor) {
          throw {
            text: `Author with id ${authId} not found`,
            code: "404 : NOT_FOUND",
          };
        }
        const deletedAuthor = await authors.findOneAndDelete({
          _id: authId,
        });
        if (!deletedAuthor) {
          throw {
            text: `Could not delete author with id of ${authId}`,
            code: "404 : NOT_FOUND",
          };
        }
        const books = await booksCollection();
        for (const bookId of deletedAuthor.books) {
          const deletedBook = await books.findOneAndDelete({ _id: bookId });
          if (!deletedBook) {
            throw {
              text: `Could not delete book with id of ${bookId}`,
              code: "404 : NOT_FOUND",
            };
          }
          let searchBook = await client.exists(`book-${bookId}`);
          if (searchBook) await client.del(`book-${bookId}`);
        }
        let searchAuth = await client.exists(`auth-${authId}`);
        if (searchAuth) await client.del(`auth-${authId}`);
        deletedAuthor.books = [];
        const allAuthors = await authors.find({}).toArray();
        if (!allAuthors) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allAuthors.length !== 0) {
          await client.json.set("allAuthors", "$", allAuthors);
        }
        const allBooks = await books.find({}).toArray();
        if (!allBooks) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allBooks.length !== 0) {
          await client.json.set(`allBooks`, "$", allBooks);
        }
        return deletedAuthor;
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
    addBook: async (_, args) => {
      try {
        let dob;
        let author;
        let authors;
        const books = await booksCollection();
        const title = validTitle(args.title, "Title");
        const genres = isArray(args.genres, "genre");
        const authId = isValidId(args.authorId);
        let authCach = await client.exists(`auth-${authId}`);
        if (authCach) {
          author = await client.json.get(`auth-${authId}`);
          dob = author.date_of_birth;
        } else {
          authors = await authorsCollection();
          author = await authors.findOne({ _id: authId });
          if (!author) {
            throw { text: "Author Not Found", code: "404: NOT_FOUND" };
          }
          dob = author.date_of_birth;
        }
        const publicationDate = checkPubDate(args.publicationDate, dob);
        const publisher = validTitle(args.publisher, "Publisher");
        const summary = validTitle(args.summary, "Summary");
        const isbn = validIsbn(args.isbn);
        const language = validTitle(args.language, "Language");
        if (language.trim().match(/[^a-zA-z]/gi))
          throw {
            text: `Language should contain only letters.`,
            code: "400 : BAD_USER_INPUT",
          };
        const pageCount = isValidNumber(args.pageCount, "Page Count");
        const price = isBookPrice(args.price);
        const format = isArray(args.format, "format");
        const newBook = {
          _id: uuid(),
          title,
          genres,
          publicationDate,
          publisher,
          summary,
          isbn,
          language,
          pageCount,
          price,
          format,
          authorId: authId,
        };
        let insertedBook = await books.insertOne(newBook);
        if (!insertedBook?.acknowledged || !insertedBook?.insertedId) {
          throw {
            text: `Could not Add Book.`,
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        authors = await authorsCollection();
        const updateAuthBook = await authors.updateOne(
          { _id: authId },
          { $push: { books: newBook._id } }
        );
        if (!updateAuthBook.acknowledged || !updateAuthBook.modifiedCount)
          throw {
            text: "Could not update the books in author.",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        const upauthors = await authorsCollection();
        const upauthField = await upauthors.findOne({ _id: authId });
        if (await client.exists(`auth-${authId}`))
          await client.json.set(`auth-${authId}`, "$", upauthField);
        await client.json.set(`book-${newBook._id}`, "$", newBook);
        const allBooks = await books.find({}).toArray();
        if (!allBooks) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allBooks.length !== 0) {
          await client.json.set(`allBooks`, "$", allBooks);
        }
        return newBook;
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
    editBook: async (_, args) => {
      try {
        let authors;
        let oldAuthorObj;
        let newAuthObj;
        let authId;
        let dob;
        const { _id, ...updateFields } = args;
        const bookId = isValidId(_id);
        if (Object.keys(updateFields).length === 0) {
          throw {
            text: "At least one field to update must be provided.",
            code: "400 : BAD_USER_INPUT",
          };
        }
        const books = await booksCollection();
        let newBook = await books.findOne({ _id: bookId });
        if (!newBook)
          throw {
            text: `Could not find book with id of ${bookId}`,
            code: "404 : NOT_FOUND",
          };
        const oldAuthor = newBook.authorId;
        if ("authorId" in updateFields) {
          authId = isValidId(updateFields.authorId);
          authors = await authorsCollection();
          newAuthObj = await authors.findOne({ _id: authId });
          if (!newAuthObj) {
            throw { text: "Author Not Found", code: "404: NOT_FOUND" };
          }
          dob = newAuthObj.date_of_birth;
        } else {
          authors = await authorsCollection();
          oldAuthorObj = await authors.findOne({ _id: oldAuthor });
          dob = oldAuthorObj.date_of_birth;
        }
        for (const item in updateFields) {
          if (item === "title")
            newBook.title = validTitle(updateFields.title, "Title");
          if (item === "genres") {
            newBook.genres = isArray(updateFields.genres, "genre");
          }
          if (item === "publicationDate")
            newBook.publicationDate = checkPubDate(
              updateFields.publicationDate,
              dob
            );
          if (item === "publisher")
            newBook.publisher = validTitle(updateFields.publisher, "Publisher");
          if (item === "summary")
            newBook.summary = validTitle(updateFields.summary, "Summary");
          if (item === "isbn") newBook.isbn = validIsbn(updateFields.isbn);
          if (item === "language") {
            newBook.language = validTitle(updateFields.language, "Language");
            if (newBook.language.trim().match(/[^a-zA-z]/gi))
              throw {
                text: `Language should contain only letters.`,
                code: "400 : BAD_USER_INPUT",
              };
          }
          if (item === "pageCount")
            newBook.pageCount = isValidNumber(
              updateFields.pageCount,
              "Page Count"
            );
          if (item === "price") newBook.price = isBookPrice(updateFields.price);
          if (item === "format")
            newBook.format = isArray(updateFields.format, "format");
          if (item === "authorId") {
            newBook.authorId = authId;
          }
        }
        if (authId && oldAuthor !== authId) {
          authors = await authorsCollection();
          const updateOld = await authors.updateOne(
            { _id: oldAuthor },
            { $pull: { books: bookId } }
          );
          if (!updateOld.acknowledged || !updateOld.modifiedCount)
            throw {
              text: "Could not update the books array in author.",
              code: "500 : INTERNAL_SERVER_ERROR",
            };
          let searchOldAuth = await client.exists(`auth-${oldAuthor}`);
          if (searchOldAuth) await client.del(`auth-${oldAuthor}`);
          const updateNew = await authors.updateOne(
            { _id: authId },
            { $push: { books: bookId } }
          );
          if (!updateNew.acknowledged || !updateNew.modifiedCount)
            throw {
              text: "Could not update the books array in author.",
              code: "500 : INTERNAL_SERVER_ERROR",
            };
          let searchNewAuth = await client.exists(`auth-${authId}`);
          if (searchNewAuth) await client.del(`auth-${authId}`);
        }
        const updateBookInfo = await books.updateOne(
          { _id: bookId },
          { $set: newBook }
        );
        if (!updateBookInfo?.acknowledged || !updateBookInfo?.modifiedCount)
          throw {
            text: `Could not update Book with _id of ${bookId}. Possibly same data`,
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        const updatedBook = await books.findOne({ _id: bookId });
        await client.json.set(`book-${newBook._id}`, "$", updatedBook);
        const allBooks = await books.find({}).toArray();
        if (!allBooks) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allBooks.length !== 0) {
          await client.json.set(`allBooks`, "$", allBooks);
        }
        return updatedBook;
      } catch (e) {
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
    removeBook: async (_, args) => {
      try {
        const bookId = isValidId(args._id);
        const books = await booksCollection();
        const foundBook = await books.findOne({
          _id: bookId,
        });
        if (!foundBook) {
          throw {
            text: `Book with id ${bookId} not found`,
            code: "404 : NOT_FOUND",
          };
        }
        const auth = foundBook.authorId;
        const deletedbook = await books.findOneAndDelete({
          _id: bookId,
        });
        if (!deletedbook) {
          throw {
            text: `Could not delete employee with id of ${bookId}`,
            code: "404 : NOT_FOUND",
          };
        }
        const authors = await authorsCollection();
        const updateOld = await authors.updateOne(
          { _id: auth },
          { $pull: { books: bookId } }
        );
        if (!updateOld.acknowledged || !updateOld.modifiedCount)
          throw {
            text: "Could not update the books array in author.",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        const upauthor = await authorsCollection();
        const upauthField = await upauthor.findOne({
          _id: auth,
        });
        let searchBook = await client.exists(`book-${bookId}`);
        if (searchBook) await client.del(`book-${bookId}`);
        let searchAuth = await client.exists(`auth-${auth}`);
        if (searchAuth) await client.json.set(`auth-${auth}`, "$", upauthField);
        const allBooks = await books.find({}).toArray();
        if (!allBooks) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allBooks.length !== 0) {
          await client.json.set(`allBooks`, "$", allBooks);
        }
        const allAuthors = await authors.find({}).toArray();
        if (!allAuthors) {
          throw {
            text: "Internal Server Error",
            code: "500 : INTERNAL_SERVER_ERROR",
          };
        }
        if (allAuthors.length !== 0) {
          await client.json.set("allAuthors", "$", allAuthors);
        }
        return deletedbook;
      } catch (e) {
        console.log(e);
        throw new GraphQLError(e?.text ? e.text : "Internal Server Error", {
          extensions: {
            code: e?.code ? e.code : "500 : INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
  },
};
