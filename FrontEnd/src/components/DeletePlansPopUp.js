import React from "react";
import "../styles/DeletePlansPopUp.css";

const DeletePlansPopUp = ({
  message,
  onConfirm,
  onCancel,
  currentUserId,
  fetchUserPlans,
}) => {
  //----------------------------------Component-----------------------------
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <p>{message}</p>
        <div className="button-container">
          <button
            className="confirm-button"
            onClick={() => onConfirm(currentUserId, fetchUserPlans)}
          >
            Delete
          </button>
          <button className="cancel-con-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlansPopUp;
