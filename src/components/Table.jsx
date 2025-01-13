import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";
import './Table.css';

const AppToaster = Toaster.create({
  position: "top",
});

function Table() {
  const [data, setData] = useState([]); // API data
  const [search, setSearch] = useState(""); // Search term
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const rowsPerPage = 4; // Rows per page
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    Number: "",
    Address: "",
  });

  // we can use Fetch or axios data from API
  useEffect(() => {
    axios
      .get("https://6770d5aa2ffbd37a63cd9b1a.mockapi.io/api/data/users")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  // Add user (POST Method)
  const addUser = () => {
    if (!newUser.first_name || !newUser.email) {
      AppToaster.show({
        message: "First Name and Email are required",
        intent: "danger",
        timeout: 3000,
      });
      return;
    }

    axios
      .post("https://6770d5aa2ffbd37a63cd9b1a.mockapi.io/api/data/users", newUser)
      .then((response) => {
        setData([...data, response.data]);
        AppToaster.show({ 
          message: "User Added Successfully", 
          intent: "success", 
          timeout: 3000 });
        setNewUser({
          first_name: "",
          last_name: "",
          email: "",
          gender: "",
          Number: "",
          Address: "",
        });
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  // Update user (PUT Method)
  const updateUser = (id) => {
    const userToUpdate = data.find((user) => user.id === id);
    axios
      .put(`https://6770d5aa2ffbd37a63cd9b1a.mockapi.io/api/data/users/${id}`, userToUpdate)
      .then(() => AppToaster.show({ message: "User Updated Successfully", intent: "success", timeout: 3000 }))
      .catch((error) => console.error("Error updating user:", error));
  };

  // Delete user (Delete)
  const deleteUser = (id) => {
    axios
      .delete(`https://6770d5aa2ffbd37a63cd9b1a.mockapi.io/api/data/users/${id}`)
      .then(() => {
        setData(data.filter((user) => user.id !== id));
        AppToaster.show({ message: "User Deleted Successfully", intent: "success", timeout: 3000 });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        AppToaster.show({ 
          message: "Failed to delete user. Try again.", 
          intent: "danger", 
          timeout: 3000 });
      });
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Filter and paginate data
  const filteredData = data.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      search === "" ||
      item.first_name?.toLowerCase().includes(searchTerm) ||
      item.last_name?.toLowerCase().includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm) ||
      item.Number?.includes(searchTerm)
    );
  });

  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="table-container">
      <h3 className="table-heading"> Employee Directory System </h3>
      <div className="search-bar-container">
        <InputGroup
          className="search-bar"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
    }}
  />
</div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <EditableText
                    value={user.first_name}
                    onChange={(value) =>
                      setData(data.map((u) => (u.id === user.id ? { ...u, first_name: value } : u)))
                    }
                  />
                </td>
                <td>
                  <EditableText
                    value={user.last_name}
                    onChange={(value) =>
                      setData(data.map((u) => (u.id === user.id ? { ...u, last_name: value } : u)))
                    }
                  />
                </td>
                <td>
                  <EditableText
                    value={user.email}
                    onChange={(value) =>
                      setData(data.map((u) => (u.id === user.id ? { ...u, email: value } : u)))
                    }
                  />
                </td>
                <td>
                  <EditableText
                    value={user.gender}
                    onChange={(value) =>
                      setData(data.map((u) => (u.id === user.id ? { ...u, gender: value } : u)))
                    }
                  />
                </td>
                <td>
                  <EditableText
                    value={user.Number}
                    onChange={(value) =>
                      setData(data.map((u) => (u.id === user.id ? { ...u, Number: value } : u)))
                    }
                  />
                </td>
                <td>
                  <EditableText
                    value={user.Address}
                    onChange={(value) =>
                      setData(data.map((u) => (u.id === user.id ? { ...u, Address: value } : u)))
                    }
                  />
                </td>
                <td>
                  <Button intent="primary" onClick={() => updateUser(user.id)}>
                    Update
                  </Button>
                  &nbsp;
                  <Button intent="danger" onClick={() => deleteUser(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No data available</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            {Object.keys(newUser).map((key) => (
              <td key={key}>
                <InputGroup
                  placeholder={key.replace("_", " ").toUpperCase()}
                  value={newUser[key]}
                  onChange={(e) => setNewUser({ ...newUser, [key]: e.target.value })}
                />
              </td>
            ))}
            <td>
              <Button intent="success" onClick={addUser} className="add-button">
                Add
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="pagination-controls">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default Table;
