import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ViewVaccinations = () => {
    const [user, setUser] = useState({ pets: [] });
    const [vaccines, setVaccines] = useState([]);
    const [filteredVaccines, setFilteredVaccines] = useState([]);
    const [filterType, setFilterType] = useState('all'); // all, upcoming, previous
    const [petFilter, setPetFilter] = useState('');

    const navigate = useNavigate();

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

    const fetchVaccines = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/vaccines/vaccine', { withCredentials: true });
            setVaccines(res.data);
        } catch (err) {
            console.error("Failed to fetch vaccines", err);
        }
    };

    useEffect(() => {
        filterVaccines();
    }, [vaccines, filterType, petFilter]);

    const filterVaccines = () => {
        const now = new Date();
        let filtered = [...vaccines];

        // Filter by date
        if (filterType === 'upcoming') {
            filtered = filtered.filter(v => new Date(v.nextVaccinationDate) > now);
        } else if (filterType === 'previous') {
            filtered = filtered.filter(v => new Date(v.nextVaccinationDate) <= now);
        }

        // Filter by pet name
        if (petFilter) {
            filtered = filtered.filter(v =>
                v.petName.toLowerCase().includes(petFilter.toLowerCase())
            );
        }

        setFilteredVaccines(filtered);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-6 px-4">
            <ToastContainer />
            <div className="max-w-5xl mx-auto">
                <h3 className="text-3xl font-bold text-blue-700 mb-8 text-center">📋 Your Vaccination Records</h3>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-4 py-2 rounded-full ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType('upcoming')}
                            className={`px-4 py-2 rounded-full ${filterType === 'upcoming' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setFilterType('previous')}
                            className={`px-4 py-2 rounded-full ${filterType === 'previous' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'} transition`}
                        >
                            Previous
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Search by Pet Name..."
                        value={petFilter}
                        onChange={(e) => setPetFilter(e.target.value)}
                        className="border border-blue-300 rounded-full px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Vaccines List */}
                {filteredVaccines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredVaccines.map((vaccine) => (
                            <div key={vaccine._id} className="bg-white border-l-4 border-blue-400 p-6 rounded-2xl shadow hover:shadow-lg transition">
                                <h4 className="text-xl font-semibold text-blue-800 mb-1">{vaccine.petName}</h4>
                                <p><span className="font-medium text-gray-700">Vaccine:</span> {vaccine.vaccineName}</p>
                                <p><span className="font-medium text-gray-700">Last Date:</span> {new Date(vaccine.lastVaccinationDate).toLocaleDateString()}</p>
                                <p><span className="font-medium text-gray-700">Next Date:</span> {new Date(vaccine.nextVaccinationDate).toLocaleDateString()}</p>
                                <p><span className="font-medium text-gray-700">Reminder:</span> {vaccine.reminderPeriodDays} day(s) before</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">No records found based on your filters.</p>
                )}
            </div>
        </div>
    );
};

export default ViewVaccinations;
