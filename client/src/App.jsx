import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import SignIn from './pages/SignIn'; 
import SignUp from './pages/SignUp';
import Home from './pages/Home'; 
import DetailedPage from './pages/DetailedPage'; 
import UserProfile from './pages/UserProfile';
import AddElephant from './pages/AddElephant'; 
import SelectElephants from './pages/SelectElephants';
import AddCaretakers from './pages/AddCaretakers';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import ClavingPeriod from './pages/ClavingPeriods';
import RegisterPet from './pages/RegisterPet';
import SysDashboard from './pages/SystemDashBoard';
import DoctorDetails from './pages/DoctorDetails';
import CreatePost from './pages/CreatePost';
import PostList from './pages/PostList';
import DoctorProfile from './pages/DoctorProfile';
import BookSession from './pages/BookSession';
import PetReg from './pages/RegisterPet';
import Addvaccination from './pages/AddVaccinations';
import Pets from './pages/Pets';
import ViewVaccinations from './pages/ViewVaccinations';
import Vaccinations from './pages/Vaccinations';
import MyPosts from './pages/MyPosts';
import ManagePosts from './pages/ManagePosts';
import Services from './pages/Services';
import BMICalculator from './pages/BMICalculator';
import UpdatePost from './pages/UpdatePosts';
import SkinPredict from './pages/SkinPredict';
import PhysicalSession from './pages/BookPhysicalSession';
import AddMedicalStatusReport from './pages/CreateMedicalRecord';
import ProgressChecker from './pages/ProgressChecker';
import ManageGrowthRecords from './pages/ManageGrowthRecords';
import QrForPet from './pages/QrForPet';
import AddHospital from './pages/AddHospital';
import DisplayHospital from './pages/DisplayHospitals';
import AdminDashboard from './pages/Admin-Dashboard';
import ManageHospitals from './pages/ManageHospitals';
import ManageDoctors from './pages/ManageDoctors';
import TestPrediction from './pages/test';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/detailedpage" element={<DetailedPage />} />
          <Route path="/add-elephant" element={<AddElephant />} /> 
          <Route path="/add-doctors" element={<AddCaretakers />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/sys-dashboard" element={<SysDashboard />} /> 
          <Route path="/booking" element={<Booking />} /> 
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/claving" element={<ClavingPeriod />} /> 
          <Route path="/select-elephants" element={<SelectElephants />} />
          <Route path="/register-pet" element={<RegisterPet />} />
          <Route path="/doctor" element={<DoctorDetails />} />
          <Route path="/postlist" element={<PostList />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/book-session" element={<BookSession />} />
          <Route path="/petReg" element={<PetReg />} />
          <Route path="/addVaccination" element={<Addvaccination />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/vaccinations" element={<Vaccinations />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/services" element={<Services />} />
          <Route path="/update-post" element={<UpdatePost />} />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/manage-posts" element={<ManagePosts />} />
          <Route path="/viewVaccinations" element={<ViewVaccinations />} />
          <Route path="/skin-predict" element={<SkinPredict/>} />
          <Route path="/add-medical-report" element={<AddMedicalStatusReport/>} />
          <Route path="/doctor-profile/:doctorId" element={<DoctorProfile />} />
          <Route path="/physical-session" element ={<PhysicalSession/>}/>
          <Route path="/progress" element ={<ProgressChecker/>}/>
          <Route path="/qr-for-pet" element ={<QrForPet/>}/>
          <Route path="/add-hospital" element ={<AddHospital/>}/>
          <Route path="/display-hospital" element ={<DisplayHospital/>}/>
          <Route path="/manage-growth-records" element ={<ManageGrowthRecords/>}/>
          <Route path="/manage-hospitals" element ={<ManageHospitals/>}/>
          <Route path="/manage-doctors" element ={<ManageDoctors/>}/>
          <Route path="/admin-dashboard" element ={<AdminDashboard/>}/>
          <Route path="/test" element ={<TestPrediction/>}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
