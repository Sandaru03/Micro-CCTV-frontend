import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
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
      toast.success(res.data.message || "Signed up successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-[url(./loginbg.jpg)] bg-cover bg-center bg-no-repeat" />
      {/* Mobile overlay for readability */}
      <div className="absolute inset-0 bg-black/50 md:bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center md:justify-end min-h-screen px-4 sm:px-6">
        <div
          className="
            w-full max-w-md sm:max-w-lg lg:max-w-xl
            rounded-[30px] border border-white/20 bg-white/10 backdrop-blur-2xl
            shadow-2xl text-white
            p-6 sm:p-8 md:mr-10
          "
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
            Sign Up
          </h1>

          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {/* First + Last name (stack on mobile, 2-col on >=sm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="
                    h-11 w-full rounded-md border border-white/40 px-3
                    bg-white/20 placeholder-white/60
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                  placeholder="Enter your first name"
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm sm:text-base">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="
                    h-11 w-full rounded-md border border-white/40 px-3
                    bg-white/20 placeholder-white/60
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  "
                  placeholder="Enter your last name"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="
                  h-11 w-full rounded-md border border-white/40 px-3
                  bg-white/20 placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="
                  h-11 w-full rounded-md border border-white/40 px-3
                  bg-white/20 placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
                placeholder="Enter your phone"
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="
                  h-11 w-full rounded-md border border-white/40 px-3
                  bg-white/20 placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
                placeholder="Enter password"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="
                  h-11 w-full rounded-md border border-white/40 px-3
                  bg-white/20 placeholder-white/60
                  focus:outline-none focus:ring-2 focus:ring-white/30
                "
                placeholder="Confirm password"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                mt-2 h-11 w-full rounded-xl bg-red-500 text-white text-base sm:text-lg font-medium
                hover:bg-red-600 active:scale-[0.99] transition-all duration-300
              "
            >
              Create Account
            </button>
          </form>

          <p className="mt-5 text-center text-sm">
            Already Have An Account?{" "}
            <Link to="/login" className="text-red-300 underline hover:text-red-200">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
