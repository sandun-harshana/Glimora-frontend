import axios from "axios"
import {  useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { MdEmail, MdLock, MdVpnKey } from "react-icons/md"
import { FaKey } from "react-icons/fa"

export default function ForgetPassword(){
    const [step, setStep] = useState("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    async function sendOTP(){
        try{
            await axios.get(import.meta.env.VITE_API_URL + "/api/users/send-otp/"+email)
            toast.success("OTP sent to your email "+email)
            setStep("otp")
        }catch(e){
            console.error(e)
            toast.error("Failed to send OTP. Please try again.")
        }
    }

    async function changePassword(){
        if(newPassword !== confirmPassword){
            toast.error("Passwords do not match")
            return
        }
        try{

            await axios.post(import.meta.env.VITE_API_URL + "/api/users/change-password",{
                email: email,
                otp: otp,
                newPassword: newPassword
            })
            toast.success("Password changed successfully. Please login with your new password.")
            navigate("/login")
        }catch(e){
            console.error(e)
            toast.error("OTP is incorrect or expired. Please try again.")
            return
        }
    }

    return(
        <div className="w-full h-screen flex justify-center items-center bg-[url('/bg.jpg')] bg-cover bg-center">
            {/* Email Step */}
            {step=="email" && (
                <div className="w-[400px] min-h-[400px] backdrop-blur-lg bg-white/90 rounded-3xl shadow-2xl flex flex-col justify-center items-center p-8 animate-fade-in">
                    {/* Icon Badge */}
                    <div className="bg-gradient-to-br from-accent to-accent/70 p-4 rounded-full shadow-lg mb-4">
                        <FaKey className="text-3xl text-white" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-secondary mb-2">Reset Password</h1>
                    <p className="text-secondary/70 text-center mb-6">
                        Enter your email to receive an OTP
                    </p>
                    
                    {/* Email Input */}
                    <div className="w-full mb-6">
                        <div className="relative">
                            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent text-xl" />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Enter your email" 
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary focus:border-accent transition-colors focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    <button 
                        className="w-full bg-gradient-to-r from-accent to-accent/80 text-white py-3 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold" 
                        onClick={sendOTP}
                    >
                        Send OTP
                    </button>
                </div>
            )}

            {/* OTP & Password Step */}
            {step=="otp" && (
                <div className="w-[400px] backdrop-blur-lg bg-white/90 rounded-3xl shadow-2xl flex flex-col justify-center items-center p-8 animate-fade-in">
                    {/* Icon Badge */}
                    <div className="bg-gradient-to-br from-accent to-accent/70 p-4 rounded-full shadow-lg mb-4">
                        <MdVpnKey className="text-3xl text-white" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-secondary mb-2">Enter Details</h1>
                    <p className="text-secondary/70 text-center mb-6">
                        Check your email for the OTP code
                    </p>
                    
                    {/* OTP Input */}
                    <div className="w-full mb-4">
                        <div className="relative">
                            <MdVpnKey className="absolute left-4 top-1/2 -translate-y-1/2 text-accent text-xl" />
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                placeholder="Enter OTP" 
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary focus:border-accent transition-colors focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    {/* New Password Input */}
                    <div className="w-full mb-4">
                        <div className="relative">
                            <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent text-xl" />
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                placeholder="Enter new password" 
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary focus:border-accent transition-colors focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    {/* Confirm Password Input */}
                    <div className="w-full mb-6">
                        <div className="relative">
                            <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent text-xl" />
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="Confirm new password" 
                                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary focus:border-accent transition-colors focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    <button 
                        className="w-full bg-gradient-to-r from-accent to-accent/80 text-white py-3 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold" 
                        onClick={changePassword}
                    >
                        Change Password
                    </button>
                </div>
            )}
        </div>
    )
}