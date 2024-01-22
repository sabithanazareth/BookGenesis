import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div>
      <h1>Book and Author Database</h1>

      <p>Welcome to our Book and Author Database!</p>

      <p>
        Explore a world of literature and authors. Click the links below to
        browse books or authors.
      </p>

      <div>
        <Link to="/books" className="home-link">
          Browse Books
        </Link>
        <span> | </span>
        <Link to="/authors" className="home-link">
          Explore Authors
        </Link>
      </div>
    </div>
  );
}

export default Home;
