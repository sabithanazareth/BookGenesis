import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import queries from "../../queries";
import BookModal from "./BookModal";
import Content from "./BookContent";

const Book = () => {
  const { id } = useParams();
  const { loading, error, data, refetch } = useQuery(queries.GET_BOOK_BYID, {
    variables: { id },
  });
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    genres: [],
    publicationDate: "",
    publisher: "",
    summary: "",
    isbn: "",
    language: "",
    pageCount: 0,
    price: 0.0,
    format: [],
    authorId: "",
  });
  const [editBook] = useMutation(queries.EDIT_BOOK);
  const [removeBook] = useMutation(queries.REMOVE_BOOK);
  const component = "Book";

  const handleOpenModal = (data) => {
    if (data) {
      setBookData({
        _id: data._id,
        title: data.title,
        genres: data.genres,
        publicationDate: data.publicationDate,
        publisher: data.publisher,
        summary: data.summary,
        isbn: data.isbn,
        language: data.language,
        pageCount: data.pageCount,
        price: data.price,
        format: data.format,
        authorId: data.author._id,
      });
    } else {
      setBookData({
        title: "",
        genres: [],
        publicationDate: "",
        publisher: "",
        summary: "",
        isbn: "",
        language: "",
        pageCount: 0,
        price: 0.0,
        format: [],
        authorId: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setBookData({
      title: "",
      genres: [],
      publicationDate: "",
      publisher: "",
      summary: "",
      isbn: "",
      language: "",
      pageCount: 0,
      price: 0.0,
      format: [],
      authorId: "",
    });
  };

  const handleAddBook = async () => {
    try {
      await addBook({
        variables: {
          title: bookData.title,
          genres: bookData.genres,
          publicationDate: bookData.publicationDate,
          publisher: bookData.publisher,
          summary: bookData.summary,
          isbn: bookData.isbn,
          language: bookData.language,
          pageCount: parseInt(bookData.pageCount),
          price: parseFloat(bookData.price),
          format: bookData.format,
          authorId: bookData.authorId,
        },
      });
      handleCloseModal();
      await refetch();
    } catch (error) {
      alert(error);
    }
  };

  const handleEditBook = async () => {
    console.log("FINAL", bookData.genres);
    try {
      await editBook({
        variables: {
          id: bookData._id,
          title: bookData.title,
          genres: bookData.genres,
          publicationDate: bookData.publicationDate,
          publisher: bookData.publisher,
          summary: bookData.summary,
          isbn: bookData.isbn,
          language: bookData.language,
          pageCount: parseInt(bookData.pageCount),
          price: parseFloat(bookData.price),
          format: bookData.format,
          authorId: bookData.authorId,
        },
      });
      handleCloseModal();
      await refetch();
    } catch (error) {
      alert(error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await removeBook({ variables: { id } });
      alert("Deleted successfully");
      navigate("/books");
    } catch (error) {
      alert(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const book = data.getBookById;

  if (!book) {
    return <p>No book found with the specified ID.</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Book Details</h2>
      <Link to="/books">Back to Books List</Link>
      <Content
        component={component}
        book={book}
        handleOpenModal={handleOpenModal}
        handleDeleteBook={handleDeleteBook}
      />

      <BookModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        bookData={bookData}
        handleAddBook={handleAddBook}
        setBookData={setBookData}
        handleEditBook={handleEditBook}
      />
    </div>
  );
};

export default Book;
