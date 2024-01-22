import React from "react";
import { Link } from "react-router-dom";
import { Button, Paper } from "@mui/material";

const Content = React.memo(
  ({ component, author, handleOpenModal, handleDeleteAuthor }) => (
    <Paper
      elevation={3}
      style={
        component === "Author"
          ? { padding: "16px", width: "30%" }
          : { padding: "16px" }
      }
    >
      {component === "Author" ? (
        <strong style={{ fontSize: "1.2em", color: "#007BFF" }}>
          {`${author.first_name} ${author.last_name}`}
        </strong>
      ) : (
        <Link
          to={`/authors/${author._id}`}
          style={{ textDecoration: "none", color: "#000" }}
        >
          <strong
            style={{
              fontSize: "1.5em",
              cursor: "pointer",
              color: "#007BFF",
            }}
          >
            {`${author.first_name} ${author.last_name}`}
          </strong>
        </Link>
      )}
      <p>Date of Birth: {author.date_of_birth}</p>
      <p>Hometown: {`${author.hometownCity}, ${author.hometownState}`}</p>
      <p>Number of Books: {author.numOfBooks}</p>
      <div
        style={{
          marginTop: "10px",
          border: "1px solid #ddd",
          padding: "10px",
        }}
      >
        <strong>Books:</strong>
        <ul>
          {author.books.map((book, index) => (
            <li key={book._id}>
              <Link to={`/books/${book._id}`}>
                {`${index + 1}. ${book.title}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal(author)}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDeleteAuthor(author._id)}
        style={{ marginLeft: "10px" }}
      >
        Delete
      </Button>
    </Paper>
  )
);

export default Content;
