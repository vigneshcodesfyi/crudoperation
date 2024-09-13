import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3030/users";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addUser = () => {
    if (name && email) {
      axios
        .post(API_URL, { name, email })
        .then((response) => setUsers([...users, response.data]))
        .catch((error) => console.error("Error adding user:", error));
      setName("");
      setEmail("");
    }
  };

  const deleteUser = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setUsers(users.filter((user) => user.id !== id)))
      .catch((error) => console.error("Error deleting user:", error));
  };

  const updateUser = () => {
    if (editingUser && name && email) {
      axios
        .put(`${API_URL}/${editingUser.id}`, { name, email })
        .then((response) => {
          setUsers(
            users.map((user) =>
              user.id === editingUser.id ? response.data : user
            )
          );
          setEditingUser(null);
          setName("");
          setEmail("");
        })
        .catch((error) => console.error("Error updating user:", error));
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  return (
    <div className="container">
      <h1 className="title">Simple CRUD with React</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" onClick={editingUser ? updateUser : addUser}>
          {editingUser ? "Update User" : "Add User"}
        </button>
      </div>

      <h2 className="subtitle">User List</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li className="user-item" key={user.id}>
            {user.name} - {user.email}
            <div className="actions">
              <button className="btn edit" onClick={() => editUser(user)}>
                Edit
              </button>
              <button
                className="btn delete"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
