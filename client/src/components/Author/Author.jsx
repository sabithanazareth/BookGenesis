import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import queries from "../../queries";
import Content from "./AuthContent";
import AuthorModal from "./AuthorModal";

const Author = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(queries.GET_AUTHOR_BYID, {
    variables: { id, limit: 3 },
  });
  const component = "Author";

  const [isModalOpen, setModalOpen] = useState(false);
  const [authorData, setAuthorData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    hometownCity: "",
    hometownState: "",
  });
  const [addAuthor] = useMutation(queries.ADD_AUTHOR);
  const [editAuthor] = useMutation(queries.EDIT_AUTHOR);
  const [removeAuthor] = useMutation(queries.REMOVE_AUTHOR);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const author = data.getAuthorById;

  if (!author) {
    return <p>No author found with the specified ID.</p>;
  }

  const handleOpenModal = (data) => {
    console.log("EDIT", data);
    setAuthorData(
      data || {
        first_name: "",
        last_name: "",
        date_of_birth: "",
        hometownCity: "",
        hometownState: "",
      }
    );
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAuthorData({
      first_name: "",
      last_name: "",
      date_of_birth: "",
      hometownCity: "",
      hometownState: "",
    });
  };

  const handleAddAuthor = async () => {
    try {
      await addAuthor({
        variables: {
          firstName: authorData.first_name,
          lastName: authorData.last_name,
          dateOfBirth: authorData.date_of_birth,
          hometownCity: authorData.hometownCity,
          hometownState: authorData.hometownState,
        },
      });
      handleCloseModal();
      await refetch();
    } catch (error) {
      alert(error);
    }
  };

  const handleEditAuthor = async () => {
    console.log(authorData);
    try {
      await editAuthor({
        variables: {
          id: authorData._id,
          firstName: authorData.first_name,
          lastName: authorData.last_name,
          dateOfBirth: authorData.date_of_birth,
          hometownCity: authorData.hometownCity,
          hometownState: authorData.hometownState,
        },
      });
      handleCloseModal();
      await refetch();
    } catch (error) {
      alert(error);
    }
  };

  const handleDeleteAuthor = async (id) => {
    try {
      await removeAuthor({ variables: { id } });
      alert("Deleted successfully");
      navigate("/authors");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
        }}
      >
        Author Details
      </h2>
      <Link
        style={{
          marginBottom: "30px",
        }}
        to="/authors"
      >
        Back to Authors List
      </Link>

      <Content
        component={component}
        author={author}
        handleOpenModal={handleOpenModal}
        handleDeleteAuthor={handleDeleteAuthor}
      />

      <AuthorModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        authorData={authorData}
        setAuthorData={setAuthorData}
        handleAddAuthor={handleAddAuthor}
        handleEditAuthor={handleEditAuthor}
      />
    </div>
  );
};

export default Author;
