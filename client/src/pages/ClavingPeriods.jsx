import React, { useState } from "react";

// Mock data for elephants with their calving periods
const elephants = [
  { name: "Sundari", calvingPeriod: "Jan to Mar" },
  { name: "Lakshmi", calvingPeriod: "Apr to Jun" },
  { name: "Rajini", calvingPeriod: "Jul to Sep" },
  { name: "Mala", calvingPeriod: "Oct to Dec" },
  { name: "Kumari", calvingPeriod: "Mar to May" },
  { name: "Rani", calvingPeriod: "Jun to Aug" },
  { name: "Shanthi", calvingPeriod: "Sep to Nov" },
  { name: "Sita", calvingPeriod: "Feb to Apr" },
  { name: "Anjali", calvingPeriod: "May to Jul" },
  { name: "Ganga", calvingPeriod: "Nov to Dec" },
];

// Helper function to get the current month as an integer (1 for January, 12 for December)
const getCurrentMonth = () => new Date().getMonth() + 1;

// Helper function to determine the status based on the calving period
const getStatus = (calvingPeriod) => {
  const currentMonth = getCurrentMonth();
  const monthRange = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };

  // Parse the calving period range
  const [start, end] = calvingPeriod.split(" to ");
  const startMonth = monthRange[start];
  const endMonth = monthRange[end];

  if (currentMonth >= startMonth && currentMonth <= endMonth) return "Ongoing";
  if (currentMonth < startMonth) return "Upcoming";
  return "Overdue";
};

// Main Component
const ElephantCalving = () => {
  const [filter, setFilter] = useState("All");

  // Add status to each elephant based on the current month
  const elephantsWithStatus = elephants.map((elephant) => ({
    ...elephant,
    status: getStatus(elephant.calvingPeriod),
  }));

  // Filter elephants based on selected status filter
  const filteredElephants = elephantsWithStatus.filter(
    (elephant) => filter === "All" || elephant.status === filter
  );

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-center text-yellow-600 mb-6">Elephant Calving Seasons</h1>

      {/* Filter Selection */}
      <div className="flex justify-center mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-yellow-500"
        >
          <option value="All">All</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      {/* Table of Elephants */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gradient-to-r from-yellow-500 to-orange-400 text-white shadow-md">
              <th className="py-4 px-6 text-left font-bold uppercase tracking-wide border-b-2 border-gray-200">
                Elephant Name
              </th>
              <th className="py-4 px-6 text-left font-bold uppercase tracking-wide border-b-2 border-gray-200">
                Calving Period
              </th>
              <th className="py-4 px-6 text-left font-bold uppercase tracking-wide border-b-2 border-gray-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredElephants.map((elephant, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-100 transition-colors duration-150`}
              >
                <td className="py-4 px-6 border-b">{elephant.name}</td>
                <td className="py-4 px-6 border-b">{elephant.calvingPeriod}</td>
                <td className="py-4 px-6 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      elephant.status === "Ongoing"
                        ? "bg-green-200 text-green-800"
                        : elephant.status === "Upcoming"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {elephant.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ElephantCalving;
