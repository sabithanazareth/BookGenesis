import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import queries from "../queries";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBookTerm, setSearchBookTerm] = useState("");
  const [searchType, setSearchType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [executeSearch, { loading, data }] = useLazyQuery(
    searchType === "authorsByName"
      ? queries.GET_AUTH_BYNAME
      : searchType === "booksByGenre"
      ? queries.GET_BOOKS_BYGENRE
      : queries.GET_BOOKS_BYPRICE,
    {
      variables: {
        searchTerm: searchType === "authorsByName" ? searchTerm : undefined,
        genre: searchType === "booksByGenre" ? searchBookTerm : undefined,
        min:
          searchType === "booksByPriceRange"
            ? parseFloat(minPrice) || 0
            : undefined,
        max:
          searchType === "booksByPriceRange" ? parseFloat(maxPrice) : undefined,
      },
    }
  );

  const handleSearch = () => {
    if (!searchType) {
      alert("Please select a search type.");
      return;
    }
    switch (searchType) {
      case "booksByPriceRange":
        if (
          isNaN(parseFloat(minPrice)) ||
          isNaN(parseFloat(maxPrice)) ||
          parseFloat(minPrice) > parseFloat(maxPrice) ||
          parseFloat(minPrice) < 0 ||
          parseFloat(maxPrice) < 0
        ) {
          alert("Please enter valid price range.");
          return;
        }
        break;
      case "authorsByName":
        if (!searchTerm.trim()) {
          alert("Please enter a search term for authors.");
          return;
        }
        break;
      case "booksByGenre":
        if (!searchBookTerm.trim()) {
          alert("Please enter a search term for books by genre.");
          return;
        }
        break;
      default:
        break;
    }

    executeSearch();
  };

  // Function to render search results based on the search type
  const renderSearchResults = () => {
    if (searchType === "authorsByName") {
      return (
        <Grid container spacing={2}>
          {data?.searchAuthorsByName.map((author) => (
            <Grid item key={author._id} xs={12} sm={6} md={4} lg={3}>
              <Paper elevation={3} style={{ padding: "16px" }}>
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
                <p>Date of Birth: {author.date_of_birth}</p>
                <p>
                  Hometown: {`${author.hometownCity}, ${author.hometownState}`}
                </p>
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
              </Paper>
            </Grid>
          ))}
        </Grid>
      );
    } else if (searchType === "booksByGenre") {
      return (
        <Grid container spacing={2}>
          {data?.booksByGenre.map((book) => (
            <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
              <Paper elevation={3} style={{ padding: "16px" }}>
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
              </Paper>
            </Grid>
          ))}
        </Grid>
      );
    } else if (searchType === "booksByPriceRange") {
      return (
        <Grid container spacing={2}>
          {data?.booksByPriceRange.map((book) => (
            <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
              <Paper elevation={3} style={{ padding: "16px" }}>
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
              </Paper>
            </Grid>
          ))}
        </Grid>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        margin: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <label style={{ marginRight: "10px" }}>Select Search Type:</label>
      <select
        value={searchType}
        onChange={(e) => {
          setSearchType(e.target.value);
        }}
        style={{ marginRight: "10px" }}
      >
        <option value="">Select Search Type</option>
        <option value="authorsByName">Search Authors by Name</option>
        <option value="booksByGenre">Search Books by Genre</option>
        <option value="booksByPriceRange">Search Books by Price Range</option>
      </select>

      {searchType === "booksByPriceRange" && (
        <>
          <label style={{ marginRight: "10px" }}>Min Price:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <label style={{ marginRight: "10px" }}>Max Price:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ marginRight: "10px" }}
          />
        </>
      )}
      {searchType === "authorsByName" && (
        <>
          <label style={{ marginRight: "10px" }}>Search Term:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "10px" }}
          />
        </>
      )}
      {searchType === "booksByGenre" && (
        <>
          <label style={{ marginRight: "10px" }}>Search Term:</label>
          <input
            type="text"
            value={searchBookTerm}
            onChange={(e) => setSearchBookTerm(e.target.value)}
            style={{ marginRight: "10px" }}
          />
        </>
      )}

      <button
        style={{ marginBottom: "20px", marginTop: "10px" }}
        onClick={handleSearch}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}

      {data && <div>{renderSearchResults()}</div>}
    </div>
  );
};

export default SearchComponent;
