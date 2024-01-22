import { gql } from "@apollo/client";

const GET_AUTHORS = gql`
  query authors($limit: Int) {
    authors {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books(limit: $limit) {
        _id
        title
      }
    }
  }
`;

const GET_BOOKS = gql`
  query books {
    books {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;
const GET_BOOKS_BYGENRE = gql`
  query booksByGenre($genre: String!) {
    booksByGenre(genre: $genre) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;
const GET_BOOKS_BYPRICE = gql`
  query booksByPriceRange($min: Float!, $max: Float!) {
    booksByPriceRange(min: $min, max: $max) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;
const GET_AUTHOR_BYID = gql`
  query getAuthorById($id: String!, $limit: Int) {
    getAuthorById(_id: $id) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books(limit: $limit) {
        _id
        title
      }
    }
  }
`;
const GET_BOOK_BYID = gql`
  query getBookById($id: String!) {
    getBookById(_id: $id) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;
const GET_AUTH_BYNAME = gql`
  query searchAuthorsByName($searchTerm: String!, $limit: Int) {
    searchAuthorsByName(searchTerm: $searchTerm) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books(limit: $limit) {
        _id
        title
      }
    }
  }
`;
const ADD_AUTHOR = gql`
  mutation addAuthor(
    $firstName: String!
    $lastName: String!
    $dateOfBirth: String!
    $hometownCity: String!
    $hometownState: String!
    $limit: Int
  ) {
    addAuthor(
      first_name: $firstName
      last_name: $lastName
      date_of_birth: $dateOfBirth
      hometownCity: $hometownCity
      hometownState: $hometownState
    ) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books(limit: $limit) {
        _id
        title
      }
    }
  }
`;
const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $genres: [String!]!
    $publicationDate: String!
    $publisher: String!
    $summary: String!
    $isbn: String!
    $language: String!
    $pageCount: Int!
    $price: Float!
    $format: [String!]!
    $authorId: String!
  ) {
    addBook(
      title: $title
      genres: $genres
      publicationDate: $publicationDate
      publisher: $publisher
      summary: $summary
      isbn: $isbn
      language: $language
      pageCount: $pageCount
      price: $price
      format: $format
      authorId: $authorId
    ) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;
const EDIT_AUTHOR = gql`
  mutation editAuthor(
    $id: String!
    $firstName: String
    $lastName: String
    $dateOfBirth: String
    $hometownCity: String
    $hometownState: String
    $limit: Int
  ) {
    editAuthor(
      _id: $id
      first_name: $firstName
      last_name: $lastName
      date_of_birth: $dateOfBirth
      hometownCity: $hometownCity
      hometownState: $hometownState
    ) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books(limit: $limit) {
        _id
        title
      }
    }
  }
`;
const EDIT_BOOK = gql`
  mutation editBook(
    $id: String!
    $title: String
    $genres: [String]
    $publicationDate: String
    $publisher: String
    $summary: String
    $isbn: String
    $language: String
    $pageCount: Int
    $price: Float
    $format: [String]
    $authorId: String
  ) {
    editBook(
      _id: $id
      title: $title
      genres: $genres
      publicationDate: $publicationDate
      publisher: $publisher
      summary: $summary
      isbn: $isbn
      language: $language
      pageCount: $pageCount
      price: $price
      format: $format
      authorId: $authorId
    ) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;
const REMOVE_AUTHOR = gql`
  mutation removeAuthor($id: String!, $limit: Int) {
    removeAuthor(_id: $id) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books(limit: $limit) {
        _id
        title
      }
    }
  }
`;
const REMOVE_BOOK = gql`
  mutation removeBook($id: String!) {
    removeBook(_id: $id) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

let exported = {
  GET_AUTHORS,
  GET_BOOKS,
  GET_BOOKS_BYGENRE,
  GET_BOOKS_BYPRICE,
  GET_AUTHOR_BYID,
  GET_BOOK_BYID,
  GET_AUTH_BYNAME,
  ADD_AUTHOR,
  ADD_BOOK,
  EDIT_AUTHOR,
  EDIT_BOOK,
  REMOVE_AUTHOR,
  REMOVE_BOOK,
};

export default exported;
