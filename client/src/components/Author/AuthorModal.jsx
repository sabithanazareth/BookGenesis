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
          value={authorData.first_name}
          onChange={(e) =>
            setAuthorData({
              ...authorData,
              first_name: e.target.value,
            })
          }
          style={{ marginBottom: "10px" }}
          required
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={authorData.last_name}
          onChange={(e) =>
            setAuthorData({
              ...authorData,
              last_name: e.target.value,
            })
          }
          style={{ marginBottom: "10px" }}
          required
        />
        <TextField
          label="Date of Birth"
          variant="outlined"
          value={authorData.date_of_birth}
          placeholder="M or MM/DD/YYYY format"
          onChange={(e) =>
            setAuthorData({
              ...authorData,
              date_of_birth: e.target.value,
            })
          }
          style={{ marginBottom: "10px" }}
          required
        />
        <TextField
          label="Hometown City"
          variant="outlined"
          value={authorData.hometownCity}
          onChange={(e) =>
            setAuthorData({ ...authorData, hometownCity: e.target.value })
          }
          style={{ marginBottom: "10px" }}
          required
        />
        <TextField
          label="Hometown State"
          variant="outlined"
          value={authorData.hometownState}
          onChange={(e) =>
            setAuthorData({ ...authorData, hometownState: e.target.value })
          }
          style={{ marginBottom: "10px" }}
          required
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
