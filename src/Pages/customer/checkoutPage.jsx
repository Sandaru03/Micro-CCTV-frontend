import { useEffect, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";



export default function CheckoutPage() {
  
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(()=>{
    const token = localStorage.getItem("token");
    console.log('Token:', token);
    if(token == null){
        toast.error("Please login to continue");
        navigate("/login");
        return;
    }else{
        axios.get(import.meta.env.VITE_BACKEND_URL+"/users",{
            headers: {
                Authorization: `Bearer ${token}`
            },
        }).then((res) => {
            console.log('User Data:', res.data);
            setUser(res.data);
            setName(res.data.firstName + " " + res.data.lastName);

        }).catch((err) => {
            console.log(err);
            toast.error("Failed to fetch user details.");
            navigate("/login");
            
        })
    }

  },[])

  const [cart, setCart] = useState(location.state.items || []);

  if(location.state.items == null){
    toast.error("Please select items to checkout");
    navigate("/shop")
  } 

    function getTotal(){
    let total = 0;
    cart.forEach((item) => {
        total += item.price * item.quantity;
    });
    return total;
}

async function placeOrder(){
    const token = localStorage.getItem("token");
    if(token == null){
        toast.error("Please login to place order");
        navigate("/login");
        return;
    }

    if(name === "" || address === "" || phone === ""){
        toast.error("Please fill all the details");
        return;
    }
    const order = {
        address: address,
        phone: phone,
        items: []
    };

    cart.forEach((item) =>{
        order.items.push({
            productId: item.productId,
            qty: item.quantity
        });
    })

    try{

        await axios.post(import.meta.env.VITE_BACKEND_URL+"/orders",order,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        toast.success("Order placed successfully");

    }catch(error){
        console.log(error);
        toast.error("Error placing order");
        return;
    }
}

  console.log(cart);

  return (
    <div className="w-full h-screen flex flex-col py-[40px] items-center">
      {
        cart.map(
            (item,index) => {
          return (
            <div key={item.productId} className="w-[900px] h-[150px] m-[10px] shadow-2xl flex flex-row items-center transition-transform hover:-translate-y-1 duration-200">
                <img src={item.image} alt={item.name} className="w-[80px] h-[80px] ml-[20px]"/>
                <div className="w-[320px] h-full flex flex-col justify-center pl-[10px]">
                    <span className="font-bold">{item.name}</span>
                    <span className="font-semibold">Rs {(item.price).toFixed(2)}</span> 
                </div>
                <div className="w-[190px] h-full flex flex-row justify-center items-center">
                    <button className="cursor-pointer text-3xl" onClick={
                        ()=>{
                            const newCart = [...cart];
                            if(newCart[index].quantity > 1){
                                newCart[index].quantity -= 1;
                                setCart(newCart);
                            }
                        }
                    }>-</button>

                    <span className="mx-[10px] text-xl">{item.quantity}</span>
                    
                    <button className="cursor-pointer text-xl" onClick={
                        ()=>{
                            const newCart = [...cart];
                            newCart[index].quantity += 1;
                            setCart(newCart);
                        }
                    }>+</button>  
                </div>
                <div className="w-[190px] h-full flex justify-end items-center pr-[20px]">
                    <span className="font-bold">Rs {(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <button className="w-[30px] h-[30px] bg-red-600 text-white font-bold hover:bg-red-500 cursor-pointer rounded-full mr-[20px] flex items-center justify-center " onClick={
                    ()=>{
                        const newCart = [...cart];
                        newCart.splice(index,1);
                        setCart(newCart);                        
                    }
                }>
                    <RiDeleteBin5Fill />
                </button>
            </div>
          );
        })
      }
      <div className="w-[800px] h-[100px] m-[10px] shadow-2xl flex flex-row items-center justify-center relative">
        <input className="w-[200px] h-[40px] border border-gray-300 rounded-lg p-[10px] mr-[10px]"
            type="text"
            placeholder="Enter Your  Name"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            />

            <input className="w-[400px] h-[40px] border border-gray-300 rounded-lg p-[10px] mr-[10px]"
            type="text"
            placeholder="Enter Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            />

            <input className="w-[200px] h-[40px] border border-gray-300 rounded-lg p-[10px] mr-[10px]"
            type="text"
            placeholder="Enter Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            />
      </div>


      <div className="w-[800px] h-[100px] m-[10px] shadow-2xl flex flex-row items-center justify-end relative">
        <span className="font-bold text-xl mr-[20px]">
            Total: Rs {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} 
            </span>

            <button className="absolute left-10 bg-red-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-red-500 cursor-pointer transition" onClick={
                ()=>{
                    placeOrder();
                }
            }>Place Order</button>
      </div>


    </div>
  );
}
