import { useState } from "react";

const DogBMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');

  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleHeightChange = (e) => setHeight(e.target.value);

  const calculateBMI = () => {
    if (!weight || !height || isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      setMessage("Please enter valid weight and height.");
      return;
    }
    
    // Convert height from cm to meters and calculate BMI
    const bmiValue = (weight / (height * height)) * 10000;
    setBmi(bmiValue.toFixed(2));
    setMessage(getBMICategory(bmiValue));
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return "Normal weight";
    } else if (bmi >= 25 && bmi <= 29.9) {
      return "Overweight";
    } else {
      return "Obese";
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Dog BMI Calculator</h2>

      <div className="mb-4">
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Dog's Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={handleWeightChange}
          className="w-full p-2 border rounded-md mt-1"
          placeholder="Enter weight in kg"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
          Dog's Height (cm)
        </label>
        <input
          type="number"
          id="height"
          value={height}
          onChange={handleHeightChange}
          className="w-full p-2 border rounded-md mt-1"
          placeholder="Enter height in cm"
        />
      </div>

      <div className="text-center">
        <button
          onClick={calculateBMI}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Calculate BMI
        </button>
      </div>

      {bmi && (
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold">Your Dog's BMI: {bmi}</h3>
          <p className="text-lg font-medium mt-2">{message}</p>
        </div>
      )}
    </div>
  );
};

export default DogBMICalculator;
