import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Image from "../assets/CoverImage.webp";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Step 1: Sign up the user
      const signUpResponse = await axios.post("http://localhost:5001/api/users/sign-up", {
        email,
        password,
      }, { withCredentials: true }); // Include cookies in the request

      if (signUpResponse.status === 201) {
        toast.success("Sign-up successful! Signing you in...");

        // Step 2: Sign in the user automatically
        const signInResponse = await axios.post("http://localhost:5001/api/users/sign-in", {
          email,
          password,
        }, { withCredentials: true }); // Include cookies in the request

        if (signInResponse.status === 200) {
          toast.success("Sign-in successful!");

          // Save user details and authentication token in local storage
          localStorage.setItem('user', JSON.stringify(signInResponse.data.user));
          localStorage.setItem('authToken', signInResponse.data.token);

          // Emit an event to localStorage to notify other components of the update
          localStorage.setItem('signIn', Date.now());

          navigate('/dashboard');
        } else {
          toast.error("Failed to sign in. Please try again.");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create account. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <div className="hidden md:flex w-3/4 justify-center items-center">
        <img
          src={Image}
          alt="Sign Up"
          className="object-cover h-full"
        />
      </div>
      <div className="flex justify-center items-center w-full md:w-1/2 p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <p className="text-center mt-4">
            Have an account?{" "}
            <Link
              to="/sign-in"
              className="text-yellow-500 hover:text-yellow-700 font-bold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignUp;
