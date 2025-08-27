import React, { useState } from 'react';
import axios from 'axios';

const speciesOptions = {
    Dog: ['Labrador Retriever', 'Rottweiler', 'Other'],
    Cat: ['Sri Lankan Jungle Cat', 'Sri Lankan Domestic Cat', 'Other'],
    Bird: ['Sri Lanka Hanging Parrot', 'Ceylon Junglefowl', 'Other'],
};

const PetRegistrationForm = () => {
    const [title, setTitle] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    // New optional fields
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [color, setColor] = useState('');
    const [vaccinationStatus, setVaccinationStatus] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [currentMedications, setCurrentMedications] = useState('');
    const [isNeutered, setIsNeutered] = useState(false);
    const [feedingSchedule, setFeedingSchedule] = useState('');
    const [foodType, setFoodType] = useState('');
    const [allergies, setAllergies] = useState('');
    const [exerciseRoutine, setExerciseRoutine] = useState('');
    const [activityLevel, setActivityLevel] = useState('');

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('species', species);
        formData.append('breed', breed);
        formData.append('birthdate', birthdate);
        formData.append('gender', gender);
        formData.append('content', content);
        formData.append('weight', weight);
        formData.append('height', height);
        formData.append('color', color);
        formData.append('vaccinationStatus', vaccinationStatus);
        formData.append('medicalHistory', medicalHistory);
        formData.append('currentMedications', currentMedications);
        formData.append('isNeutered', isNeutered);
        formData.append('feedingSchedule', feedingSchedule);
        formData.append('foodType', foodType);
        formData.append('allergies', allergies);
        formData.append('exerciseRoutine', exerciseRoutine);
        formData.append('activityLevel', activityLevel);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('http://localhost:5001/api/pets/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            setSuccessMessage('🐾 Pet registered successfully!');
            setTitle('');
            setSpecies('');
            setBreed('');
            setBirthdate('');
            setGender('');
            setContent('');
            setImage(null);
            setWeight('');
            setHeight('');
            setColor('');
            setVaccinationStatus('');
            setMedicalHistory('');
            setCurrentMedications('');
            setIsNeutered(false);
            setFeedingSchedule('');
            setFoodType('');
            setAllergies('');
            setExerciseRoutine('');
            setActivityLevel('');
            console.log('Pet registered:', response.data);
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            setErrorMessage('❌ Failed to register pet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 mb-10 p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Register a Pet</h2>

            {successMessage && (
                <div className="mb-4 p-3 text-green-700 bg-green-100 rounded border border-green-400">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 text-red-700 bg-red-100 rounded border border-red-400">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Pet Name" value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
                
                <select value={species} onChange={(e) => { setSpecies(e.target.value); setBreed(''); }} className="input" required>
                    <option value="">Select Species</option>
                    {Object.keys(speciesOptions).map((sp) => (
                        <option key={sp} value={sp}>{sp}</option>
                    ))}
                </select>

                <select value={gender} onChange={(e) => setGender(e.target.value)} className="input" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                {species && (
                    <select value={breed} onChange={(e) => setBreed(e.target.value)} className="input" required>
                        <option value="">Select Breed</option>
                        {speciesOptions[species].map((br) => (
                            <option key={br} value={br}>{br}</option>
                        ))}
                    </select>
                )}

                <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="input" required />
                <textarea placeholder="Description" value={content} onChange={(e) => setContent(e.target.value)} className="input" required />

                {/* New Optional Fields */}
                <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="input" />
                <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="input" />
                <input type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} className="input" />
                <input type="text" placeholder="Vaccination Status" value={vaccinationStatus} onChange={(e) => setVaccinationStatus(e.target.value)} className="input" />
                <textarea placeholder="Medical History" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} className="input" />
                <textarea placeholder="Current Medications" value={currentMedications} onChange={(e) => setCurrentMedications(e.target.value)} className="input" />
                
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="neutered" checked={isNeutered} onChange={(e) => setIsNeutered(e.target.checked)} />
                    <label htmlFor="neutered" className="text-sm">Is Neutered?</label>
                </div>

                <input type="text" placeholder="Feeding Schedule" value={feedingSchedule} onChange={(e) => setFeedingSchedule(e.target.value)} className="input" />
                <input type="text" placeholder="Food Type" value={foodType} onChange={(e) => setFoodType(e.target.value)} className="input" />
                <input type="text" placeholder="Allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="input" />
                <input type="text" placeholder="Exercise Routine" value={exerciseRoutine} onChange={(e) => setExerciseRoutine(e.target.value)} className="input" />
                <input type="text" placeholder="Activity Level" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} className="input" />

                {/* Image Upload */}
                <div className="flex items-center space-x-3">
                    <label htmlFor="fileInput" className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">Upload Image</label>
                    <input id="fileInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" />
                    {image && <span className="text-sm text-gray-700">{image.name}</span>}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
                    {loading ? 'Submitting...' : 'Register Pet'}
                </button>
            </form>
        </div>
    );
};

export default PetRegistrationForm;
