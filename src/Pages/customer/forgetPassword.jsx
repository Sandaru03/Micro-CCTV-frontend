import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
  const navigate = useNavigate();

  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOTP(e) {
    e?.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/send-otp`,
        { email }
      );
      toast.success("OTP sent successfully");
      setEmailSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e) {
    e?.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/reset-password`,
        { email, otp, newPassword }
      );
      toast.success("Password reset successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-10 bg-transparent text-secondary">
      <div className="w-full max-w-md rounded-[30px] bg-primary shadow-2xl p-6 sm:p-8">
        {!emailSent ? (
          <form onSubmit={sendOTP} className="flex flex-col items-stretch gap-5">
            <h1 className="text-2xl font-bold text-center">Reset Password</h1>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="h-11 w-full rounded-xl border border-black px-3 text-center bg-transparent placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="h-11 w-full rounded-xl bg-red-500 text-white text-lg hover:bg-red-600 active:scale-[0.99] transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="h-11 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition cursor-pointer"
            >
              Go to Login
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="flex flex-col items-stretch gap-4">
            <h1 className="text-2xl font-bold text-center">Verify OTP</h1>

            <div className="text-center text-sm opacity-80 -mt-1">  
              OTP sent to <span className="font-semibold">{email}</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="h-11 w-full rounded-xl border border-black px-3 text-center bg-transparent placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="h-11 w-full rounded-xl border border-black px-3 text-center bg-transparent placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="h-11 w-full rounded-xl border border-black px-3 text-center bg-transparent placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !otp || !newPassword || !confirmPassword}
              className="mt-2 h-11 w-full rounded-xl bg-blue-500 text-white text-lg hover:bg-blue-600 active:scale-[0.99] transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="h-11 flex-1 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 active:scale-[0.99] transition cursor-pointer"
              >
                Change Email
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="h-11 flex-1 rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
