import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddVaccinations = () => {
  const [petName, setPetName] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [reminderDays, setReminderDays] = useState('');
  const [user, setUser] = useState({ pets: [] });
  const [vaccines, setVaccines] = useState([]);

  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users/profile', { withCredentials: true });
        setUser(res.data);
        fetchVaccines();
      } catch (err) {
        console.error(err);
        alert("You need to sign in to access this page.");
        navigate('/sign-in');
        window.location.reload();
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petName || !vaccineName || !lastDate || !nextDate || !reminderDays) {
      toast.error('Please fill in all fields!');
      return;
    }

    const formData = {
      petName,
      vaccineName,
      lastVaccinationDate: lastDate,
      nextVaccinationDate: nextDate,
      reminderPeriodDays: reminderDays,
    };

    try {
      await axios.post('http://localhost:5001/api/vaccines/vaccine', formData, {
        withCredentials: true,
      });

      toast.success('Vaccination record added successfully!');
      setPetName('');
      setVaccineName('');
      setLastDate('');
      setNextDate('');
      setReminderDays('');
    } catch (error) {
      toast.error('Error adding vaccination record.');
    }
  };

  const fetchVaccines = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/vaccines/vaccine', { withCredentials: true });
      setVaccines(res.data);
    } catch (err) {
      console.error("Failed to fetch vaccines", err);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16 px-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          🩺 Add Vaccination Record
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label htmlFor="petName" className="block text-gray-700 font-semibold mb-2">
              Select Pet
            </label>
            <select
              id="petName"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Choose your pet</option>
              {user?.pets?.map((pet) => (
                <option key={pet._id} value={pet.title}>
                  {pet.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vaccineName" className="block text-gray-700 font-semibold mb-2">
              Vaccine Name
            </label>
            <input
              type="text"
              id="vaccineName"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              placeholder="Enter vaccine name"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="lastDate" className="block text-gray-700 font-semibold mb-2">
                Last Vaccination Date
              </label>
              <input
                type="date"
                id="lastDate"
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="nextDate" className="block text-gray-700 font-semibold mb-2">
                Next Vaccination Date
              </label>
              <input
                type="date"
                id="nextDate"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reminderDays" className="block text-gray-700 font-semibold mb-2">
              Reminder Period (Days before)
            </label>
            <input
              type="number"
              id="reminderDays"
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              placeholder="e.g. 5"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold py-3 rounded-xl transition duration-300 hover:shadow-lg hover:scale-105"
          >
            Submit Vaccination Record
          </button>

        </form>
      </div>
      {vaccines.length > 0 && (
  <div className="mt-12">
    <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">📋 Your Vaccination Records</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {vaccines.map((vaccine) => (
        <div key={vaccine._id} className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-md">
          <h4 className="text-xl font-semibold text-blue-800 mb-2">{vaccine.petName}</h4>
          <p><span className="font-medium text-gray-700">Vaccine Name:</span> {vaccine.vaccineName}</p>
          <p><span className="font-medium text-gray-700">Last Date:</span> {new Date(vaccine.lastVaccinationDate).toLocaleDateString()}</p>
          <p><span className="font-medium text-gray-700">Next Date:</span> {new Date(vaccine.nextVaccinationDate).toLocaleDateString()}</p>
          <p><span className="font-medium text-gray-700">Reminder:</span> {vaccine.reminderPeriodDays} day(s) before</p>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default AddVaccinations;
