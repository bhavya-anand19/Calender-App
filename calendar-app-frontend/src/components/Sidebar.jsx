import React, { useState } from "react";
import "../App.css";

const dummyGoals = [
  {
    id: "1",
    title: "Academics",
    color: "#1e90ff",
    lightColor: "#d6eaff",
    tasks: ["Study DSA", "Revise Notes", "Attend Lectures"],
  },
  {
    id: "2",
    title: "Sports",
    color: "#28a745",
    lightColor: "#d9f5e3",
    tasks: ["Football Practice", "Gym", "Swimming"],
  },
  {
    id: "3",
    title: "Learn",
    color: "#f0703a",
    lightColor: "#fbe3d6",
    tasks: ["AI based agents", "MLE", "DE related", "Basics"],
  },
  {
    id: "4",
    title: "Work",
    color: "#ffc107",
    lightColor: "#fff4d6",
    tasks: ["UI Review", "Code Cleanup", "Standups"],
  },
  {
    id: "5",
    title: "Creative",
    color: "#e83e8c",
    lightColor: "#fce0ea",
    tasks: ["Sketching", "Writing Blog", "Photography"],
  },
];

const Sidebar = () => {
  const [openGoal, setOpenGoal] = useState(null);

  const toggleGoal = (id) => {
    setOpenGoal(openGoal === id ? null : id);
  };

  return (
    <div className="sidebar">
      <h3>Goals</h3>
      {dummyGoals.map((goal) => (
        <div
          key={goal.id}
          className="goal-box"
          style={{
            border: `2px solid ${goal.color}`,
            backgroundColor: goal.lightColor,
          }}
        >
          <h4
            className="goal-title"
            style={{ color: goal.color }}
            onClick={() => toggleGoal(goal.id)}
          >
            {goal.title}
          </h4>
          {openGoal === goal.id && (
            <div className="task-list">
              <h4
                style={{
                  fontSize: "bold",
                }}
              >
                Tasks:{" "}
              </h4>
              {goal.tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="fc-event"
                  title={task}
                  style={{
                    backgroundColor: goal.color,
                    color: "white",
                    marginBottom: "8px",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                  data-event={`{
                    "title": "${task}",
                    "color": "${goal.color}",
                    "category": "${goal.title.toLowerCase()}"
                  }`}
                >
                  {task}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
