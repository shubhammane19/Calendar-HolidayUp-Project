import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import API_URL from "./config";
import AddHolidayForm from "./components/AddHolidayForm";

interface Holiday {
  date: string;
  name: string;
}

const App = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch holidays from the backend
  const fetchHolidays = async () => {
    try {
      const response = await fetch(`${API_URL}/holidays`);
      const data = await response.json();
      setHolidays(data);
    } catch (error) {
      console.error("❌ Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  // Delete holiday function
  const deleteHoliday = async (date: string) => {
    try {
      const response = await fetch(`${API_URL}/holidays/${date}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete holiday");

      setHolidays(holidays.filter((holiday) => holiday.date !== date));
    } catch (error) {
      console.error("❌ Error deleting holiday:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Holiday Calendar</h1>

      {/* Calendar Component */}
      <Calendar
        onClickDay={(date) => setSelectedDate(date)}
        tileClassName={({ date }) =>
          holidays.some((holiday) => holiday.date === date.toISOString().split("T")[0])
            ? "holiday"
            : ""
        }
      />

      {/* Display Selected Date */}
      {selectedDate && <p className="mt-2">Selected Date: {selectedDate.toDateString()}</p>}

      {/* Add Holiday Form */}
      <AddHolidayForm onHolidayAdded={fetchHolidays} selectedDate={selectedDate} />

      {/* Holiday List */}
      <ul className="mt-4">
        {holidays.length > 0 ? (
          holidays.map((holiday, index) => (
            <li key={index} className="p-2 border-b flex justify-between">
              <span>{holiday.date} - {holiday.name}</span>
              <button className="text-red-500" onClick={() => deleteHoliday(holiday.date)}>❌</button>
            </li>
          ))
        ) : (
          <p>No holidays added yet.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
