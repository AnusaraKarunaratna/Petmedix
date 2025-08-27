import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  FaBullhorn,
  FaHeartbeat,
  FaCheckCircle,
  FaUserFriends,
  FaPaw,
  FaGlobe,
  FaTachometerAlt,
  FaTasks,
  FaChartLine,
  FaCalendarCheck,
  FaComments,
  FaSyringe,
  FaHospital
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState({ meetings: [] });
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [posts, setPosts] = useState([]);
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
    fetchPets();
    fetchDoctors();
    fetchUsers();
    fetchPosts();
  }, [navigate]);

  const fetchPets = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/pets/');
      setPets(res.data.data); 
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/posts/get-all-posts');
      setPosts(res.data.data); 
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/doctors/get-all-doctors');
      setDoctors(res.data.data); 
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users/get-all-users');
      setUsers(res.data.data); 
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-blue-200 text-black p-4 space-y-4 shadow-lg">
        <nav>
          <ul className="space-y-4 mt-10">
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaTachometerAlt className="mr-3 text-lg" />
                <span className="font-semibold">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/pets" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaPaw className="mr-3 text-lg" />
                <span className="font-semibold">Pets</span>
              </a>
            </li>
            <li>
              <a href="/postlist" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaGlobe className="mr-3 text-lg" />
                <span className="font-semibold">Community</span>
              </a>
            </li>
            <li>
              <a href="/petReg" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaCheckCircle className="mr-3 text-lg" />
                <span className="font-semibold">Pet Registration</span>
              </a>
            </li>
            <li>
              <a href="/manage-posts" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaComments className="mr-3 text-lg" />
                <span className="font-semibold">Your Posts</span>
              </a>
            </li>
            <li>
              <a href="/doctor" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaTasks className="mr-3 text-lg" />
                <span className="font-semibold">Doctor Reservations</span>
              </a>
            </li>
            <li>
              <a href="/vaccinations" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaSyringe className="mr-3 text-lg" />
                <span className="font-semibold">Vaccination Management</span>
              </a>
            </li>
            <li>
              <a href="/manage-growth-records" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaChartLine className="mr-3 text-lg" />
                <span className="font-semibold">Growth Records</span>
              </a>
            </li>
            <li>
              <a href="/display-hospital" className="flex items-center p-3 rounded-lg hover:bg-blue-400 transition duration-300">
                <FaHospital className="mr-3 text-lg" />
                <span className="font-semibold">Pet Hospitals</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div>
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto"> {/* Added overflow-y-auto for scrolling */}
          {/* Header */}
          <header className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800">Admin - Dashboard</h2>
            <p className="text-lg text-gray-600 mt-2">Your comprehensive view of pet status.</p>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Elephants */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaUserFriends className="text-blue-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">No of pets</h3>
                <p className="text-3xl font-bold text-gray-800">{pets?.length || 0}</p>
                <p className="text-sm text-gray-600">Across all sites</p>
              </div>
            </div>

            {/* Health Alerts */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaHeartbeat className="text-red-600 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">No of doctors</h3>
                <p className="text-3xl font-bold text-gray-800">{doctors?.length || 0}</p>
                <p className="text-sm text-gray-600">Across all sites</p>
              </div>
            </div>

            {/* Health Alerts */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaPaw className="text-black text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">No of users</h3>
                <p className="text-3xl font-bold text-gray-800">{users?.length || 0}</p>
                <p className="text-sm text-gray-600">Warning Alerts</p>
              </div>
            </div>


            {/* Recent Activity */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaCalendarCheck className="text-orange-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Posts</h3>
                <p className="text-3xl font-bold text-gray-800">{posts?.length || 0}</p>
                <p className="text-sm text-gray-600">has posted</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaChartLine className="text-green-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Performance Metrics</h3>
                <p className="text-3xl font-bold text-gray-800">85%</p>
                <p className="text-sm text-gray-600">Overall health compliance</p>
              </div>
            </div>

            
          </div>

          {/* Management Navigation */}
<div className="mt-10">
  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Quick Management Access</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <button
      onClick={() => navigate('/manage-doctors')}
      className="bg-blue-500 text-white py-3 px-5 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
    >
      Manage Veterinarians
    </button>
    <button
      onClick={() => navigate('/manage-hospitals')}
      className="bg-green-500 text-white py-3 px-5 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
    >
      Manage Vet Hospitals
    </button>
    <button
      onClick={() => navigate('/manage-posts')}
      className="bg-purple-500 text-white py-3 px-5 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
    >
      Manage Posts
    </button>
  </div>
</div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;