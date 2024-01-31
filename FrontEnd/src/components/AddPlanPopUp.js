import React, { useState } from "react";
import "../styles/AddPlanPopUp.css";
import { handleAddPlan } from "../userPlanApi";
//---------------------------------------------------Modal Window to Create a New Plan-----------------
const NewPlanModal = ({ currentUserId, fetchUserPlans, closeModal }) => {
  const [newPlanData, setNewPlanData] = useState({
    date: new Date().toISOString().split("T")[0],
    start_time: "",
    end_time: "",
    description: "",
  });

  //Error message
  const [errorMessages, setErrorMessages] = useState({
    start_time: "",
    end_time: "",
  });

  //Close the Pop-Up
  const handleCancel = () => {
    closeModal();
  };

  //Handle Input Change For Newly Created Plan
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlanData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Add a New Plan
  const handleAddNewPlan = async (e) => {
    e.preventDefault();
    if (!newPlanData.start_time) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        start_time: "Start time cannot be empty.",
      }));
      return;
    }
    try {
      await handleAddPlan(currentUserId, newPlanData, fetchUserPlans);
      closeModal();
    } catch (error) {
      console.error("Error adding new plan:", error);
    }
  };

  //--------------------------------------------------Pop-Up Component-----------------------------------------
  return (
    <div className="new-plan-modal-container">
      <div className="new-plan-modal-content">
        <h2 className="new-plan-heading">Create a New Plan</h2>
        <div className="new-plan-modal-row">
          <div className="pop-up-input-wrapper">
            <label className="label-new-plan-pop-up">Date:</label>
            <input
              className="new-plan-pop-up-input"
              type="date"
              name="date"
              value={newPlanData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="new-plan-modal-second-row">
          <div className="pop-up-input-wrapper">
            <label className="label-new-plan-pop-up">Start Time:</label>
            <input
              className="new-plan-pop-up-input"
              type="time"
              name="start_time"
              value={newPlanData.start_time}
              onChange={handleInputChange}
            />
          </div>
          <div className="pop-up-input-wrapper">
            <label className="label-new-plan-pop-up">End Time:</label>
            <input
              className="new-plan-pop-up-input"
              type="time"
              name="end_time"
              value={newPlanData.end_time}
              onChange={handleInputChange}
            />
          </div>
          {errorMessages.start_time && (
            <div className="error-message">{errorMessages.start_time}</div>
          )}
        </div>
        <div className="new-plan-modal-row">
          <div className="pop-up-input-wrapper-description">
            <label className="label-new-plan-pop-up">Description:</label>
            <input
              placeholder="Enter Your Plan Descreption Here"
              className="new-plan-pop-up-input"
              type="text"
              name="description"
              value={newPlanData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="button-container-pop-up">
          <button className="button-add-plan-pop-up" onClick={handleAddNewPlan}>
            Add Plan
          </button>
          <button className="button-canscel-plan-pop-up" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPlanModal;
