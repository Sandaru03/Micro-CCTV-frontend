import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("Token:", token); // Debug token
    if (!token) {
      setError("No token found, please login first");
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Raw response:", res); // Debug full response
        const data = res.data; // Check if data is nested
        console.log("Profile data received:", data); // Debug data
        if (data.role === "admin") {
          toast.error("Admins cannot access this page");
          navigate("/admin");
          return;
        }
        setUser(data); // Set user state with received data
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err.response || err);
        const errorMessage = err.response?.data?.message || "Failed to load profile";
        setError(errorMessage);
        toast.error(errorMessage);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate]);

  // Debug state after render
  console.log("User state:", user);

  if (error) {
    return <div className="text-white p-5">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-white p-5">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl text-white backdrop-blur-md">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="space-y-4">
        <p><strong>First Name:</strong> {user.firstName || "Not Provided"}</p>
        <p><strong>Last Name:</strong> {user.lastName || "Not Provided"}</p>
        <p><strong>Email:</strong> {user.email || "Not Provided"}</p>
        <p><strong>Phone:</strong> {user.phone || "Not Provided"}</p>
        {/* <p><strong>Role:</strong> {user.role || "Not Provided"}</p> */}
        {user.image && <img src={user.image} alt="Profile" className="w-24 h-24 rounded-full mt-4" />}
      </div>
    </div>
  );
}