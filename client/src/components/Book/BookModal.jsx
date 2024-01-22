// BookModal.js
import React from "react";
import { Modal, TextField, Button, Stack } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const BookModal = ({
  isModalOpen,
  handleCloseModal,
  bookData,
  setBookData,
  handleAddBook,
  handleEditBook,
}) => (
  <Modal open={isModalOpen} onClose={handleCloseModal}>
    <div
      className="modal-content"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        padding: "20px",
        background: "#fff",
        overflowY: "auto",
        maxHeight: "80vh",
      }}
    >
      <h2>{bookData._id ? "Edit Book" : "Add Book"}</h2>
      <TextField
        label="Title"
        variant="outlined"
        value={bookData.title}
        onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
        style={{ marginBottom: "10px" }}
        required
      />
      <TextField
        label="Genres"
        variant="outlined"
        value={bookData.genres}
        onChange={(e) => setBookData({ ...bookData, genres: e.target.value })}
        style={{ marginBottom: "10px" }}
        required
      />

      <TextField
        label="Publication Date"
        variant="outlined"
        value={bookData.publicationDate}
        onChange={(e) =>
          setBookData({ ...bookData, publicationDate: e.target.value })
        }
        style={{ marginBottom: "10px" }}
        required
      />
      <TextField
        label="Publisher"
        variant="outlined"
        value={bookData.publisher}
        onChange={(e) =>
          setBookData({ ...bookData, publisher: e.target.value })
        }
        style={{ marginBottom: "10px" }}
        required
      />

      <TextareaAutosize
        label="Summary"
        placeholder="Summary"
        minRows={5}
        value={bookData.summary}
        onChange={(e) => setBookData({ ...bookData, summary: e.target.value })}
        style={{
          width: "55%",
          resize: "vertical",
          marginBottom: "10px",
          border: "1px solid #ced4da",
          borderRadius: "4px",
          padding: "8px",
        }}
        required
      />
      <TextField
        label="ISBN"
        variant="outlined"
        value={bookData.isbn}
        onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
        style={{ marginBottom: "10px" }}
        required
      />
      <TextField
        label="Language"
        variant="outlined"
        value={bookData.language}
        onChange={(e) => setBookData({ ...bookData, language: e.target.value })}
        style={{ marginBottom: "10px" }}
        required
      />
      <TextField
        label="Page Count"
        variant="outlined"
        value={bookData.pageCount}
        onChange={(e) =>
          setBookData({ ...bookData, pageCount: e.target.value })
        }
        style={{ marginBottom: "10px" }}
        required
      />
      <TextField
        label="Price"
        variant="outlined"
        value={bookData.price}
        onChange={(e) => setBookData({ ...bookData, price: e.target.value })}
        style={{ marginBottom: "10px" }}
        required
      />
      <TextField
        label="Format"
        variant="outlined"
        value={bookData.format}
        onChange={(e) => setBookData({ ...bookData, format: e.target.value })}
        style={{ marginBottom: "10px" }}
        required
      />
      <TextField
        label="Author Id"
        variant="outlined"
        value={bookData.authorId}
        onChange={(e) => setBookData({ ...bookData, authorId: e.target.value })}
        style={{ marginBottom: "10px" }}
        required
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={bookData._id ? handleEditBook : handleAddBook}
          style={{ marginRight: "10px" }}
        >
          {bookData._id ? "Edit" : "Add"}
        </Button>
        <Button variant="contained" onClick={handleCloseModal}>
          Cancel
        </Button>
      </div>
    </div>
  </Modal>
);

export default BookModal;
