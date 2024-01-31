import React from "react";
import "../styles/DeletePopUp.css";

const DeleteConfirmationPopup = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-confirmation-popup">
      <p>Are You Sure You Want to Delete Your Account?</p>
      <div className="button-container">
        <button className="confirm-button" onClick={onConfirm}>
          Yes
        </button>
        <button className="cancel-con-button" onClick={onCancel}>
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
