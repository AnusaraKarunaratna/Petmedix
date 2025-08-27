import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaDog, FaBirthdayCake, FaInfoCircle, FaVenusMars, FaNotesMedical, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';

const Pets = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!localStorage.getItem('reloaded')) {
      localStorage.setItem('reloaded', 'true');
      window.location.reload();
    }
  }, []);

  const generatePDF = async (pet) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor('#1D4ED8');
    doc.text(`Pet Report - ${pet.title}`, 20, 30);

    doc.setFontSize(14);
    doc.setTextColor('#000');

    let y = 50;

    const addLine = (label, value) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont(undefined, 'normal');
      doc.text(value || 'N/A', 70, y);
      y += 10;
    };

    addLine('Pet Type', pet.species);
    addLine('Gender', pet.gender);
    addLine('Breed', pet.breed);
    addLine('Birthdate', new Date(pet.birthdate).toLocaleDateString("en-CA"));
    addLine('Special Notes', pet.content);

    // ✅ Optional Data
    addLine('Weight', pet.weight?.toString() + ' kg');
    addLine('Height', pet.height?.toString() + ' cm');
    addLine('Color', pet.color);
    addLine('Vaccination Status', pet.vaccinationStatus);
    addLine('Medical History', pet.medicalHistory);
    addLine('Current Medications', pet.currentMedications);
    addLine('Is Neutered', pet.isNeutered ? 'Yes' : 'No');
    addLine('Feeding Schedule', pet.feedingSchedule);
    addLine('Food Type', pet.foodType);
    addLine('Allergies', pet.allergies);
    addLine('Exercise Routine', pet.exerciseRoutine);
    addLine('Activity Level', pet.activityLevel);

    // ✅ Add image to the right
    if (pet.image) {
      const imageUrl = `http://localhost:5001${pet.image}`;
      try {
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
          const base64data = reader.result;
          doc.addImage(base64data, 'JPEG', 120, 40, 70, 70); // x, y, width, height
          doc.save(`${pet.title}_report.pdf`);
        };
      } catch (err) {
        console.error("Image loading failed", err);
        doc.save(`${pet.title}_report.pdf`);
      }
    } else {
      doc.save(`${pet.title}_report.pdf`);
    }
  };

  const deletePet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/pets/${id}`, { withCredentials: true });
      alert("Pet deleted successfully.");

      // Update the state to remove the deleted pet
      setUser(prev => ({
        ...prev,
        pets: prev.pets.filter(pet => pet._id !== id), // Filter out the deleted pet
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet.");
    }
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600">🐾 Your Pets</h1>
        <p className="text-gray-600 text-lg mt-2">Manage and view your pets with love</p>
        <p className="text-gray-700 text-md mt-2">
          {user?.pets?.length > 0
            ? `You have ${user.pets.length} pet(s): ${user.pets.map(p => p.title).join(', ')}`
            : 'No pets added yet 🐶'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {user?.pets?.map(pet => (
          <div
            key={pet._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6"
          >
            <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <FaPaw /> {pet.title}
            </h3>

            <div className="mt-4 space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <FaDog className="text-blue-400" /> Pet Type: <span className="font-semibold">{pet.species}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaVenusMars className="text-pink-400" /> Gender: <span className="font-semibold">{pet.gender}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaInfoCircle className="text-green-400" /> Breed: <span className="font-semibold">{pet.breed}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaBirthdayCake className="text-yellow-500" /> Birthdate:{" "}
                <span className="font-semibold">{new Date(pet.birthdate).toLocaleDateString("en-CA")}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaNotesMedical className="text-purple-500" /> Special Notes:{" "}
                <span className="font-semibold">{pet.content}</span>
              </p>
            </div>

            {pet.image && (
              <div className="mt-4 flex justify-center">
                <img
                  src={`http://localhost:5001${pet.image}`}
                  alt={pet.title}
                  className="rounded-xl shadow-md max-h-56 object-contain"
                />
              </div>
            )}

            {/* Generate Report Button */}
            <div className="mt-6 flex flex-col items-center space-y-4">
              {/* Delete button with icon */}
            <button
              onClick={() => handleDelete(pet._id)}
              className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition"
            >
              Delete Pet
            </button>
              <button
                onClick={() => generatePDF(pet)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
              >
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pets;

