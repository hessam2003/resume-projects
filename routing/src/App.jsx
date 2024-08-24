import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

function App() {
  const [titles, setTitles] = useState([]);


  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        const ItemTitles = data.map(() => post.title);
        setTitles(ItemTitles);
      });
  }, []);

 

  const showPostBody = (postId) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setPostBody(data.body);
        setShowText(true);
      });
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <div>
                {titles.map((title, index) => (
                  <Link to={`/post/${index + 1}`} key={index + 1}>
                    <p onClick={() => showPostBody(index + 1)}>{title}</p>
                  </Link>
                ))}
              </div>
            }
          />
          <Route
            path="/post/:id"
            element={
              <PostPage showPostBody={showPostBody} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function PostPage() {
  const { id } = useParams();
  const [Body, setBody] = useState("");

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBody(data.body);
      });
  }, [id]);

  return (
    <div>
      <p>{Body}</p>
    </div>
  );
}

export default App;



