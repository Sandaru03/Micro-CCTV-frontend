import { Routes, Route } from "react-router-dom"; 
import Header from "../../assets/components/header";
import ProductsPage from "./productsPage";
import ProductOverViewPage from "./productOverView";
import CartPage from "./cart";
import CheckoutPage from "./checkoutPage";
import HomePage from "../homePage";
import ProfilePage from "./profilePage";
import RepairStatusPage from "../repairPage";
import AboutUs from "./about";
import ContactPage from "./contactUs";


export default function ClientWebPage(){
    return(

         <div className="w-full h-screen max-h-screen">
            <Header/>

            <div className="w-full h-[calc(100%-90px)]">
                <Routes path="/">
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/shop" element={<ProductsPage/>}/>
                    <Route path="/service" element={<RepairStatusPage/>}/>
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/contact" element={<ContactPage/>}/>
                    <Route path="/overview/:productId" element={<ProductOverViewPage/>}/>
                    <Route path="/cart" element={<CartPage/>}/>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/*" element={<h1 className="text-3xl text-red-700 text-center">404 Not Found</h1>}/>  
                </Routes>
            </div>
         </div>

    )
   
}