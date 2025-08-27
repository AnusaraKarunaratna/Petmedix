import React, { useState } from "react";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaClinicMedical,
  FaMoneyBill,
} from "react-icons/fa";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DoctorRegistrationForm = () => {
  const [places, setPlaces] = useState([
    {
      name: "",
      mapUrl: "",
      availability: days.reduce((acc, day) => {
        acc[day] = { isAvailable: false, timeFrom: "", timeTo: "" };
        return acc;
      }, {}),
    },
  ]);

  const [whyChoose, setWhyChoose] = useState(["", "", ""]);
  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = { isAvailable: false, timeFrom: "", timeTo: "" };
      return acc;
    }, {})
  );
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [clinicImage, setClinicImage] = useState(null);
  const [password,setPassword] = useState(null);
  const [checkupMode, setCheckupMode] = useState("online");
  const [paymentDetails, setPaymentDetails] = useState({
    accountName: "",
    accountNumber: "",
    bank: "",
    branch: "",
  });
  
  const handleToggleDay = (placeIndex, day) => {
    const updatedPlaces = [...places];
    const isAvailable = updatedPlaces[placeIndex].availability[day].isAvailable;
    updatedPlaces[placeIndex].availability[day].isAvailable = !isAvailable;
    setPlaces(updatedPlaces);
  };

  const handleAvailabilityChange = (placeIndex, day, field, value) => {
    const updatedPlaces = [...places];
    updatedPlaces[placeIndex].availability[day][field] = value;
    setPlaces(updatedPlaces);
  };

  const handleAddPlace = () => {
    const newPlace = {
      name: "",
      mapUrl: "",
      availability: days.reduce((acc, day) => {
        acc[day] = { isAvailable: false, timeFrom: "", timeTo: "" };
        return acc;
      }, {}),
    };
    setPlaces([...places, newPlace]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    data.places = places;
    data.whyChoose = whyChoose;
    data.availability = availability;
    data.checkupMode = checkupMode;
    data.paymentDetails = paymentDetails;
    data.password = password;
    data.contactInfo = {
      gmail: data.gmail,
      contactNumbers : data.contactNumbers
    };
  

    const finalForm = new FormData();
    finalForm.append("data", JSON.stringify(data));
    if (coverImage) finalForm.append("coverImage", coverImage);
    if (profileImage) finalForm.append("profileImage", profileImage);
    if (clinicImage) finalForm.append("clinicImage", clinicImage);

    try {
      const response = await fetch("http://localhost:5001/api/doctors/register", {
        method: "POST",
        body: finalForm,
      });

      if (response.ok) {
        alert("Doctor registered successfully!");
        window.location.reload();
      } else {
        const err = await response.json();
        throw new Error(err.message || "Failed to register doctor.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-gray-50 shadow-lg rounded-lg max-w-4xl mx-auto space-y-8"
    >
      <h1 className="text-3xl font-bold text-blue-700 text-center">
        Doctor Registration
      </h1>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium">
            <FaUserMd className="text-blue-500 inline mr-1" /> Doctor Name
          </label>
          <input name="doctorName" required className="input-field w-full" />
        </div>
        <div>
          <label className="block font-medium">
            <FaUserMd className="text-blue-500 inline mr-1" /> Occupation
          </label>
          <input name="occupation" required className="input-field w-full" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          rows="4"
          required
          className="input-field w-full"
        ></textarea>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium">
            <FaEnvelope className="inline mr-1 text-blue-500" /> Gmail
          </label>
          <input name="gmail" type="email" required className="input-field w-full" />
        </div>

        <div>
          <label className="block font-medium">
            <FaEnvelope className="inline mr-1 text-blue-500" /> Password
          </label>
          <input name="password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className="input-field w-full" />
        </div>
        
        <div>
          <label className="block font-medium">
            <FaPhone className="inline mr-1 text-blue-500" /> Contact Number
          </label>
          <input name="contactNumbers" required className="input-field w-full" />
        </div>
      </div>

      {/* Checkup Mode */}
      <div>
        <label className="block font-medium">Checkup Mode</label>
        <select
          value={checkupMode}
          onChange={(e) => setCheckupMode(e.target.value)}
          className="input-field w-full"
        >
          <option value="online">Online</option>
          <option value="physical">Physical</option>
          <option value="both">Both</option>
        </select>
      </div>

      {/* Images Upload */}
      {[
        { label: "Cover Image", setter: setCoverImage },
        { label: "Profile Image", setter: setProfileImage },
        { label: "Clinic Image", setter: setClinicImage },
      ].map(({ label, setter }) => (
        <div key={label}>
          <label className="block font-medium">{label}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setter(e.target.files[0])}
            className="input-field w-full"
            required
          />
        </div>
      ))}

      {/* Global Availability */}
      <div>
        <label className="block font-medium">General Weekly Availability</label>
        {days.map((day) => (
          <div key={day} className="flex items-center gap-4 mt-2">
            <input
              type="checkbox"
              checked={availability[day].isAvailable}
              onChange={() =>
                setAvailability((prev) => ({
                  ...prev,
                  [day]: {
                    ...prev[day],
                    isAvailable: !prev[day].isAvailable,
                  },
                }))
              }
            />
            <span className="w-20">{day}</span>
            <input
              type="time"
              disabled={!availability[day].isAvailable}
              value={availability[day].timeFrom}
              onChange={(e) =>
                setAvailability((prev) => ({
                  ...prev,
                  [day]: {
                    ...prev[day],
                    timeFrom: e.target.value,
                  },
                }))
              }
            />
            <input
              type="time"
              disabled={!availability[day].isAvailable}
              value={availability[day].timeTo}
              onChange={(e) =>
                setAvailability((prev) => ({
                  ...prev,
                  [day]: {
                    ...prev[day],
                    timeTo: e.target.value,
                  },
                }))
              }
            />
          </div>
        ))}
      </div>

      {/* Visiting Places */}
      <div>
        <h3 className="font-bold text-lg">Visiting Places</h3>
        {places.map((place, index) => (
          <div key={index} className="border p-4 rounded mb-4 space-y-2 bg-white">
            <input
              type="text"
              placeholder="Place Name"
              value={place.name}
              onChange={(e) => {
                const updated = [...places];
                updated[index].name = e.target.value;
                setPlaces(updated);
              }}
              className="input-field w-full"
              required
            />
            <input
              type="text"
              placeholder="Google Map URL"
              value={place.mapUrl}
              onChange={(e) => {
                const updated = [...places];
                updated[index].mapUrl = e.target.value;
                setPlaces(updated);
              }}
              className="input-field w-full"
              required
            />
            <label className="font-medium block mt-2">Availability</label>
            {days.map((day) => (
              <div key={day} className="flex items-center gap-4 mt-1">
                <input
                  type="checkbox"
                  checked={place.availability[day].isAvailable}
                  onChange={() => handleToggleDay(index, day)}
                />
                <span className="w-20">{day}</span>
                <input
                  type="time"
                  value={place.availability[day].timeFrom}
                  onChange={(e) =>
                    handleAvailabilityChange(index, day, "timeFrom", e.target.value)
                  }
                  disabled={!place.availability[day].isAvailable}
                />
                <input
                  type="time"
                  value={place.availability[day].timeTo}
                  onChange={(e) =>
                    handleAvailabilityChange(index, day, "timeTo", e.target.value)
                  }
                  disabled={!place.availability[day].isAvailable}
                />
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddPlace}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Another Place
        </button>
      </div>

      {/* Why Choose */}
      <div>
        <label className="block font-medium">Why Choose (3 Points)</label>
        {whyChoose.map((point, index) => (
          <input
            key={index}
            placeholder={`Point ${index + 1}`}
            value={point}
            onChange={(e) => {
              const updated = [...whyChoose];
              updated[index] = e.target.value;
              setWhyChoose(updated);
            }}
            className="input-field w-full my-1"
            required
          />
        ))}
      </div>

      {/* Payment Info */}
      <div>
        <label className="block font-medium mb-2">
          <FaMoneyBill className="inline text-green-500 mr-1" />
          Payment Info
        </label>
        <input
          name="accountName"
          placeholder="Account Name"
          className="input-field w-full my-1"
          value={paymentDetails.accountName}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, accountName: e.target.value })
          }
        />
        <input
          name="accountNumber"
          placeholder="Account Number"
          className="input-field w-full my-1"
          value={paymentDetails.accountNumber}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
          }
        />
        <input
          name="bank"
          placeholder="Bank"
          className="input-field w-full my-1"
          value={paymentDetails.bank}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, bank: e.target.value })
          }
        />
        <input
          name="branch"
          placeholder="Branch"
          className="input-field w-full my-1"
          value={paymentDetails.branch}
          onChange={(e) =>
            setPaymentDetails({ ...paymentDetails, branch: e.target.value })
          }
        />
      </div>

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700"
        >
          Register Doctor
        </button>
      </div>
    </form>
  );
};

export default DoctorRegistrationForm;
