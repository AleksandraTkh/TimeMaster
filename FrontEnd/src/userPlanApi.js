//Delete an Existing Plan
export const handleDeletePlan = async (
  currentUserId,
  planId,
  fetchUserPlans
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/users/${currentUserId}/plans/${planId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log("Plan deleted successfully!");
      await fetchUserPlans();
    } else {
      const data = await response.json();
      console.error("Failed to delete plan:", data.error);
    }
  } catch (error) {
    console.error("Error during delete:", error);
  }
};

//Delete All Uer Plan
export const handleDeleteAllUserPlans = async (
  currentUserId,
  fetchUserPlans
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/users/${currentUserId}/plans`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      console.log("All plans deleted successfully!");
      fetchUserPlans();
    } else {
      const data = await response.json();
      console.error("Failed to delete all plans:", data.error);
    }
  } catch (error) {
    console.error("Error in handleDeleteAllUserPlans:", error);
  }
};

//Add New Plan
export const handleAddPlan = async (
  currentUserId,
  editedPlanData,
  fetchUserPlans
) => {
  try {
    const url = `http://localhost:3000/users/${currentUserId}/plans`;

    const planData = {
      ...editedPlanData,
      user_id: currentUserId,
      end_time: editedPlanData.end_time || null,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    });

    if (response.ok) {
      await fetchUserPlans();
      console.log("New plan added successfully!");
    } else {
      const data = await response.json();
      console.error("Failed to add new plan:", data.error);
    }
  } catch (error) {
    console.error("Error during plan addition:", error);
  }
};

//Set the Values for the New Plan to Create
export const handleInputChange = (e, setEditedPlanData) => {
  const { name, value } = e.target;
  const formattedValue =
    name === "plan_date" ? new Date(value).toISOString().split("T")[0] : value;

  setEditedPlanData((prevData) => ({
    ...prevData,
    [name]: formattedValue,
  }));
};

//Save Created Plan
export const handleSavePlan = async (
  currentUserId,
  editMode,
  editedPlanData,
  setEditMode,
  setEditedPlanData,
  fetchUserPlans
) => {
  try {
    const url = editMode
      ? `http://localhost:3000/users/${currentUserId}/plans/${editMode}`
      : `http://localhost:3000/users/${currentUserId}/plans`;

    const planData = {
      ...editedPlanData,
      user_id: currentUserId,
      end_time: editedPlanData.end_time || null,
    };

    const response = await fetch(url, {
      method: editMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    });

    if (response.ok) {
      await fetchUserPlans();
      console.log("Plan saved successfully!");
      setEditMode(null);
      setEditedPlanData({});
    } else {
      const data = await response.json();
      console.error("Failed to update plan:", data.error);
    }
  } catch (error) {
    console.error("Error during update:", error);
  }
};
