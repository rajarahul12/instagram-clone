import React from "react";
import "./Post.css";
import Avatar from "@material-ui/core/avatar";

function Post({ imageUrl, username, caption }) {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      {/* header ->  avatar + username */}

      {/* image */}
      <img className="post__image" src={imageUrl} alt="UserImage" />

      {/* username +  caption */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
    </div>
  );
}

export default Post;
