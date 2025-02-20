import { useState } from "react";
import API_URL from "../config.js";

interface AddHolidayFormProps {
  onHolidayAdded: () => void;
  selectedDate: Date | null;
}

const AddHolidayForm: React.FC<AddHolidayFormProps> = ({ onHolidayAdded, selectedDate }) => {
  const [holidayName, setHolidayName] = useState("");

  const addHoliday = async () => {
    if (!selectedDate || holidayName.trim() === "") {
      alert("Please select a date and enter a holiday name.");
      return;
    }

    const newHoliday = {
      date: selectedDate.toISOString().split("T")[0],
      name: holidayName.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/holidays`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHoliday),
      });

      if (!response.ok) throw new Error("Failed to add holiday");

      onHolidayAdded(); // Refresh holiday list
      setHolidayName(""); // Clear input
    } catch (error) {
      console.error("❌ Error adding holiday:", error);
    }
  };

  return (
    <div className="holiday-input mt-4">
      <input
        type="text"
        placeholder="Holiday Name"
        value={holidayName}
        onChange={(e) => setHolidayName(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={addHoliday} className="bg-blue-500 text-white px-4 py-2">
        Add Holiday
      </button>
    </div>
  );
};

export default AddHolidayForm;
