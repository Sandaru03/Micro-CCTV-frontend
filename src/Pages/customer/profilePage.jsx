// src/pages/profile/ProfilePage.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLogOut, FiEdit3, FiMail, FiPhone, FiUser } from "react-icons/fi";

export default function ProfilePage() {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Display name & initials (always show initials avatar; no photo bar)
  const displayName = useMemo(() => {
    const first = user?.firstName?.trim() || "";
    const last  = user?.lastName?.trim() || "";
    return (first || last) ? `${first} ${last}`.trim() : (user?.email || "User");
  }, [user]);

  const initials = useMemo(() => {
    const f = (user?.firstName || "").trim();
    const l = (user?.lastName || "").trim();
    const fromEmail = (user?.email || "").charAt(0).toUpperCase();
    if (f || l) return `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase() || fromEmail || "U";
    return fromEmail || "U";
  }, [user]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!token) {
        setError("No token found, please login first");
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;
        const data = res.data;

        if (data?.role === "admin") {
          toast.error("Admins cannot access this page");
          navigate("/admin");
          return;
        }

        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err?.response || err);
        const msg = err?.response?.data?.message || "Failed to load profile";
        if (!mounted) return;
        setError(msg);
        toast.error(msg);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  }

  function handleEdit() {
    navigate("/profile/edit");
  }

  if (loading) {
    // Minimal skeleton (no header bar)
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="rounded-2xl overflow-hidden shadow border bg-white p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-200 animate-pulse" />
              <div className="flex-1">
                <div className="h-6 w-40 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl border">
                  <div className="h-4 w-24 bg-neutral-200 rounded mb-2 animate-pulse" />
                  <div className="h-5 w-48 bg-neutral-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-28 bg-neutral-200 rounded-full animate-pulse" />
              <div className="h-10 w-32 bg-neutral-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="rounded-xl border bg-white p-6 text-red-600">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-50 via-white to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-2xl shadow border bg-white p-6 sm:p-8">
          {/* Top: Gradient ring avatar (initials only) + name + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Gradient ring circle */}
            <div className="shrink-0">
              <div className="relative rounded-full p-[3px] bg-gradient-to-tr from-red-600 via-red-500/80 to-neutral-600 shadow-md">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-wide">
                    {initials}
                  </span>
                </div>
              </div>
            </div>

            {/* Name + email */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
                {displayName}
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 truncate">
                {user?.email || "Not Provided"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* <button
                onClick={handleEdit}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border text-neutral-700 hover:bg-neutral-50 active:scale-95 transition"
                title="Edit Profile"
              >
                <FiEdit3 />
                <span className="text-sm font-medium">Edit</span>
              </button> */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-red-600 text-white hover:bg-red-500 active:scale-95 transition"
                title="Log out"
              >
                <FiLogOut />
                <span className="text-sm font-semibold cursor-pointer">Logout</span>
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon={<FiUser className="text-rose-600" />}
              label="First Name"
              value={user?.firstName || "Not Provided"}
            />
            <InfoCard
              icon={<FiUser className="text-rose-600" />}
              label="Last Name"
              value={user?.lastName || "Not Provided"}
            />
            <InfoCard
              icon={<FiMail className="text-rose-600" />}
              label="Email"
              value={user?.email || "Not Provided"}
            />
            <InfoCard
              icon={<FiPhone className="text-rose-600" />}
              label="Phone"
              value={user?.phone || "Not Provided"}
            />
          </div>

          {/* <div className="mt-6 text-xs text-neutral-500">
            Tip: keep your contact details up to date to receive order updates.
          </div> */}
        </div>
      </div>
    </div>
  );
}

/** Small presentational card for profile fields */
function InfoCard({ icon, label, value }) {
  return (
    <div className="p-4 rounded-xl border bg-white hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            {label}
          </div>
          <div className="mt-0.5 text-sm sm:text-base font-medium text-neutral-800 break-words">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}
