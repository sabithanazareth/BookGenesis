import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import queries from "../../queries";
import Content from "./BookContent";
import BookModal from "./BookModal";

const BooksList = () => {
  const { loading, error, data, refetch } = useQuery(queries.GET_BOOKS);
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
  const [addBook] = useMutation(queries.ADD_BOOK);
  const [editBook] = useMutation(queries.EDIT_BOOK);
  const [removeBook] = useMutation(queries.REMOVE_BOOK);
  const component = "BooksList";

  useEffect(() => {
    refetch();
  }, []);

  const handleOpenModal = useCallback((data) => {
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
  }, []);

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

  const handleDeleteBook = useCallback(async (id) => {
    try {
      await removeBook({ variables: { id } });
      await refetch();
    } catch (error) {
      alert(error);
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Books</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Add Book
      </Button>
      <Grid container spacing={2}>
        {data.books.map((book) => (
          <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
            <Content
              component={component}
              book={book}
              handleOpenModal={handleOpenModal}
              handleDeleteBook={handleDeleteBook}
            />
          </Grid>
        ))}
      </Grid>

      <BookModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        bookData={bookData}
        setBookData={setBookData}
        handleAddBook={handleAddBook}
        handleEditBook={handleEditBook}
      />
    </div>
  );
};

export default BooksList;
