import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateAdmin() {
  const location = useLocation();
  const admin = location.state || {};
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(admin.firstName || "");
  const [lastName, setLastName] = useState(admin.lastName || "");
  const [phone, setPhone] = useState(admin.phone || "Not Given");
  const email = admin.email || "";

  async function handleSubmit() {
    if (!firstName || !lastName || !email) {
      toast.error("Please fill all the fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/admins/${encodeURIComponent(email)}`,
        { firstName, lastName, phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Admin Successfully Updated");
      navigate("/admin/admins");
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error(error.response?.data?.message || "Admin update failed");
    }
  }

  if (!email) {
    toast.error("Admin data is not provided");
    navigate("/admin/admins");
    return null;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100 overflow-auto p-4">
      <div className="w-full max-w-[600px] border-[3px] rounded-[15px] p-[30px] bg-white flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-4">Update Admin</h2>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-sm font-semibold">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border-[2px] h-[40px] rounded-md px-2"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-sm font-semibold">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border-[2px] h-[40px] rounded-md px-2"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Email *</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border-[2px] h-[40px] rounded-md px-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border-[2px] h-[40px] rounded-md px-2"
          />
        </div>

        <div className="flex justify-center gap-4 py-4">
          <Link
            to="/admin/admins"
            className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-white text-black hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="w-[200px] h-[50px] border-2 border-black rounded-md flex justify-center items-center bg-black text-white hover:bg-gray-800 transition"
          >
            Update Admin
          </button>
        </div>
      </div>
    </div>
  );
}
