import React, { useState, useContext, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import queries from "../../queries";
import { useLocation } from "react-router-dom";
import Content from "./AuthContent";
import AuthorModal from "./AuthorModal";

const AuthorList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const limit = queryParams.get("limit");
  const component = "AuthorsList";
  const { loading, error, data, refetch } = useQuery(queries.GET_AUTHORS, {
    variables: { limit: parseInt(limit, 10) || undefined },
  });
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

  useEffect(() => {
    refetch();
  }, []);

  const handleOpenModal = useCallback((data) => {
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
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setAuthorData({
      first_name: "",
      last_name: "",
      date_of_birth: "",
      hometownCity: "",
      hometownState: "",
    });
  }, []);

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

  const handleDeleteAuthor = useCallback(async (id) => {
    try {
      await removeAuthor({ variables: { id } });
      await refetch();
    } catch (error) {
      alert(error);
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Authors</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Add Author
      </Button>
      <Grid container spacing={2}>
        {data.authors.map((author) => (
          <Grid item key={author._id} xs={12} sm={6} md={4} lg={3}>
            <Content
              component={component}
              author={author}
              handleOpenModal={handleOpenModal}
              handleDeleteAuthor={handleDeleteAuthor}
            />
          </Grid>
        ))}
      </Grid>

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

export default AuthorList;
