import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAt9ZJ4yCmU6qxwz8FIxshoDe-2wocaVq0",
  authDomain: "instagram-clone-2e5d0.firebaseapp.com",
  databaseURL: "https://instagram-clone-2e5d0.firebaseio.com",
  projectId: "instagram-clone-2e5d0",
  storageBucket: "instagram-clone-2e5d0.appspot.com",
  messagingSenderId: "353063610956",
  appId: "1:353063610956:web:270805ab42ec3b58c862e9",
  measurementId: "G-Y9VGZ07J9M",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
