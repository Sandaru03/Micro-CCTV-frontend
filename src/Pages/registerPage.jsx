import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate(); // useNavigate hook එක
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users`,
        formData
      );
      toast.success(res.data.message);

      // Sign up success උනාම login page එකට navigate වෙනවා
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="w-full h-screen bg-[url(./loginbg.jpg)] bg-cover bg-center flex justify-end items-center">
      {/* Transparent Box */}
      <div className="w-[500px] h-[800px] backdrop-blur-2xl bg-white/10 border border-white/20 
                      rounded-[30px] shadow-2xl text-white flex flex-col items-center p-8 mr-10">
        <h1 className="text-4xl font-bold text-center mb-6">Sign Up</h1>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <span className="text-lg">First Name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full h-[45px] border border-white rounded-md px-3 
                       bg-white/20 placeholder-white/60 focus:outline-none"
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <span className="text-lg">Last Name</span>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full h-[45px] border border-white rounded-md px-3 
                       bg-white/20 placeholder-white/60 focus:outline-none"
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <span className="text-lg">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-[45px] border border-white rounded-md px-3 
                       bg-white/20 placeholder-white/60 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <span className="text-lg">Phone</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-[45px] border border-white rounded-md px-3 
                       bg-white/20 placeholder-white/60 focus:outline-none"
              placeholder="Enter your phone"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <span className="text-lg">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-[45px] border border-white rounded-md px-3 
                       bg-white/20 placeholder-white/60 focus:outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <span className="text-lg">Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-[45px] border border-white rounded-md px-3 
                       bg-white/20 placeholder-white/60 focus:outline-none"
              placeholder="Confirm password"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-[45px] bg-red-500 rounded-xl text-white text-lg mt-4 
             hover:bg-red-600 transition-all duration-300 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already Have An Account?{" "}
          <Link to="/login" className="text-red-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
