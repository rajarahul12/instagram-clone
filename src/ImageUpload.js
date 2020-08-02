import React, { useState } from "react";
import { Button, Input, CircularProgress } from "@material-ui/core";
import { storage, db } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";
import { motion } from "framer-motion";

function ImageUpload({ closePost, username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (caption.length === 0) {
      alert("Provide a caption");
      return;
    }
    if (!image) {
      alert("Select an image");
      return;
    }
    setLoader(true);
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        // progress function
        const progress = Math.round(
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100
        );
        console.log("Progress : ", progress);
        setProgress(progress);
      },
      (error) => {
        setLoader(false);
        console.log(error);
        alert(error.message);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
          });
        setProgress(0);
        setCaption("");
        setImage(null);
        setLoader(false);
        closePost();
      }
    );
  };

  return (
    <div className="imageupload">
      {/* <progress className="imageupload__progress" value={progress} max="100" /> */}
      <motion.div
        className="progress-bar"
        initial={{ width: 0 }}
        animate={{ width: progress + "%" }}
      ></motion.div>

      <Input
        className="imageupload__caption"
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input
        className="imageupload__file"
        type="file"
        onChange={handleChange}
      />
      {loader ? (
        <div className="imageupload__loader">
          <CircularProgress />
        </div>
      ) : (
        <Button className="imageupload__button" onClick={handleUpload}>
          Upload
        </Button>
      )}
    </div>
  );
}

export default ImageUpload;
