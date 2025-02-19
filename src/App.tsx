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
        setHolidays(data || []);
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

  const deleteHoliday = async (date: string) => {
    try {
      const response = await fetch(`http://localhost:8080/holidays/${date}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete holiday");

      setHolidays(holidays.filter((holiday) => holiday.date !== date));
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Holiday Calendar</h1>

      {/* Calendar Component */}
      <Calendar
        onClickDay={(date) => setSelectedDate(date)}
        tileClassName={({ date }) =>
          holidays?.some((holiday) => holiday.date === date.toISOString().split("T")[0])
            ? "holiday"
            : ""
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

      {/* Holiday List */}
      {loading ? (
        <p>Loading holidays...</p>
      ) : (
        <ul className="holiday-list">
          {holidays.length > 0 ? (
            holidays.map((holiday, index) => (
              <li key={index} className="holiday-item">
                <span>{holiday.date} - {holiday.name}</span>
                <button className="delete-btn" onClick={() => deleteHoliday(holiday.date)}>❌</button>
              </li>
            ))
          ) : (
            <p>No holidays added yet.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default App;
