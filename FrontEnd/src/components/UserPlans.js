import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import "../styles/UserPlans.css";
import { handleDeletePlan, handleDeleteAllUserPlans } from "../userPlanApi";
import NewPlanModal from "../components/AddPlanPopUp.js";
import DeletePlansPopUp from "./DeletePlansPopUp.js";

const UserPlans = ({ currentUserId }) => {
  const [userPlans, setUserPlans] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedPlanData, setEditedPlanData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  //-------------------------------Error Message---------------------------------------------------------------------------------------------------
  const [errorMessages, setErrorMessages] = useState({
    start_time: "",
    end_time: "",
  });

  //-------------------------------Fetch the plans and category_date by the id of the logged in user-----------------------------------------------

  const fetchUserPlans = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${currentUserId}/plans`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserPlans(data);
      } else {
        console.error("Failed to fetch user plans");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchUserPlans();
    } else {
      console.error("No userId provided");
    }
  }, [currentUserId, fetchUserPlans]);

  //-----------------------------------Handle Delete user's plan-----------------------------------------

  const handleDelete = async (planId) => {
    try {
      await handleDeletePlan(currentUserId, planId, fetchUserPlans);
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  //---------------------------------------------Delete All User Plans----------------------------------
  const handleDeleteAllPlans = () => {
    setIsPopUpOpen(true);
  };
  const handleCancelDeleteAll = () => {
    setIsPopUpOpen(false);
  };

  const handleConfirmDeleteAll = () => {
    handleDeleteAllUserPlans(currentUserId, fetchUserPlans);
    setIsPopUpOpen(false);
  };
  //---------------------------------------------Handle inputs------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update editedPlanData with the new value
    setEditedPlanData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Save Edited Existing Plan
  const saveExistingPlan = async (planId) => {
    try {
      // Check if the planId matches the editMode, if not, setEditMode and fetchUserPlans
      if (editMode !== planId) {
        setEditMode(planId);
        fetchUserPlans();
        return;
      }

      // Check if there is any change in the editedPlanData
      const planToEdit = userPlans.find((plan) => plan.plan_id === planId);
      if (
        editedPlanData.start_time === planToEdit.start_time &&
        editedPlanData.end_time === planToEdit.end_time &&
        editedPlanData.description === planToEdit.description &&
        editedPlanData.date === planToEdit.date
      ) {
        // No changes, return
        setEditMode(null);
        setEditedPlanData({});
        return;
      }

      const planDataToSend = {
        ...editedPlanData,
        end_time: editedPlanData.end_time || null,
      };

      // Save the changes using the PUT method
      const url = `http://localhost:3000/users/${currentUserId}/plans/${planId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planDataToSend),
      });

      if (!planDataToSend.start_time) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          start_time: "Start time cannot be empty.",
        }));
        return;
      }

      if (response.ok) {
        console.log("Plan updated successfully!");
        fetchUserPlans();
        setEditMode(null);
        setEditedPlanData({});
      } else {
        const data = await response.json();
        console.error("Failed to update plan:", data.error);
      }
    } catch (error) {
      console.error("Error in saveExistingPlan:", error);
    }
  };

  //Edit Existing Plan
  const handleEdit = (planId) => {
    setEditMode(planId);
    const planToEdit = userPlans.find((plan) => plan.plan_id === planId);
    const currentDate = new Date(planToEdit.date).toISOString().split("T")[0];
    setEditedPlanData({
      planToEdit,
      date: currentDate,
      start_time: planToEdit.start_time,
      end_time: planToEdit.end_time || "",
      description: planToEdit.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedPlanData({});
    setErrorMessages(null);
  };

  //Format Displayed Date
  const formatTime = (time) => {
    if (time) {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } else {
      return "";
    }
  };

  //Convert Time into Minutes and the sum them up
  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":");
    const convertedTime = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    return convertedTime;
  };

  //Group User Plan into Arrays based on Its Date
  const groupedPlans = Array.isArray(userPlans)
    ? userPlans.reduce((acc, plan) => {
        const date = plan.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(plan);
        return acc;
      }, {})
    : {};

  // Sort dates in acc order, where Key is a Date of a Plan and Value is an Array of Plans
  const sortedDates = Object.keys(groupedPlans).sort(
    //Convert each string date into Date Object and then compare them
    (a, b) => new Date(a) - new Date(b)
  );
  return (
    <div>
      <div
        className={`clearfix plan-details-box ${editMode ? "edit-mode" : ""}`}
      >
        <h2 className="plan-heading">Your Daily Plans</h2>
        <div className="button-container-edit">
          <button
            className="add-new-plan-button"
            onClick={() => setIsModalOpen(true)}
          >
            Create a New Plan
          </button>
          <button
            className="delete-all-plans-button"
            onClick={handleDeleteAllPlans}
          >
            Delete All Plans
          </button>
          {isPopUpOpen && (
            <DeletePlansPopUp
              message="Are You Sure You Want to Remove All Your Plans?"
              onConfirm={handleConfirmDeleteAll}
              onCancel={handleCancelDeleteAll}
              currentUserId={Number(currentUserId)}
              fetchUserPlans={fetchUserPlans}
            />
          )}
        </div>
        <hr className="separator-line" />

        {isModalOpen && (
          <NewPlanModal
            currentUserId={currentUserId}
            fetchUserPlans={fetchUserPlans}
            closeModal={() => setIsModalOpen(false)}
          />
        )}

        <div className="horizontal-date-groups">
          {sortedDates.map((date) => {
            const key = date ? date.toString() : "undefinedKey";

            const dateGroup = groupedPlans[date];
            const sortedPlans = dateGroup.sort((a, b) => {
              const startTimeSort =
                convertToMinutes(a.start_time) - convertToMinutes(b.start_time);
              return startTimeSort;
            });

            console.log("Date Group Key:", dateGroup[0].date);

            return (
              <div key={key} className="date-group">
                <h3 className="plan-date-heading">
                  {new Date(dateGroup[0].date).toLocaleDateString()}
                </h3>
                {sortedPlans.map((userPlan) => (
                  <div key={userPlan.plan_id} className="plan-details-wrapper">
                    {editMode === userPlan.plan_id ? (
                      <div className="plan-details-edit-container">
                        <div className="third-row-wrapper-edit">
                          <div className="plan-details-input-wrapper">
                            <label className="plan-details-label">Date:</label>
                            <input
                              className="plan-details-input"
                              type="date"
                              name="date"
                              value={editedPlanData.date}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="second-row-wrapper-edit">
                          <div className="plan-details-input-wrapper">
                            <label className="plan-details-label">From:</label>
                            <input
                              className="plan-details-input"
                              type="time"
                              name="start_time"
                              value={editedPlanData.start_time}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="plan-details-input-wrapper">
                            <label className="plan-details-label">Till:</label>
                            <input
                              className="plan-details-input"
                              type="time"
                              name="end_time"
                              value={
                                editedPlanData.end_time !== null
                                  ? editedPlanData.end_time
                                  : ""
                              }
                              onChange={handleChange}
                            />
                          </div>
                          {errorMessages.start_time && (
                            <div className="error-message">
                              {errorMessages.start_time}
                            </div>
                          )}
                        </div>
                        <div className="third-row-wrapper-edit">
                          <div className="plan-details-input-wrapper">
                            <label className="plan-details-label">
                              Description:
                            </label>
                            <input
                              className="plan-details-input"
                              type="text"
                              name="description"
                              value={editedPlanData.description}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="button-container-edit">
                          <button
                            className="save-button"
                            type="button"
                            onClick={() => saveExistingPlan(userPlan.plan_id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-button"
                            type="button"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="column-plan-details-display-container">
                        <table className="plan-details-table">
                          <tbody>
                            <tr>
                              <td className="plan-details-wrapper">
                                <div>
                                  <strong className="plan-details-label">
                                    Time:
                                  </strong>
                                  {formatTime(userPlan.start_time)} -{" "}
                                  {formatTime(userPlan.end_time)}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="plan-details-wrapper">
                                <strong className="plan-details-label">
                                  Description:
                                </strong>
                                {userPlan.description}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="display-icon-container">
                          <button
                            className="edit-icon-plan"
                            onClick={() => handleEdit(userPlan.plan_id)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            data-testid={`delete-plan-${userPlan.plan_id}`}
                            className="delete-icon-plan"
                            onClick={() => handleDelete(userPlan.plan_id)}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default UserPlans;
