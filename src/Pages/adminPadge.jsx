import { NavLink, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { IoPeople, IoPeopleCircleOutline } from "react-icons/io5";
import { HiShoppingBag } from "react-icons/hi2";
import { FaBoxArchive } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDashboard } from "react-icons/md";
import { MdSettingsAccessibility } from "react-icons/md";
import { FaFilePen } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";



// Pages
import ProductAdminPage from "./admin/productAdminPage";
import AddProductPage from "./admin/addProductAdminPage";
import UpdateProductPage from "./admin/updateProduct";
import OrdersPageAdmin from "./admin/ordersPageAdmin";
import EmployeeAdminPage from "./admin/employeeAdminPage";
import AddEmployeeAdminPage from "./admin/addEmployeeAdminPage";
import UpdateEmployeeAdminPage from "./admin/updateEmployee";
import AdminAdminPage from "./admin/adminAdminPage";
import AddAdminAdminPage from "./admin/addAdminPage";
import SupplierAdminPage from "./admin/supplierAdminPage";
import AddSupplier from "./admin/addSupplierPage";
import UpdateSupplierAdminPage from "./admin/updateSupplier";
import Loader from "../assets/components/loader";
import TechnicianAdminPage from "./admin/techniciansAdminPage";
import AddTechnicianAdminPage from "./admin/addTechnicianAdminPage";
import UpdateTechnicianAdminPage from "./admin/updateTechnicianAdminPage";
import ReviewsAdminPage from "./admin/reviewAdminPage";

// Sidebar link
function SidebarLink({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all",
          "text-slate-300 hover:text-white",
          "hover:bg-white/5",
          isActive ? "text-white bg-white/10 shadow-inner" : "",
        ].join(" ")
      }
    >
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-white/70 opacity-0 transition-opacity group-[.active]:opacity-100" />
      <Icon className="text-xl shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function DashboardHero() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-[1px] shadow-lg">
        <div className="rounded-2xl bg-slate-900/80 p-6 backdrop-blur text-slate-100">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-300 mt-1">Welcome back! Choose a section from the sidebar to manage your store.</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Products", to: "/admin/product", icon: HiShoppingBag },
          { label: "Orders", to: "/admin/order", icon: FaBoxArchive },
          { label: "Employees", to: "/admin/employee", icon: IoPeople },
          { label: "Suppliers", to: "/admin/supplier", icon: IoPeopleCircleOutline },
          { label: "Technician", to: "/admin/technicians", icon: IoPeople },
          { label: "Review", to: "/admin/reviews", icon: IoPeople },
        ].map((c) => (
          <NavLink
            key={c.label}
            to={c.to}
            className="rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-white/10 p-5 flex items-center gap-4 transition-transform hover:-translate-y-0.5 text-slate-100"
          >
            <c.icon className="text-2xl" />
            <div>
              <p className="text-slate-300 text-sm">Go to</p>
              <p className="font-semibold">{c.label}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [status, setStatus] = useState("loading"); // "loading" | "admin" | "not-admin"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("not-admin");
      return;
    }
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.role === "admin") setStatus("admin");
        else setStatus("not-admin");
      })
      .catch(() => setStatus("not-admin"));
  }, []);

  // Toast when not-admin
  useEffect(() => {
    if (status === "not-admin") {
      toast.error("You must be logged in as admin to access this page");
    }
  }, [status]);

  if (status === "loading") return <Loader />;
  if (status === "not-admin") return <Navigate to="/login" replace />;

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  const handleGoToShop = () => {
    navigate("/"); 
  };

  return (
    <div className="min-h-screen w-full bg-slate-950">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto w-full max-w-[1700px] 2xl:max-w-[95vw] px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between text-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 p-2 md:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <HiX className="text-lg" /> : <HiMenu className="text-lg" />}
            </button>
            <div className="font-bold tracking-tight text-lg">Admin</div>
          </div>

          <div className="flex items-center gap-2">
            {/* New Shop button */}
            <button
              onClick={handleGoToShop}
              className="rounded-xl border border-white/10 cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 text-sm font-semibold shadow flex items-center gap-2"
            >
              <IoMdHome  className="text-base" />
              Home
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl cursor-pointer bg-red-600/90 hover:bg-red-600 px-3 py-1.5 text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1700px] 2xl:max-w-[95vw] px-3 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-5">
        {/* Sidebar */}
        <aside
          className={[
            "md:sticky md:top-20 md:h-[calc(100vh-6rem)] md:block",
            sidebarOpen ? "block" : "hidden",
            "md:block md:-ml-2",
          ].join(" ")}
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-900/60 p-3 shadow-xl text-slate-100">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                <RiAdminFill />
              </div>
              <div>
                <p className="text-sm text-slate-300">Welcome</p>
                <p className="font-semibold">Admin Panel</p>
              </div>
            </div>

            <nav className="space-y-1">
              <SidebarLink to="/admin" icon={MdDashboard} label="Dashboard" onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/admin/add-admin" icon={RiAdminFill} label="Admin" onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/admin/employee" icon={IoPeople} label="Employee" onClick={() => setSidebarOpen(false)} />
              <SidebarLink
                to="/admin/supplier"
                icon={IoPeopleCircleOutline}
                label="Supplier"
                onClick={() => setSidebarOpen(false)}
              />
              <SidebarLink to="/admin/product" icon={HiShoppingBag} label="Product" onClick={() => setSidebarOpen(false)} />
              <SidebarLink to="/admin/order" icon={FaBoxArchive} label="Order" onClick={() => setSidebarOpen(false)} />
              <SidebarLink
                to="/admin/technicians"
                icon={MdSettingsAccessibility}
                label="Technician"
                onClick={() => setSidebarOpen(false)}
              />
              <SidebarLink
                to="/admin/reviews"
                icon={FaFilePen }
                label="Reviews"
                onClick={() => setSidebarOpen(false)}
              />
            </nav>
          </div>
        </aside>

        {/* Main content (make text dark by default for white cards) */}
        <main className="min-h-[60vh] text-slate-900">
          <Routes>
            <Route index element={<DashboardHero />} />
            <Route path="product" element={<ProductAdminPage />} />
            <Route path="order" element={<OrdersPageAdmin />} />
            <Route path="newproduct" element={<AddProductPage />} />
            <Route path="updateproduct" element={<UpdateProductPage />} />
            <Route path="employee" element={<EmployeeAdminPage />} />
            <Route path="newemployee" element={<AddEmployeeAdminPage />} />
            <Route path="updateemployee" element={<UpdateEmployeeAdminPage />} />
            <Route path="add-admin" element={<AdminAdminPage />} />
            <Route path="newadmin" element={<AddAdminAdminPage />} />
            <Route path="supplier" element={<SupplierAdminPage />} />
            <Route path="newsupplier" element={<AddSupplier />} />
            <Route path="updatesupplier" element={<UpdateSupplierAdminPage />} />
            <Route path="technicians" element={<TechnicianAdminPage />} />
            <Route path="newtechnician" element={<AddTechnicianAdminPage />} />
            <Route path="updatetechnician" element={<UpdateTechnicianAdminPage />} />
            <Route path="reviews" element={<ReviewsAdminPage/>} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto w-full max-w-[1700px] 2xl:max-w-[95vw] px-3 sm:px-6 lg:px-8 py-4 text-xs text-slate-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} MicroCCTV Admin</span>
          <span className="opacity-60">Built with ♥ and Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
