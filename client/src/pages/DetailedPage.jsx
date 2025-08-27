import React, { useState } from 'react';
import { FaCalendarAlt, FaInfoCircle, FaPhone } from 'react-icons/fa';
import elephantImage from '../assets/elephant1.jpg'; // Adjust the path as needed

const SingleMonthCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getDayOfWeek = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInCurrentMonth = daysInMonth(currentDate);
    const startDay = getDayOfWeek(currentDate);
    const totalDays = 35; // 5 rows * 7 days per week
    const days = [];
    const today = new Date().getDate();

    // Fill empty cells for days before the first day
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
    }

    // Fill the calendar with days of the month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const isPastDay = day < today && currentDate.getMonth() === new Date().getMonth();
      const isToday = day === today && currentDate.getMonth() === new Date().getMonth();

      days.push(
        <div
          key={day}
          className={`h-12 w-12 flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg transition duration-200 ease-in-out ${
            isPastDay ? 'bg-gray-200 text-gray-400' :
            isToday ? 'bg-yellow-300 font-bold text-black' :
            selectedDate === day && currentDate.getMonth() === new Date().getMonth() ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
          }`}
          onClick={() => {
            if (!isPastDay) {
              setSelectedDate(day);
            }
          }}
        >
          {day}
        </div>
      );
    }

    // Fill empty cells after the last day to maintain 5 rows
    for (let i = days.length; i < totalDays; i++) {
      days.push(<div key={`empty-after-${i}`} className="h-12 w-12"></div>);
    }

    return days;
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission logic here
    alert(`Feedback submitted: ${feedback}`);
    setFeedback('');
  };

  return (
    <div className="flex flex-col items-center h-screen p-4">
      {/* Elephant Image in a full width box with height 1000px */}
      <div className="relative w-full h-[1000px] mb-6">
        <img
          src={elephantImage} 
          alt="Elephant"
          className="object-cover w-full h-full shadow-md rounded-lg" 
        />
      </div>

      {/* Details Section */}
      <Section title="Details ">
        <p className="text-gray-600 mb-2">
          The African elephant is the largest land animal. They are known for their intelligence and social behavior.
        </p>
        <p className="text-gray-600 mb-2">
          <strong>History:</strong> This elephant has had over 100 rides and is beloved by many visitors!
        </p>
      </Section>

      {/* Booking Button at the Bottom */}
      <button
        onClick={() => setShowCalendar(true)} // Show calendar on button click
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-200 shadow-lg mb-4"
      >
        Booking
      </button>

      {/* Booking Instructions Section */}
      <Section title="Booking Instructions">
        <p className="text-gray-600 mb-2">
          To book your experience, please follow these steps:
        </p>
        <ol className="list-decimal list-inside text-gray-600">
          <li>Select a date from the calendar.</li>
          <li>Fill in your contact details.</li>
          <li>Confirm your booking.</li>
        </ol>
      </Section>

      {/* Contact Section */}
      <Section title="Contact Us">
        <p className="text-gray-600">
          If you have any questions, feel free to reach out to us:
        </p>
        <p className="text-gray-800 font-bold">Phone: (123) 456-7890</p>
        <p className="text-gray-800 font-bold">Email: info@example.com</p>
      </Section>

      {/* Feedback Section */}
      <Section title="Feedback">
        <form onSubmit={handleFeedbackSubmit}>
          <textarea
            className="w-full h-24 border border-gray-300 rounded-lg p-2 mb-4"
            placeholder="Leave your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit Feedback
          </button>
        </form>
      </Section>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevMonth}
                className="text-blue-500 hover:text-blue-700 font-semibold transition duration-200 ease-in-out"
              >
                &lt; Prev
              </button>
              <h2 className="text-2xl font-bold text-center">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={handleNextMonth}
                className="text-blue-500 hover:text-blue-700 font-semibold transition duration-200 ease-in-out"
              >
                Next &gt;
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="font-semibold text-center text-gray-700">{day}</div>
              ))}
              {renderCalendar()}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCalendar(false)} // Close the calendar
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Space */}
      <div className="h-16"></div>
    </div>
  );
};

// Section component to avoid repetitive code
const Section = ({ title, children }) => (
  <div className="rounded-lg shadow-lg p-6 w-full max-w-full mb-6">
    <h3 className="text-xl font-semibold mb-4 text-blue-800">{title}</h3>
    {children}
  </div>
);

export default SingleMonthCalendar;
