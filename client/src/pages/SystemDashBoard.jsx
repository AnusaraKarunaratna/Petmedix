import React from "react";
import {
  FaBullhorn,
  FaHeartbeat,
  FaCheckCircle,
  FaUserFriends,
  FaPaw,
  FaFileMedical,
  FaTachometerAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaTasks,
  FaChartLine,
  FaCalendarCheck,
} from 'react-icons/fa';

const Dashboard = () => {
  // Sample data for pets needing attention
  const needingAttention = [
    { name: 'Max', issue: 'Weight Loss', lastChecked: '2024-10-01', breed: 'Golden Retriever', age: 5, location: 'Kennel 1', nextCheckup: '2024-11-05' },
    { name: 'Bella', issue: 'Limping', lastChecked: '2024-09-15', breed: 'German Shepherd', age: 3, location: 'Kennel 2', nextCheckup: '2024-10-20' },
    { name: 'Charlie', issue: 'Limping', lastChecked: '2024-01-15', breed: 'Bulldog', age: 8, location: 'Kennel 3', nextCheckup: '2024-11-15' },
  ];

  const scheduledCheckups = [
    { name: 'Max', doctor: 'Dr. Linda Smith', date: '2024-10-30', reason: 'Routine Checkup', status: 'Pending', notes: 'Check for signs of lethargy.' },
    { name: 'Bella', doctor: 'Dr. John Doe', date: '2024-11-02', reason: 'Limp Checkup', status: 'Scheduled', notes: 'Follow up on limping issue.' },
  ];

  // New data for vaccination schedules
  const vaccinationSchedules = [
    { name: 'Max', nextVaccination: '2024-12-01', type: 'Rabies' },
    { name: 'Bella', nextVaccination: '2024-12-05', type: 'Distemper' },
    { name: 'Charlie', nextVaccination: '2024-12-10', type: 'Parvovirus' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-gray-300 text-black p-4 space-y-4 shadow-lg">
        <nav>
          <ul className="space-y-4 mt-10">
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-yellow-400 transition duration-300">
                <FaTachometerAlt className="mr-3 text-lg" />
                <span className="font-semibold">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-yellow-400 transition duration-300">
                <FaPaw className="mr-3 text-lg" />
                <span className="font-semibold">Pets</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-yellow-400 transition duration-300">
                <FaFileMedical className="mr-3 text-lg" />
                <span className="font-semibold">Health Records</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-yellow-400 transition duration-300">
                <FaCalendarAlt className="mr-3 text-lg" />
                <span className="font-semibold">Appointments</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-yellow-400 transition duration-300">
                <FaClipboardList className="mr-3 text-lg" />
                <span className="font-semibold">Vaccinations</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Dashboard Header */}
        <header className="text-3xl font-bold text-gray-800 mb-6">
          Pet Management Dashboard
        </header>

        {/* Section for Pets Needing Attention */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pets Needing Attention</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Issue</th>
                <th className="py-2 px-4 border">Last Checked</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Next Checkup</th>
              </tr>
            </thead>
            <tbody>
              {needingAttention.map((pet, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{pet.name}</td>
                  <td className="py-2 px-4 border">{pet.issue}</td>
                  <td className="py-2 px-4 border">{pet.lastChecked}</td>
                  <td className="py-2 px-4 border">{pet.location}</td>
                  <td className="py-2 px-4 border">{pet.nextCheckup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Section for Scheduled Checkups */}
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Scheduled Checkups</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Doctor</th>
                <th className="py-2 px-4 border">Date</th>
                <th className="py-2 px-4 border">Reason</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Notes</th>
              </tr>
            </thead>
            <tbody>
              {scheduledCheckups.map((checkup, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{checkup.name}</td>
                  <td className="py-2 px-4 border">{checkup.doctor}</td>
                  <td className="py-2 px-4 border">{checkup.date}</td>
                  <td className="py-2 px-4 border">{checkup.reason}</td>
                  <td className="py-2 px-4 border">{checkup.status}</td>
                  <td className="py-2 px-4 border">{checkup.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Section for Vaccination Schedules */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vaccination Schedules</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Next Vaccination</th>
                <th className="py-2 px-4 border">Type</th>
              </tr>
            </thead>
            <tbody>
              {vaccinationSchedules.map((vaccination, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{vaccination.name}</td>
                  <td className="py-2 px-4 border">{vaccination.nextVaccination}</td>
                  <td className="py-2 px-4 border">{vaccination.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
