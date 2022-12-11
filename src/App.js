import "./App.css";
import React, { useState } from "react";
import firebaseConfig from "./Config/firebase-config";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  doc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const colRef = collection(db, "books");
const q = query(colRef, orderBy("createdAt"));

onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  // console.log(books);
});

function App() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [id, setId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleSubmit = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log("User Created", cred.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setEmail("");
    setPassword("");
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((cred) => {
        console.log("User Logged In", cred.user);
        setLoginEmail("");
        setLoginPassword("");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  const signOutFunction = () => {
    signOut(auth)
      .then(console.log("User Signed Out"))
      .catch((e) => {
        console.log(e.message);
      });
  };

  const addBook = () => {
    addDoc(colRef, {
      title,
      author,
      createdAt: serverTimestamp(),
    }).then(() => {
      setTitle("");
      setAuthor("");
    });
  };

  const deleteBook = () => {
    const docRef = doc(db, "books", id);
    deleteDoc(docRef).then(() => {
      setId("");
    });
  };

  const docRef = doc(db, "books", "EeENVwOVP7RAl5W0HFK2");
  onSnapshot(docRef, (doc) => {
    // console.log(doc.data(), doc.id);
  });

  const updateBook = () => {
    const docRef = doc(db, "books", updateId);
    updateBook(docRef, {
      title: "Updated Title",
    });
    setId("");
  };

  onAuthStateChanged(auth, (user) => {
    console.log("user state changed", user);
  });
  return (
    <div className="App container">
      <h1>Understanding Firebase 9</h1>
      <div className="form py-4 ">
        <form onSubmit={addBook}>
          <label className="px-2 py-3">Title</label>
          <input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-2"
          />
          <br />
          <label className="px-2 py-3">Author</label>
          <input
            name="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border border-2"
          />
          <br />
          <button
            className="btn btn-dark"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              addBook();
            }}
          >
            Submit
          </button>
        </form>
        <form className="App container py-5" onSubmit={deleteBook}>
          <label htmlFor="id" className="px-2">
            Document ID
          </label>
          <input
            type="text"
            name="id"
            required
            className="px-2"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <br />
          <button
            className="btn btn-dark my-4"
            onClick={(e) => {
              e.preventDefault();
              deleteBook();
            }}
          >
            Delete
          </button>
        </form>
        <form className="App container py-5" onSubmit={updateBook}>
          <label htmlFor="id" className="px-2">
            Document ID
          </label>
          <input
            type="text"
            name="id"
            required
            className="px-2"
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
          />
          <br />
          <button
            className="btn btn-dark my-4"
            onClick={(e) => {
              e.preventDefault();
              updateBook();
            }}
          >
            Update
          </button>
        </form>
        <h2>Register User</h2>
        <form className="App container" onSubmit={handleSubmit}>
          <label htmlFor="email">Enter Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <br />

          <label htmlFor="email">Enter Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <br />

          <button
            className="btn btn-dark"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Submit
          </button>
        </form>
        <h2>Signin User</h2>
        <form className="App container" onSubmit={handleLogin}>
          <label htmlFor="email">Enter Email</label>
          <input
            type="text"
            value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value);
            }}
          ></input>
          <br />

          <label htmlFor="email">Enter Password</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          ></input>
          <br />

          <button
            className="btn btn-dark"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            Submit
          </button>
        </form>
        <br />
        <form onSubmit={signOutFunction}>
          <button
            className="btn btn-dark"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              signOutFunction();
            }}
          >
            LOGOUT
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
