import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

interface Holiday {
  date: string;
  name: string;
}

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [holidayName, setHolidayName] = useState("");
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/holidays")
      .then((res) => res.json())
      .then((data) => {
        setHolidays(data || []); // Ensure it's always an array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching holidays:", error);
        setLoading(false);
      });
  }, []);

  const addHoliday = async () => {
    if (!selectedDate || holidayName.trim() === "") {
      alert("Please select a date and enter a holiday name.");
      return;
    }

    const newHoliday = {
      date: selectedDate.toISOString().split("T")[0],
      name: holidayName,
    };

    try {
      const response = await fetch("http://localhost:8080/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHoliday),
      });

      if (!response.ok) throw new Error("Failed to add holiday");

      setHolidays([...holidays, newHoliday]);
      setHolidayName("");
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Holiday Calendar</h1>

      {/* Calendar Component */}
      <Calendar
        onClickDay={(date) => setSelectedDate(date)}
        tileClassName={({ date }) =>
          holidays?.some((holiday) => holiday.date === date.toISOString().split("T")[0]) ? "holiday" : ""
        }
      />

      {/* Display Selected Date */}
      {selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}

      {/* Add Holiday Input */}
      <div className="holiday-input">
        <input
          type="text"
          placeholder="Holiday Name"
          value={holidayName}
          onChange={(e) => setHolidayName(e.target.value)}
        />
        <button onClick={addHoliday}>Add Holiday</button>
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading holidays...</p>
      ) : (
        <ul className="holiday-list">
          {holidays?.map((holiday, index) => (
            <li key={index} className="holiday-item">
              {holiday.date}: {holiday.name}
            </li>
          )) || []}
        </ul>
      )}
    </div>
  );
};

export default App;
