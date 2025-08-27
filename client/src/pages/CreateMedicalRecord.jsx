import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddMedicalStatusReport = () => {
  const [petName, setPetName] = useState('');
  const [weight,setWeight] = useState('');
  const [height,setHeight] = useState('');
  const [date,setDate] = useState('');
  const [user, setUser] = useState(null);

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
      setPetName('');
    } catch (error) {
      toast.error('Error adding growth record.');
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-16 px-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          🩺 Add Growth Status Record
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
            <label htmlFor="weight" className="block text-gray-700 font-semibold mb-2">
              Current Weight (KG)
            </label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-gray-700 font-semibold mb-2">
              Current Height (cm)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold py-3 rounded-xl transition duration-300 hover:shadow-lg hover:scale-105"
          >
            Submit Record
          </button>

        </form>
      </div>

    </div>
  );
};

export default AddMedicalStatusReport;
