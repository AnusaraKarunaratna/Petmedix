import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Meeting = () => {
    const { handleSubmit, register, reset, setValue } = useForm();
    const [meetings, setMeetings] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const queryParams = new URLSearchParams(window.location.search);
    const doctorName = queryParams.get('doctor');

    const generateTimeSlots = (date) => {
        const slots = [];
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(20, 0, 0, 0);

        while (start < end) {
            slots.push(new Date(start));
            start.setMinutes(start.getMinutes() + 30);
        }

        return slots;
    };

    const fetchMeetings = async () => {
        try {
          if (!doctorName) return; // safety check
      
          const response = await axios.get(`http://localhost:5001/api/doctors/online-meetings?doctorName=${encodeURIComponent(doctorName)}`, {
            withCredentials: true
          });
      
          const allMeetings = response.data.meetings || [];
          setMeetings(allMeetings);
        } catch (error) {
          console.error('Error fetching meetings:', error);
        }
      };
      

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setValue('date', date);

        const slots = generateTimeSlots(date);

        const booked = meetings
            .filter((meeting) => new Date(meeting.time).toDateString() === date.toDateString())
            .map((meeting) => new Date(meeting.time).toTimeString().slice(0, 5));

        setBookedSlots(booked);
        setAvailableSlots(slots);
    };

    const onSubmit = async (data) => {
        try {
            const selectedTime = new Date(data.time); // parse ISO string from radio input
            const combinedDateTime = new Date(selectedDate);
            combinedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

            const payload = {
                ...data,
                doctor: doctorName,
                time: combinedDateTime
            };

            const response = await axios.post('http://localhost:5001/api/doctors/reserve', payload, {
                withCredentials: true
            });

            if (response.data.success) {
                alert('Meeting Scheduled Successfully!');
                fetchMeetings();
                reset();
                setSelectedDate(null);
                setAvailableSlots([]);
            } else {
                alert('Error scheduling meeting');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error: ' + (error.response?.data?.error || error.message));
        }
    };

    useEffect(() => {
        if (doctorName) {
            fetchMeetings();
        }
    }, [doctorName]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Schedule a Meeting</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        {...register('title', { required: true })}
                        className="border p-2 w-full rounded"
                        placeholder="Enter meeting title"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        {...register('description')}
                        className="border p-2 w-full rounded"
                        placeholder="Enter meeting description"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Select Date</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        className="border p-2 w-full rounded"
                        placeholderText="Pick a date"
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                    />
                    <input type="hidden" {...register('date')} />
                </div>

                {selectedDate && (
                    <div>
                        <label className="block mb-1 font-medium">Select Time Slot</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {availableSlots.map((slot, index) => {
                                const timeStr = slot.toTimeString().slice(0, 5);
                                const isBooked = bookedSlots.includes(timeStr);
                                const slotValue = slot.toISOString(); // for radio value

                                return (
                                    <label
                                        key={index}
                                        className={`p-2 text-center rounded cursor-pointer text-sm font-medium ${
                                            isBooked
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                : 'bg-blue-100 hover:bg-blue-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            value={slotValue}
                                            {...register('time', { required: true })}
                                            disabled={isBooked}
                                            className="hidden"
                                        />
                                        {timeStr}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Schedule Meeting
                </button>
            </form>

            <h2 className="text-xl font-bold mt-8 mb-4">
                Scheduled Meetings for Dr. {doctorName}
            </h2>
            {meetings.length > 0 ? (
                <ul className="space-y-4">
                    {meetings.map((meeting) => (
                        <li key={meeting._id} className="border p-4 rounded shadow-sm">
                            <p>
                                <strong>Title:</strong> {meeting.title}
                            </p>
                            <p>
                                <strong>Description:</strong> {meeting.description}
                            </p>
                            <p>
                                <strong>Doctor:</strong> {doctorName || 'N/A'}
                            </p>
                            <p>
                                <strong>User:</strong> {meeting.user}
                            </p>
                            <p>
                                <strong>Time:</strong>{' '}
                                {new Date(meeting.time).toLocaleString()}
                            </p>
                            {meeting.meetingLink && (
                                <p>
                                    <strong>Link:</strong>{' '}
                                    <a
                                        href={meeting.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Join Meeting
                                    </a>
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No meetings scheduled for this doctor.</p>
            )}
        </div>
    );
};

export default Meeting;
