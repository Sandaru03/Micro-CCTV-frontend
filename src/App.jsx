import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './Pages/loginPage';
import RegisterPage from './Pages/registerPage'; 
import { Toaster } from "react-hot-toast";
import AdminPage from './Pages/adminPadge';
import TestPage from './Pages/admin/testPage';
import ClientWebPage from './Pages/customer/customerPage';
import HomePage from './Pages/homePage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ForgetPasswordPage from './Pages/customer/forgetPassword';
import TechnicianLogin from './Pages/technicianLoginPage';
import TechnicianRepairPage from './Pages/technicianRepairPage';


const clientId = "31227047536-dkeq9a5rh5h4r0nl3sq8odnils5e22ip.apps.googleusercontent.com";
const clientSecret = "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";

function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId={clientId}>
      <div className=" w-full h-screen bg-primary">
      <Toaster position="top-right"/> 
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/admin/*" element={<AdminPage/>}/>
        <Route path="/test" element={<TestPage/>}/>
        <Route path="/*" element={<ClientWebPage/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/forget" element={<ForgetPasswordPage/>}/>
        <Route path="/technician/login" element={<TechnicianLogin/>}/>
        <Route path="/technician/repairs" element={<TechnicianRepairPage/>}/>
        
      </Routes>
      </div>
      </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
