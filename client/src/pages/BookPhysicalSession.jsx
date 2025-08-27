import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Meeting = () => {
    const { handleSubmit, register, reset, setValue, watch } = useForm();
    const [meetings, setMeetings] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [locationAvailability, setLocationAvailability] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);

    const selectedTime = watch('time');

    const queryParams = new URLSearchParams(window.location.search);
    const doctorName = queryParams.get('doctor');

    const getDayOfWeek = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const generateTimeSlots = (startTimeStr, endTimeStr, date) => {
        const slots = [];
        const [startH, startM] = startTimeStr.split(':').map(Number);
        const [endH, endM] = endTimeStr.split(':').map(Number);

        const start = new Date(date);
        start.setHours(startH, startM, 0, 0);

        const end = new Date(date);
        end.setHours(endH, endM, 0, 0);

        while (start < end) {
            slots.push(new Date(start));
            start.setMinutes(start.getMinutes() + 30);
        }

        return slots;
    };

    const fetchMeetings = async () => {
        try {
            if (!doctorName) return;
            const response = await axios.get(`http://localhost:5001/api/doctors/physical-meetings?doctorName=${encodeURIComponent(doctorName)}`, {
                withCredentials: true
            });
            setMeetings(response.data.meetings || []);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            if (!doctorName) return;
            const response = await axios.get(`http://localhost:5001/api/doctors/physical-locations?doctorName=${encodeURIComponent(doctorName)}`, {
                withCredentials: true
            });
            setLocations(response.data.locations || []);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const updateAvailableDates = (location) => {
        const available = [];

        if (!location || !location.availability) return;

        const today = new Date();
        const next30 = new Date();
        next30.setDate(today.getDate() + 30);

        for (let d = new Date(today); d <= next30; d.setDate(d.getDate() + 1)) {
            const day = getDayOfWeek(d);
            const availability = location.availability[day];
            if (availability && availability.isAvailable) {
                available.push(new Date(d));
            }
        }

        setAvailableDates(available);
    };

    const isDateAvailable = (date) => {
        return availableDates.some(
            (d) => d.toDateString() === date.toDateString()
        );
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setValue('date', date);

        if (!selectedLocation) return;

        const selectedPlace = locations.find(loc => loc.name === selectedLocation);
        if (!selectedPlace) return;

        const day = getDayOfWeek(date);
        const availability = selectedPlace.availability[day];

        if (availability && availability.isAvailable) {
            const slots = generateTimeSlots(availability.timeFrom, availability.timeTo, date);
            setLocationAvailability(availability);

            const booked = meetings
                .filter(meeting =>
                    meeting.location === selectedLocation &&
                    new Date(meeting.time).toDateString() === date.toDateString()
                )
                .map(meeting => new Date(meeting.time).toTimeString().slice(0, 5));

            setBookedSlots(booked);
            setAvailableSlots(slots);
        } else {
            setAvailableSlots([]);
            setBookedSlots([]);
        }
    };

    const onSubmit = async (data) => {
        try {
            if (!selectedDate || !selectedLocation) {
                alert('Please select a date and location');
                return;
            }

            const selectedTime = new Date(data.time);
            const combinedDateTime = new Date(selectedDate);
            combinedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

            const payload = {
                ...data,
                doctor: doctorName,
                time: combinedDateTime,
                location: selectedLocation,
            };

            const response = await axios.post('http://localhost:5001/api/doctors/physical-reserve', payload, {
                withCredentials: true
            });

            if (response.data.success) {
                alert('Meeting Scheduled Successfully!');
                reset();
                setSelectedDate(null);
                setAvailableSlots([]);
                fetchMeetings();
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
            fetchLocations();
        }
    }, [doctorName]);

    useEffect(() => {
        if (selectedLocation) {
            const selectedPlace = locations.find(loc => loc.name === selectedLocation);
            updateAvailableDates(selectedPlace);
            if (selectedDate) {
                handleDateChange(selectedDate); // Recalculate slots
            }
        }
    }, [selectedLocation]);

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
                    <label className="block mb-1 font-medium">Select Location</label>
                    <select
                        value={selectedLocation}
                        onChange={(e) => {
                            setSelectedLocation(e.target.value);
                        }}
                        className="border p-2 w-full rounded"
                    >
                        <option value="">Select a location</option>
                        {locations.map((loc, index) => (
                            <option key={index} value={loc.name}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
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
                        filterDate={isDateAvailable}
                    />
                    <input type="hidden" {...register('date')} />
                </div>

                {selectedDate && availableSlots.length > 0 ? (
                    <div>
                        <label className="block mb-1 font-medium">Select Time Slot</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {availableSlots.map((slot, index) => {
                                const timeStr = slot.toTimeString().slice(0, 5);
                                const isBooked = bookedSlots.includes(timeStr);
                                const slotValue = slot.toISOString();

                                const isSelected = selectedTime === slotValue;

                                return (
                                    <label
                                        key={index}
                                        className={`p-2 text-center rounded cursor-pointer text-sm font-medium transition-all ${
                                            isBooked
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                : isSelected
                                                ? 'bg-blue-600 text-white ring-2 ring-blue-800'
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
                ) : selectedDate && (
                    <p className="text-red-500 mt-2">No available slots on this date for the selected location.</p>
                )}

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Schedule Meeting
                </button>
            </form>

            <h2 className="text-xl font-bold mt-8 mb-4">
                Scheduled Meetings for Dr. {doctorName || 'Unknown'}
            </h2>

            {meetings.length > 0 ? (
                <ul className="space-y-4">
                    {meetings.map((meeting) => (
                        <li key={meeting._id} className="border p-4 rounded shadow-sm">
                            <p><strong>Title:</strong> {meeting.title}</p>
                            <p><strong>Description:</strong> {meeting.description}</p>
                            <p><strong>Location:</strong> {meeting.location || 'N/A'}</p>
                            <p><strong>Doctor:</strong> {doctorName || 'N/A'}</p>
                            <p><strong>User:</strong> {meeting.user}</p>
                            <p><strong>Time:</strong> {new Date(meeting.time).toLocaleString()}</p>
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
