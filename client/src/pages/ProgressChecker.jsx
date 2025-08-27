import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const AddMedicalStatusReport = () => {
  const [petName, setPetName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [date, setDate] = useState('');
  const [user, setUser] = useState(null);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [weightGrowth, setWeightGrowth] = useState(null);
  const [heightGrowth, setHeightGrowth] = useState(null);

  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/users/profile', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("You need to sign in to access this page.");
        navigate('/sign-in');
        window.location.reload();
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fetch growth records when pet is selected
  useEffect(() => {
    const fetchRecords = async () => {
      if (!petName) return;

      try {
        const res = await axios.get(`http://localhost:5001/api/pets/records/${petName}`, {
          withCredentials: true,
        });

        const records = res.data.growth || [];
        setGrowthRecords(records);

        // Calculate growth percentage
        if (records.length >= 2) {
          const first = records[0];
          const last = records[records.length - 1];

          const weightGrowthPercent = (((last.weight - first.weight) / first.weight) * 100).toFixed(2);
          const heightGrowthPercent = (((last.height - first.height) / first.height) * 100).toFixed(2);

          setWeightGrowth(weightGrowthPercent);
          setHeightGrowth(heightGrowthPercent);
        } else {
          setWeightGrowth(null);
          setHeightGrowth(null);
        }

      } catch (err) {
        console.error('Error fetching records:', err);
        toast.error('Failed to fetch growth records.');
      }
    };

    fetchRecords();
  }, [petName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petName || !weight || !height || !date) {
      toast.error('Please fill in all fields!');
      return;
    }

    const formData = {
      pet: petName,
      weight,
      height,
      date
    };

    try {
      await axios.post('http://localhost:5001/api/pets/add-record', formData, {
        withCredentials: true,
      });

      toast.success('Growth record added successfully!');
      setWeight('');
      setHeight('');
      setDate('');

      // Refresh growth records
      const res = await axios.get(`http://localhost:5001/api/pets/records/${petName}`, {
        withCredentials: true,
      });
      const records = res.data.growth || [];
      setGrowthRecords(records);

      if (records.length >= 2) {
        const first = records[0];
        const last = records[records.length - 1];

        setWeightGrowth((((last.weight - first.weight) / first.weight) * 100).toFixed(2));
        setHeightGrowth((((last.height - first.height) / first.height) * 100).toFixed(2));
      }

    } catch (error) {
      console.error(error);
      toast.error('Error adding growth record.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16 px-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          🩺 Growth Status Record
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
        </form>
      </div>

      {growthRecords.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-3xl font-bold text-center text-blue-700 mb-6">📈 Growth Charts</h3>

          {/* Weight Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-10">
            <h4 className="text-xl font-semibold text-blue-600 mb-4 text-center">
              Weight Progress (KG)
              {weightGrowth && (
                <span className="ml-4 text-green-600 text-sm">
                  (+{weightGrowth}%)
                </span>
              )}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthRecords}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Height Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h4 className="text-xl font-semibold text-blue-600 mb-4 text-center">
              Height Progress (cm)
              {heightGrowth && (
                <span className="ml-4 text-green-600 text-sm">
                  (+{heightGrowth}%)
                </span>
              )}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthRecords}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="height" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMedicalStatusReport;
