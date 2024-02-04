import React, { useEffect, useState } from "react";
import Header from "../components/header";
import "../styles/pages/userDetailsPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationPopup from "../components/DeletePopUp";
import UserPlans from "../components/UserPlans";
import Footer from "../components/footer.js";

const UserDetailsPage = () => {
  const navigate = useNavigate();

  //Retrieve CurrentUserId from Local Storage
  const currentUserId = sessionStorage.getItem("currentUserId");
  const [userDetailsData, setUserDetailsData] = useState(null);

  //Set Edit Mode: Default false - Edit Window is Closed
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [updateUserError, setUpdateUserError] = useState(false);
  const [isUserDetailsVisible, setUserDetailsVisible] = useState(true);
  const toggleUserDetailsVisibility = () => {
    setUserDetailsVisible((prevVisibility) => !prevVisibility);
  };

  //Set Delete Pop-Up Open/Closed. Default Closed
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  //Fetch User Data
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${currentUserId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserDetailsData(data);
        setEditedUserData(data);
      } else {
        const errorData = await response.text();
        console.error(`Failed to fetch user details: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUserDetails();
    } else {
      console.error("No currentUserId found in local storage");
    }
  }, [currentUserId]);

  //Edit User Details Input Fields
  const handleEdit = () => {
    setEditedUserData(userDetailsData);
    setShowPassword(false);
    setEditMode(true);
  };

  //Save User after Registration
  const handleSave = async () => {
    try {
      //Check If Email is Not Null
      if (!editedUserData.email) {
        setUpdateUserError("Email cannot be null.");
        return;
      }
      //Check If Password is Not Null
      if (!editedUserData.password) {
        setUpdateUserError("Password cannot be null.");
        return;
      }
      // Check If the Password is at Least 8 Characters Long
      if (editedUserData.password.length < 8) {
        setUpdateUserError("Password should be at least 8 characters long.");
        return;
      }
      const response = await fetch(
        `http://localhost:3000/users/${currentUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUserData),
        }
      );

      if (response.ok) {
        setEditMode(false);
      } else {
        setUpdateUserError("Failed to update user details");
      }
    } catch (error) {
      console.error("Error during update:", error);
    }

    fetchUserDetails();
    setUpdateUserError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Delete User Account
  const handleDelete = async () => {
    setShowDeleteConfirmation(true);
  };
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${currentUserId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // User deleted successfully
        console.log("User deleted successfully!");
        setShowDeleteConfirmation(false);
        navigate("/home");
      } else {
        const data = await response.json();
        console.error("Failed to delete user:", data.error);
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  //Close the Delete Pop-Up
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  //-----------------------------------------------Component----------------------------------------

  return (
    <div>
      <Header />
      <div className={`user-details-box ${editMode ? "edit-mode" : ""}`}>
        <h2 className="user-details-heading">
          User Details
          <button
            className={`toggle-button ${
              isUserDetailsVisible ? "up-arrow" : "down-arrow"
            }`}
            onClick={toggleUserDetailsVisibility}
          >
            {isUserDetailsVisible ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : (
              <FontAwesomeIcon icon={faArrowDown} />
            )}
          </button>
        </h2>

        {isUserDetailsVisible && userDetailsData && (
          <div>
            {editMode ? (
              <div className="user-details-edit-container">
                {/* Edit mode */}
                <div className="user-details-edit-row">
                  <div className="user-details-input-wrapper">
                    <strong className="user-details-label">Name:</strong>
                    <input
                      className="user-details-input"
                      type="text"
                      name="username"
                      value={editedUserData.username}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="user-details-input-wrapper">
                    <strong className="user-details-label">Email:</strong>
                    <input
                      className="user-details-input"
                      type="text"
                      name="email"
                      value={editedUserData.email}
                      onChange={handleInputChange}
                    />
                    {updateUserError && !editedUserData.email && (
                      <p className="error-message">Email cannot be null.</p>
                    )}
                  </div>
                  <div className="user-details-input-wrapper">
                    <strong className="user-details-label">Password:</strong>
                    <div className="password-input-container">
                      <input
                        className="user-details-input"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={editedUserData.password}
                        onChange={handleInputChange}
                      />
                      <div className="eye-icon-container">
                        <FontAwesomeIcon
                          icon={showPassword ? faEye : faEyeSlash}
                          className={`eye-icon ${
                            showPassword ? "visible" : ""
                          }`}
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>
                    </div>
                    {updateUserError && !editedUserData.password && (
                      <p className="error-message">Password cannot be null.</p>
                    )}
                    {updateUserError &&
                      editedUserData.password &&
                      editedUserData.password.length < 8 && (
                        <p className="error-message">
                          Password should be at least 8 characters long.
                        </p>
                      )}
                  </div>
                </div>
                <div className="button-container-edit">
                  <button className="save-button" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <div className="delete-button-container-edit">
                    <button className="delete-button" onClick={handleDelete}>
                      <FontAwesomeIcon icon={faTimes} />
                      <span>Delete Account</span>
                    </button>
                  </div>
                  {showDeleteConfirmation && (
                    <DeleteConfirmationPopup
                      onConfirm={handleConfirmDelete}
                      onCancel={handleCancelDelete}
                    />
                  )}
                </div>
              </div>
            ) : (
              // ------------------------------------Display mode-------------------------------------
              <div className="user-details-display-container">
                <div className="user-details-display-row">
                  <p className="user-details-wrapper">
                    <strong className="user-details-label">Name:</strong>
                    {userDetailsData.username}
                  </p>

                  <p className="user-details-wrapper">
                    <strong className="user-details-label"> Email:</strong>
                    {userDetailsData.email}
                  </p>

                  <div className="password-container">
                    <strong className="user-details-label">Password:</strong>
                    {showPassword ? (
                      userDetailsData.password
                    ) : (
                      <span className="hidden-password">•••••••••</span>
                    )}
                    <div className="eye-icon-edit-container">
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        className={`eye-icon-edit ${
                          showPassword ? "visible" : ""
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </div>
                </div>
                <div className="icon-container-edit">
                  <button className="edit-icon-detail" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faEdit} />
                    <span>Edit User Details</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <UserPlans currentUserId={currentUserId} />
      <Footer />
    </div>
  );
};

export default UserDetailsPage;
