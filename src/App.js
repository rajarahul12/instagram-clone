import React, { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input, CircularProgress } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
import add from "./imgs/add.svg";
import { motion } from "framer-motion";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loadSignin, setLoadSignin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in....
        setUser(authUser);
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    setLoadSignin(true);
    if (username.length === 0) {
      alert("Provide an username");
      setLoadSignin(false);
      return;
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        setLoadSignin(false);
        setEmail("");
        setPassword("");
        setOpen(false);
        let userInfo = authUser.user.updateProfile({
          displayName: username,
        });
        setUser({
          displayName: username,
        });
        return userInfo;
      })
      .catch((error) => {
        setLoadSignin(false);
        alert(error.message);
        // setOpen(false);
      });
  };

  const signIn = (event) => {
    event.preventDefault();
    setLoadSignin(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        setOpenSignIn(false);
        setEmail("");
        setPassword("");
        setLoadSignin(false);
      })
      .catch((error) => {
        setLoadSignin(false);
        alert(error.message);
        // setOpen(false);
      });
  };

  const closePost = () => {
    setOpenPost(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <motion.div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                alt="Instagram logo"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              />
            </center>
            <Input
              required={true}
              type="text"
              placeholder="UserName"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loadSignin ? (
              <div className="app__loader">
                <CircularProgress />
              </div>
            ) : (
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            )}
          </form>
        </motion.div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                alt="Instagram logo"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              />
            </center>
            <Input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {loadSignin ? (
              <div className="app__loader">
                <CircularProgress />
              </div>
            ) : (
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            )}
          </form>
        </div>
      </Modal>

      <Modal open={openPost} onClose={() => setOpenPost(false)}>
        {user?.displayName ? (
          <div style={modalStyle} className={classes.paper}>
            <center>
              <img
                className="app__headerImage"
                alt="Instagram logo"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
              />
            </center>
            <ImageUpload closePost={closePost} username={user.displayName} />{" "}
          </div>
        ) : null}
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="Instagram"
        />
        {user ? (
          <div className="app__loginContainer">
            <img
              onClick={() => setOpenPost(true)}
              className="app__addposticon"
              src={add}
              alt="Add Post"
            />
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <motion.div layout className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Post
                key={id}
                postId={id}
                imageUrl={post.imageUrl}
                username={post.username}
                caption={post.caption}
                user={user}
              />
            </motion.div>
          ))}
        </motion.div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CA4WJuyMwY_/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
