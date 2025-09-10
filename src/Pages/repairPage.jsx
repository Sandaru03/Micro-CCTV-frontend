import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

const STEP_ORDER = ["Received", "Diagnosing", "Repairing", "Ready for Pickup", "Completed"];

function Stepper({ current = "Received" }) {
  const idx = Math.max(0, STEP_ORDER.indexOf(current));
  return (
    <div className="w-full flex items-center gap-2 mt-4">
      {STEP_ORDER.map((s, i) => {
        const active = i <= idx;
        return (
          <div key={s} className="flex items-center w-full">
            <div
              className={`h-3 w-3 rounded-full ${active ? "bg-red-600" : "bg-gray-300"}`}
              title={s}
            />
            {i < STEP_ORDER.length - 1 && (
              <div className={`h-[2px] flex-1 ${i < idx ? "bg-red-600" : "bg-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RepairStatusPage() {
  const [params, setParams] = useSearchParams();
  const [serialInput, setSerialInput] = useState(params.get("s") || "");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]); 
  const [selected, setSelected] = useState(null); 

  const norm = (v = "") => v.trim().toLowerCase();

  async function fetchBySerial(snRaw) {
    const sn = snRaw.trim();
    if (!sn) {
      toast.error("Please enter the Serial Number");
      return;
    }

    setLoading(true);
    setMatches([]);
    setSelected(null);

    try {
      // 1) Try dedicated endpoint
      let got = null;
      try {
        const resA = await axios.get(
          import.meta.env.VITE_BACKEND_URL + `/repairs/serial/${encodeURIComponent(sn)}`
        );
        got = resA.data;
      } catch {
      }

      // Fallback: fetch all and filter on client
      if (!got) {
        const resB = await axios.get(import.meta.env.VITE_BACKEND_URL + "/repairs");
        got = Array.isArray(resB.data) ? resB.data : [];
        got = got.filter((r) => norm(r?.serialNo) === norm(sn));
      } else {
        if (!Array.isArray(got)) {
          got = got?.repair ? [got.repair] : [got];
        }
      }

      if (!got || got.length === 0) {
        toast.error(`No repair found for Serial: ${sn}`);
        setMatches([]);
        setSelected(null);
        return;
      }

      const sorted = [...got].sort((a, b) => {
        const ta = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const tb = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return tb - ta;
      });

      setMatches(sorted);
      setSelected(sorted[0] || null);
      setParams({ s: sn });
    } catch (e) {
      console.error(e);
      toast.error("Failed to fetch repair details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const s = params.get("s");
    if (s) fetchBySerial(s);
  }, []);

  const titleColor = useMemo(() => {
    const p = (selected?.progress || "").toLowerCase();
    if (p.includes("completed")) return "from-red-700 to-gray-800";
    if (p.includes("ready")) return "from-red-600 to-gray-800";
    if (p.includes("repair")) return "from-red-500 to-gray-800";
    if (p.includes("diagnos")) return "from-red-500 to-gray-800";
    return "from-gray-700 to-gray-900";
  }, [selected]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-600">
          Repair Status
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-gray-800">
          Track your repair by Serial Number
        </h1>
        <p className="text-gray-600 mt-2">
          Enter the device Serial No to see the latest progress and details.
        </p>
      </div>

      {/* Search Card */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && fetchBySerial(serialInput)}
                placeholder="e.g., SN-ABC123456"
                className="w-full h-12 rounded-xl border pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <button
              onClick={() => fetchBySerial(serialInput)}
              disabled={loading}
              className="cursor-pointer h-12 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-red-600 to-gray-800 shadow hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>

          {/* Helper line */}
          <p className="text-xs text-gray-500 mt-2">
            Tip: Use the exact serial printed on your receipt or device label.
          </p>
        </div>
      </div>

      {/* Result */}
      <div className="max-w-5xl mx-auto px-4 mt-8 pb-16">
        {!selected ? (
          <div className="text-center text-gray-500">
            {loading ? "Looking up your repair…" : "Enter a Serial No to view repair details."}
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr,320px] gap-6">
            {/* Main Card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden">
              {/* Banner */}
              <div className={`h-2 bg-gradient-to-r ${titleColor}`} />
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selected.deviceName || "Device"}
                  </h2>
                  <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    Status: {selected.progress || "—"}
                  </span>
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Serial No</p>
                    <p className="font-semibold text-gray-900">{selected.serialNo}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Estimated Date</p>
                    <p className="font-semibold text-gray-900">
                      {selected.estimatedDate || "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600">Progress</p>
                  <Stepper current={selected.progress} />
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selected.notes?.trim() || "No additional notes."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-xs text-gray-500">
                  {selected.updatedAt || selected.createdAt
                    ? `Last update: ${new Date(
                        selected.updatedAt || selected.createdAt
                      ).toLocaleString()}`
                    : "Last update time not available"}
                </div>
              </div>
            </div>

            {/* Matches / Meta */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-5">
                <h3 className="font-semibold text-gray-900">Other matches</h3>
                {matches.length <= 1 ? (
                  <p className="text-sm text-gray-500 mt-1">No other entries for this Serial.</p>
                ) : (
                  <div className="mt-3 space-y-2 max-h-72 overflow-auto pr-1">
                    {matches.map((m) => (
                      <button
                        key={m._id}
                        onClick={() => setSelected(m)}
                        className={`w-full text-left rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 ${
                          m._id === selected._id ? "border-red-300 bg-red-50/60" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{m.deviceName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                            {m.progress}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          ETA: {m.estimatedDate || "—"}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5">
                <h4 className="font-semibold">Need help?</h4>
                <p className="text-sm text-gray-300 mt-1">
                  If the serial doesn’t show up, please confirm the number on your receipt
                  or device label and try again.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>

      
      <section className="text-center py-20 bg-gradient-to-r from-gray-400 to-gray-100 text-white flex-grow px-6">
     
      </section>
     
    </div>
  );
}
