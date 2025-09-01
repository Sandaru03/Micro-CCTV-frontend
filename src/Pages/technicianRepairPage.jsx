import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiPlus, FiSearch } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function TechnicianRepairPage() {
  const navigate = useNavigate();

  const [deviceName, setDeviceName] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [progress, setProgress] = useState("Received");
  const [notes, setNotes] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [repairs, setRepairs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [q, setQ] = useState("");

  // ===== Edit states =====
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null); // repair object
  const [eDeviceName, setEDeviceName] = useState("");
  const [eSerialNo, setESerialNo] = useState("");
  const [eProgress, setEProgress] = useState("Received");
  const [eNotes, setENotes] = useState("");
  const [eEstimatedDate, setEEstimatedDate] = useState("");
  const [updating, setUpdating] = useState(false);

  // simple auth guard (based on techToken saved at login)
  useEffect(() => {
    const t = localStorage.getItem("techToken");
    if (!t) {
      toast.error("Please login as a technician");
      navigate("/technician/login");
    }
  }, [navigate]);

  // load existing repairs
  async function loadRepairs() {
    try {
      setLoadingList(true);
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/repairs"
      );
      setRepairs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load repairs");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadRepairs();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!deviceName.trim() || !serialNo.trim() || !progress.trim() || !estimatedDate) {
      toast.error("අත්‍යවශ්‍ය සියල්ල පුරවන්න");
      return;
    }

    const payload = {
      deviceName: deviceName.trim(),
      serialNo: serialNo.trim(),
      progress: progress.trim(),
      notes: notes.trim(),
      estimatedDate, // yyyy-mm-dd (schema expects String)
    };

    try {
      setSubmitting(true);
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/repairs",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            // If your backend uses auth for this route, send token:
            // Authorization: `Bearer ${localStorage.getItem("techToken") || ""}`,
          },
        }
      );
      toast.success("Repair Create Successfully ✅");
      // reset form
      setDeviceName("");
      setSerialNo("");
      setProgress("Received");
      setNotes("");
      setEstimatedDate("");
      // refresh list
      loadRepairs();
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        "Failed to create repair";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // ===== Edit helpers =====
  function openEditModal(repair) {
    setSelected(repair);
    setEDeviceName(repair?.deviceName || "");
    setESerialNo(repair?.serialNo || "");
    setEProgress(repair?.progress || "Received");
    setENotes(repair?.notes || "");
    setEEstimatedDate(repair?.estimatedDate || "");
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setSelected(null);
    setUpdating(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!selected?._id) {
      toast.error("Invalid repair");
      return;
    }
    if (!eDeviceName.trim() || !eSerialNo.trim() || !eProgress.trim() || !eEstimatedDate) {
      toast.error("අත්‍යවශ්‍ය සියල්ල පුරවන්න");
      return;
    }

    const body = {
      deviceName: eDeviceName.trim(),
      serialNo: eSerialNo.trim(),
      progress: eProgress.trim(),
      notes: eNotes.trim(),
      estimatedDate: eEstimatedDate,
    };

    try {
      setUpdating(true);
      const res = await axios.put(
        import.meta.env.VITE_BACKEND_URL + `/repairs/${selected._id}`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("techToken") || ""}`,
          },
        }
      );
      const updated = res?.data?.repair || res?.data; // support either shape
      // update list locally
      setRepairs((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      toast.success("Repair Updated ✅");
      closeEditModal();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to update repair";
      toast.error(msg);
      setUpdating(false);
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return repairs;
    return repairs.filter(
      (r) =>
        r?.serialNo?.toLowerCase().includes(term) ||
        r?.deviceName?.toLowerCase().includes(term)
    );
  }, [repairs, q]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Technician Repairs</h1>
        <p className="text-gray-600 mt-1">
          Add new repair records and review existing entries.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 grid lg:grid-cols-2 gap-8">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gray-900 text-white">
              <FiPlus />
            </div>
            <h2 className="text-xl font-semibold">New Repair</h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g., CCTV Camera Model X"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                placeholder="e.g., SN-ABC123456"
                className="w-full border rounded-xl p-3 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress <span className="text-red-500">*</span>
                </label>
                <select
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                >
                  <option>Received</option>
                  <option>Diagnosing</option>
                  <option>Repairing</option>
                  <option>Ready for Pickup</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={estimatedDate}
                  onChange={(e) => setEstimatedDate(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes (issues found, parts needed, etc.)"
                rows={4}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : "Save Repair"}
            </button>
          </form>
        </div>

        {/* List / Search */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold">Repairs List</h2>
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by Serial No / Device"
                className="w-full border rounded-xl pl-9 pr-3 h-10 focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
          </div>

          {loadingList ? (
            <p className="text-gray-500">Loading repairs…</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500">No repairs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="px-3 py-2">Device</th>
                    <th className="px-3 py-2">Serial No</th>
                    <th className="px-3 py-2">Progress</th>
                    <th className="px-3 py-2">ETA</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r._id} className="bg-gray-50/70">
                      <td className="px-3 py-2 font-medium">{r.deviceName}</td>
                      <td className="px-3 py-2">{r.serialNo}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 rounded-lg text-xs bg-gray-900 text-white">
                          {r.progress}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {r.estimatedDate || "-"}
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => openEditModal(r)}
                          className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-lg border hover:bg-gray-100"
                          title="Edit"
                        >
                          <BiEditAlt />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        
        </div>
      </div>

      {/* ===== Edit Modal ===== */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeEditModal}
          />
          <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Edit Repair</h3>
              <p className="text-gray-500 text-sm">
                Update the selected repair details and save.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={eDeviceName}
                  onChange={(e) => setEDeviceName(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial No <span className="text-red-500">*</span>
                </label>
                <input
                  value={eSerialNo}
                  onChange={(e) => setESerialNo(e.target.value)}
                  className="w-full border rounded-xl p-3 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eProgress}
                    onChange={(e) => setEProgress(e.target.value)}
                    className="w-full border rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
                  >
                    <option>Received</option>
                    <option>Diagnosing</option>
                    <option>Repairing</option>
                    <option>Ready for Pickup</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={eEstimatedDate}
                    onChange={(e) => setEEstimatedDate(e.target.value)}
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={eNotes}
                  onChange={(e) => setENotes(e.target.value)}
                  rows={4}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="h-10 px-4 rounded-xl border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="h-10 px-4 rounded-xl bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
