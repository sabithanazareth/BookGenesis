import React from "react";
import { Link } from "react-router-dom";
import { Button, Paper } from "@mui/material";

const Content = React.memo(
  ({ component, book, handleOpenModal, handleDeleteBook }) => (
    <Paper
      elevation={3}
      style={
        component === "Book"
          ? { padding: "16px", width: "30%" }
          : { padding: "16px" }
      }
    >
      {component === "Book" ? (
        <strong style={{ fontSize: "1.2em", color: "#007BFF" }}>
          {`${book.title}`}
        </strong>
      ) : (
        <Link
          to={`/books/${book._id}`}
          style={{ textDecoration: "none", color: "#000" }}
        >
          <strong
            style={{
              fontSize: "1.5em",
              cursor: "pointer",
              color: "#007BFF",
            }}
          >
            {`${book.title}`}
          </strong>
        </Link>
      )}
      <p>Genres: {book.genres.join(", ")}</p>
      <p>Price: {book.price}</p>
      <p>Publication Date: {book.publicationDate}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Summary: {book.summary}</p>
      <p>ISBN: {book.isbn}</p>
      <p>Language: {book.language}</p>
      <p>Page Count: {book.pageCount}</p>
      <p>Format: {book.format.join(", ")}</p>
      <p>
        Author:{" "}
        <Link
          to={`/authors/${book.author._id}`}
        >{`${book.author.first_name} ${book.author.last_name}`}</Link>
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal(book)}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDeleteBook(book._id)}
        style={{ marginLeft: "10px" }}
      >
        Delete
      </Button>
    </Paper>
  )
);

export default Content;
