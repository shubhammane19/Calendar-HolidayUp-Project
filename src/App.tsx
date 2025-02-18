import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import './index.css';

const App = () => {
  const [holidays, setHolidays] = useState<any[]>([]);

  // Fetch holidays from backend on component mount
  useEffect(() => {
    fetch("http://localhost:8080/holidays")  // Make sure your backend is running here
      .then((res) => res.json())
      .then((data) => setHolidays(data))
      .catch((error) => console.error('Error fetching holidays:', error));
  }, []);

  <Calendar locale="en-US" />


  return (
    <div className="App">
      <header className="App-header">
        <h1>Holiday Calendar</h1>
        {/* Calendar UI */}
        <Calendar />
        {/* Display holidays */}
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index}>
              {holiday.date}: {holiday.name}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;