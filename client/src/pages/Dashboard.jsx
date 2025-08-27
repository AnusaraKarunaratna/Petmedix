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
  FaClipboardList,
  FaTasks,
  FaChartLine,
  FaCalendarCheck,
  FaComments,
  FaSyringe,
  FaHospital
} from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState({ meetings: [] });
  const [meetings, setMeetings] = useState([]);
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
    fetchMeetings();
  }, [navigate]);

  const fetchMeetings = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users/profile', { withCredentials: true });
      const userData = res.data;
      setUser(userData);

      const now = new Date();

      // Filter upcoming online reservations
      const upcomingOnline = userData.onlineReservations?.filter(meeting => {
        return new Date(meeting.time) > now;
      }) || [];

      // Filter upcoming physical reservations
      const upcomingPhysical = userData.PhysicalReservations?.filter(meeting => {
        return new Date(meeting.time) > now;
      }) || [];

      // Combine and sort by time
      const allUpcomingMeetings = [...upcomingOnline, ...upcomingPhysical].sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });

      setMeetings(allUpcomingMeetings);
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    }
  };


  {/* Check if there are any future or today's scheduled checkups */ }
  const upcomingMeetings = meetings.filter(checkup => new Date(checkup.time) >= new Date());

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
            <h2 className="text-4xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-lg text-gray-600 mt-2">Your comprehensive view of pet status.</p>
          </header>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Elephants */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaUserFriends className="text-blue-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">No of pets</h3>
                <p className="text-3xl font-bold text-gray-800">{user?.pets?.length || 0}</p>
                <p className="text-sm text-gray-600">Across all sites</p>
              </div>
            </div>

            {/* Health Alerts */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaHeartbeat className="text-red-600 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Health Status Alerts</h3>
                <p className="text-3xl font-bold text-red-600">5</p>
                <p className="text-sm text-gray-600">Pending checks</p>
              </div>
            </div>

            {/* Health Alerts */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaPaw className="text-black text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Pets Needing Attention</h3>
                <p className="text-3xl font-bold text-gray-800">15</p>
                <p className="text-sm text-gray-600">Warning Alerts</p>
              </div>
            </div>

            {/* Upcoming Compliance */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaCheckCircle className="text-yellow-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Upcoming Vaccinations</h3>
                <p className="text-3xl font-bold text-yellow-500">{user?.vaccines?.length || 0}</p>
                <p className="text-sm text-gray-600">Due this month</p>
              </div>
            </div>

            {/* Active Caretakers */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaBullhorn className="text-blue-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Active Caretakers</h3>
                <p className="text-3xl font-bold text-gray-800">12</p>
                <p className="text-sm text-gray-600">On duty today</p>
              </div>
            </div>

            {/* New Sections */}

            {/* Scheduled Checkups */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaClipboardList className="text-purple-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Scheduled Checkups</h3>
                <p className="text-3xl font-bold text-gray-800">{upcomingMeetings.length || 0}</p>
                <p className="text-sm text-gray-600">Next checkups due</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-white rounded-lg shadow-lg flex items-center">
              <FaCalendarCheck className="text-orange-500 text-4xl mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Posts</h3>
                <p className="text-3xl font-bold text-gray-800">{user?.createdPosts?.length || 0}</p>
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




          {/* Only display the section if there are upcoming checkups */}
          {upcomingMeetings.length > 0 && (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 mt-8">Scheduled Medical Checkups</h2>
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-300">
                  <tr>
                    <th className="py-3 px-4 text-left text-black-600 font-semibold">Title</th>
                    <th className="py-3 px-4 text-left text-black-600 font-semibold">Doctor</th>
                    <th className="py-3 px-4 text-left text-black-600 font-semibold">Date</th>
                    <th className="py-3 px-4 text-left text-black-600 font-semibold">Reason</th>
                    <th className="py-3 px-4 text-left text-black-600 font-semibold">Reservation Type</th>
                    <th className="py-3 px-4 text-left text-black-600 font-semibold">Checkup Location</th>
                  </tr>
                </thead>

                <tbody>
                  {upcomingMeetings.map(checkup => (
                    <tr key={checkup._id} className="hover:bg-blue-100">
                      <td className="py-2 px-4">{checkup.title}</td>
                      <td className="py-2 px-4">{checkup.doctor}</td>
                      <td className="py-2 px-4">
                        {new Date(checkup.time).toLocaleDateString('en-CA')}
                      </td>
                      <td className="py-2 px-4">{checkup.description}</td>

                      <td className="py-2 px-4">
                        {checkup.meetingLink ? (
                          <span>Online</span>
                        ) : (
                          <span>Physical</span>
                        )}
                      </td>

                      <td className="py-2 px-4">
                        {checkup.meetingLink ? (
                          <a
                            href={checkup.meetingLink}
                            className="text-blue-600 underline hover:text-blue-800 transition duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {checkup.meetingLink}
                          </a>
                        ) : (
                          <span>{checkup.location}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}



        </main>
      </div>
    </div>
  );
};

export default Dashboard;