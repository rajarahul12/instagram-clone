import React, { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";

function App() {
  const [posts, setPosts] = useState([
    {
      imageUrl:
        "https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png",
      username: "cleverqazi",
      caption: "WOW it works",
    },
    {
      imageUrl: "https://firebase.google.com/images/social.png",
      username: "rahul",
      caption: "Secong one",
    },
  ]);

  return (
    <div className="app">
      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="Instagram"
        />
      </div>

      <h1>Instagram clone</h1>

      {/* Posts */}

      {posts.map((post) => (
        <Post
          imageUrl={post.imageUrl}
          username={post.username}
          caption={post.caption}
        />
      ))}

      {/* Posts */}
    </div>
  );
}

export default App;
