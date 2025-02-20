import React, { useState, useEffect } from "react";
import API_URL from "../config.js";

const Calendar: React.FC = () => {
  const [holidayName, setHolidayName] = useState(""); // Moved inside component
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [holidays, setHolidays] = useState<{ [key: string]: string }>({});

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (month: number, year: number): number[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const fetchHolidays = async () => {
    try {
      const res = await fetch(`${API_URL}/holidays`);
      if (!res.ok) throw new Error("Failed to fetch holidays");
      const data = await res.json();
      const holidayMap: { [key: string]: string } = {};
      data.forEach((holiday: { date: string; name: string }) => {
        holidayMap[holiday.date] = holiday.name;
      });
      setHolidays(holidayMap);
    } catch (error) {
      console.error("❌ Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [currentMonth, currentYear]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const addHoliday = async (date: string) => {
    const name = prompt("Enter holiday name:");
    if (!name || name.trim() === "") {
      alert("Please enter a valid holiday name.");
      return;
    }

    const newHoliday = { date, name: name.trim() };

    try {
      const response = await fetch(`${API_URL}/holidays`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHoliday),
      });

      if (!response.ok) throw new Error(`Failed to add holiday: ${response.statusText}`);

      console.log("✅ Holiday added successfully");
      fetchHolidays();
    } catch (error) {
      console.error("❌ Error adding holiday:", error);
    }
  };

  const deleteHoliday = async (date: string) => {
    if (!window.confirm(`Delete holiday on ${date}?`)) return;

    try {
      await fetch(`${API_URL}/holidays/${date}`, { method: "DELETE" });
      fetchHolidays();
    } catch (error) {
      console.error("❌ Error deleting holiday:", error);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>Prev</button>
        <h2>
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })}{" "}
          {currentYear}
        </h2>
        <button onClick={nextMonth}>Next</button>
      </div>
      <div className="calendar-body">
        <div className="weekdays">
          {weekdays.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="days">
          {getDaysInMonth(currentMonth, currentYear).map((day) => {
            const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${day
              .toString()
              .padStart(2, "0")}`;
            return (
              <div
                key={day}
                className={`day ${holidays[date] ? "holiday" : ""}`}
                onClick={() => (holidays[date] ? deleteHoliday(date) : addHoliday(date))}
              >
                {day}
                {holidays[date] && <span className="holiday-name">{holidays[date]}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
