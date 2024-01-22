import React from "react";
import { Modal, TextField, Button } from "@mui/material";

const AuthorModal = ({
  isModalOpen,
  handleCloseModal,
  authorData,
  setAuthorData,
  handleAddAuthor,
  handleEditAuthor,
}) => {
  console.log(authorData);
  return (
    <Modal open={isModalOpen} onClose={handleCloseModal}>
      <div
        className="modal-content"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          padding: "20px",
          background: "#fff",
        }}
      >
        <h2>{authorData._id ? "Edit Author" : "Add Author"}</h2>
        <TextField
          label="First Name"
          variant="outlined"
          value={authorData._id ? authorData.first_name : authorData.firstName}
          onChange={(e) =>
            setAuthorData({
              ...authorData,
              [authorData._id ? "first_name" : "firstName"]: e.target.value,
            })
          }
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={authorData._id ? authorData.last_name : authorData.lastName}
          onChange={(e) =>
            setAuthorData({
              ...authorData,
              [authorData._id ? "last_name" : "lastName"]: e.target.value,
            })
          }
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Date of Birth"
          variant="outlined"
          value={
            authorData._id ? authorData.date_of_birth : authorData.dateOfBirth
          }
          placeholder="M or MM/DD/YYYY format"
          onChange={(e) =>
            setAuthorData({
              ...authorData,
              [authorData._id ? "date_of_birth" : "dateOfBirth"]:
                e.target.value,
            })
          }
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Hometown City"
          variant="outlined"
          value={authorData.hometownCity}
          onChange={(e) =>
            setAuthorData({ ...authorData, hometownCity: e.target.value })
          }
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Hometown State"
          variant="outlined"
          value={authorData.hometownState}
          onChange={(e) =>
            setAuthorData({ ...authorData, hometownState: e.target.value })
          }
          style={{ marginBottom: "10px" }}
        />
        <div style={{ marginTop: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              authorData._id ? handleEditAuthor() : handleAddAuthor();
            }}
          >
            {authorData._id ? "Edit" : "Add"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleCloseModal();
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthorModal;
