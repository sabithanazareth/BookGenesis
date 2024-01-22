import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import "./App.css";
import Home from "./components/Home";
import Error400 from "./components/Error400";
import Error404 from "./components/Error404";
import AuthorList from "./components/Author/AuthorsList";
import Author from "./components/Author/Author";
import Book from "./components/Book/Book";
import BooksList from "./components/Book/BooksList";
import { Route, Link, Routes } from "react-router-dom";
import Search from "./components/Search";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the Marvel Characters World</h1>
          <Link className="objectlink" to="/">
            Home
          </Link>
          <Link className="objectlink" to={"/authors"}>
            Authors
          </Link>
          <Link className="objectlink" to={"/books"}>
            Books
          </Link>
          <Link className="objectlink" to={"/search"}>
            Search
          </Link>
        </header>
        <br />
        <br />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/authors" element={<AuthorList />} />
            <Route path="/authors/:id" element={<Author />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/books/:id" element={<Book />} />
            <Route path="/search" element={<Search />} />
            <Route path="/400" element={<Error400 />} />
            <Route path="/404" element={<Error404 />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
