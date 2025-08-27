import React, { useState } from 'react';
import { FaCalendarAlt, FaInfoCircle, FaPhone } from 'react-icons/fa';
import elephantImage from '../assets/elephant1.jpg';
import 'animate.css';
import { useNavigate } from 'react-router-dom';

const SingleMonthCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();

    const elephantName = "Mathugama Sanju";

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
        const totalDays = 35;
        const days = [];
        const today = new Date().getDate();

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-12 w-12"></div>);
        }

        for (let day = 1; day <= daysInCurrentMonth; day++) {
            const isPastDay = day < today && currentDate.getMonth() === new Date().getMonth();
            const isToday = day === today && currentDate.getMonth() === new Date().getMonth();

            days.push(
                <div
                    key={day}
                    className={`h-12 w-12 flex items-center justify-center cursor-pointer border rounded-lg transition duration-300 ease-in-out ${isPastDay ? 'bg-gray-200 text-gray-400' :
                            isToday ? 'bg-yellow-300 font-bold text-black animate__animated animate__pulse' :
                                selectedDate === day ? 'bg-blue-500 text-white animate__animated animate__pulse' : 'hover:bg-gray-200'
                        }`}
                    onClick={() => {
                        if (!isPastDay) {
                            const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            setSelectedDate(day);
                            navigate(`/confirmbooking?date=${fullDate.toISOString().split('T')[0]}&elephantName=${encodeURIComponent(elephantName)}`);
                        }
                    }}
                >
                    {day}
                </div>
            );
        }

        for (let i = days.length; i < totalDays; i++) {
            days.push(<div key={`empty-after-${i}`} className="h-12 w-12"></div>);
        }

        return days;
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        alert(`Feedback submitted: ${feedback}`);
        setFeedback('');
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
            <header className="mb-8">
                <h2 className="text-4xl font-bold text-center text-gray-800">Mathugama Sanju</h2>
                <p className="text-lg text-gray-600 text-center mt-2">The Heart and Soul of Mathugama</p>
            </header>
            <div className="relative w-full max-h-[700px] overflow-hidden rounded-lg mb-6">
                <img src={elephantImage} alt="Elephant" className="object-cover w-full h-full shadow-md" />
            </div>

            <Section title="Details about Mathugama Sanju">
                <p className="text-gray-600 mb-4">
                    Meet Mathugama Sanju, a majestic Sri Lankan elephant renowned for his gentle spirit and grand stature. With a rich history of participation in various cultural festivals, Sanju has captured the hearts of many with his graceful presence and remarkable temperament.
                </p>

                <h4 className="text-lg font-semibold text-yellow-700 mb-2">Past Perahera Experiences</h4>
                <p className="text-gray-600 mb-4">
                    Sanju has been a cherished participant in numerous Perahera festivals across Sri Lanka. His stunning adornments and majestic movements add a sense of grandeur to every celebration. He has participated in:
                </p>
                <ul className="list-disc list-inside mb-4 text-gray-600">
                    <li><strong>Kandy Esala Perahera:</strong> Sanju has graced the streets of Kandy, captivating thousands with his elegant parades during this historic festival.</li>
                    <li><strong>Uda Perahera:</strong> His gentle demeanor and regal appearance have made him a favorite in this revered festival, where he carries sacred relics with honor.</li>
                    <li><strong>Local Community Celebrations:</strong> Sanju frequently participates in community events, bringing joy and excitement to both locals and visitors alike.</li>
                </ul>

                <h4 className="text-lg font-semibold text-yellow-700 mb-2">Why Choose Sanju?</h4>
                <p className="text-gray-600 mb-4">
                    Sanju's friendly nature and elegance make him the perfect addition to any celebration. His training ensures a safe and enjoyable experience for all attendees, leaving a lasting impression on everyone present.
                </p>

                <h4 className="text-lg font-semibold text-yellow-700 mb-2">Special Requests</h4>
                <p className="text-gray-600 mb-4">
                    If you have specific requests for Sanju's participation, feel free to communicate them during booking. We aim to accommodate all needs to make your event truly unique.
                </p>

                <h4 className="text-lg font-semibold text-yellow-700 mb-2">Conservation Awareness</h4>
                <p className="text-gray-600 mb-4">
                    By choosing to book Sanju, you are also supporting elephant conservation efforts in Sri Lanka. We are dedicated to promoting the welfare of elephants and ensuring their protection for future generations.
                </p>

                <p className="text-gray-600">
                    Experience the beauty and charm of Mathugama Sanju at your next event and create unforgettable memories for all!
                </p>
            </Section>



            <button
                onClick={() => setShowCalendar(true)}
                className="bg-yellow-500 font-semibold text-white py-2 px-16 rounded-lg hover:bg-yellow-600 transition duration-200 shadow-lg mb-4 animate__animated animate__fadeInUp"
            >
                Booking
            </button>

            <Section title="Booking Instructions">
                <p className="text-gray-600 mb-2">To book your experience, please follow these steps:</p>
                <ol className="list-decimal list-inside text-gray-600">
                    <li>Select a date from the calendar.</li>
                    <li>Fill in your contact details.</li>
                    <li>Confirm your booking.</li>
                </ol>
            </Section>

            <Section title="Contact Us">
                <p className="text-gray-600">If you have any questions, feel free to reach out to us:</p>
                <p className="text-gray-800 font-bold">Phone: (94) 71 544-2990</p>
                <p className="text-gray-800 font-bold">Email: alipancha@gmail.com</p>
            </Section>

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
                        className="bg-yellow-500 font-semibold text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                        Submit Feedback
                    </button>
                </form>
                <div className="mt-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Previous Feedback</h3>

    {/* Sample Feedback List */}
    {[
      { username: 'Mahith Perera', comment: 'Amazing experience! Sanju was wonderful.', rating: 5 },
      { username: 'Pavan Rathnayaka', comment: 'So attractive', rating: 4 },
      { username: 'Thisal Lochana Somarathna', comment: 'Ane eka lokuine', rating: 5 },
    ].map((item, index) => (
      <div
        key={index}
        className="p-4 border border-gray-300 rounded-lg mb-4 bg-gray-50"
      >
        <p className="text-gray-800 mb-1">{item.comment}</p>
        <p className="text-sm text-gray-500">- {item.username}</p>

        {/* Star Rating */}
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < item.rating ? 'text-yellow-500' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.11 3.417a1 1 0 00.95.69h3.6c.969 0 1.371 1.24.588 1.81l-2.91 2.11a1 1 0 00-.364 1.118l1.11 3.416c.3.921-.755 1.688-1.538 1.118l-2.91-2.11a1 1 0 00-1.175 0l-2.91 2.11c-.783.57-1.838-.197-1.538-1.118l1.11-3.416a1 1 0 00-.364-1.118l-2.91-2.11c-.783-.57-.38-1.81.588-1.81h3.6a1 1 0 00.95-.69l1.11-3.417z"/>
            </svg>
          ))}
        </div>
      </div>
    ))}
  </div>
            </Section>

            {/* Video Gallery Section */}
            <Section title="Video Gallery">
                <div className="flex flex-col items-center space-y-16">
                    <iframe
                        className="mx-4"
                        width="900"
                        height="500"
                        src="https://www.youtube.com/embed/-sdEKpZUY6M"
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Section>





            {showCalendar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg animate__animated animate__zoomIn">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={handlePrevMonth}
                                className="text-yellow-500 hover:text-yellow-700 font-semibold transition duration-200 ease-in-out"
                            >
                                &lt; Prev
                            </button>
                            <h2 className="text-2xl font-bold text-center">
                                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                            </h2>
                            <button
                                onClick={handleNextMonth}
                                className="text-yellow-900 hover:text-yellow-700 font-semibold transition duration-200 ease-in-out"
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
                                onClick={() => setShowCalendar(false)}
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="rounded-lg shadow-lg p-6 w-full max-w-full mb-6 bg-white animate__animated animate__fadeIn">
        <h3 className="text-xl font-semibold mb-4 text-yellow-800">{title}</h3>
        {children}
    </div>
);

export default SingleMonthCalendar;
