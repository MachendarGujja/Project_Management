import {useState} from 'react';
// import axios from 'axios';
import API from '../api/axios';
import {Link} from 'react-router-dom';
import {authManage} from "../context/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userPwd, setUserPwd] = useState("");
    const {token,loginFn} = authManage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPswd, setShowPswd] = useState(false);

    const submitFunction = async(e) => {
        e.preventDefault();
        if(userEmail === '' || userPwd === ''){
            toast.error("Fill out details");
        }
        else {
            try {
            setLoading(true);
            const res = await API.post("/auth/login", {
                email : userEmail,
                password : userPwd
            })
             const role = res.data.user.role.toLowerCase().trim();
            loginFn(res.data.token,res.data.user);
            // navigate("/");;
            console.log(role)
            if (role === "admin") {
                navigate("/admin-dashboard");   
            } else if(role === "user") {
                navigate("/");
            }
            }
            catch(err) {
                console.log(err.message);
            }
            finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="h-screen w-screen bg-gray-200 flex flex-col items-center justify-center">
            {loading?
            (<div className="flex justify-center items-center h-96 w-full">
            <div className="h-10 w-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
            ):
            (<><h3 className="pb-14 text-2xl font-semibold">Project Management</h3>
            <div className="flex flex-col items-start">
                <h3 className="pb-3 text-lg">Login</h3>
            <form onSubmit={submitFunction} className="flex p-6 flex-col bg-gray-400 rounded-xl w-[500px]">
                <label htmlFor="email" className="mb-1 text-black">Email</label>
                <input name="email" className="rounded-xl h-10 mb-3 w-full ps-2" placeholder="Enter Email" onChange={(e)=>setUserEmail(e.target.value)} />
                <label htmlFor="password" className="mb-1 text-black">Password</label>
                <div className="relative"><input name="password" className="rounded-xl h-10 mb-8 w-full ps-2 pe-12" value={userPwd} type={showPswd?"text":"password"} placeholder="Enter Password" onChange={(e)=>setUserPwd(e.target.value)} /><button type="button" className="absolute top-1.5 right-3" onClick={()=>setShowPswd(!showPswd)}>{showPswd?<VisibilityIcon title="show" />:<VisibilityOffIcon title="hide" />}</button></div>
                <button type="submit" className="rounded-xl h-10 w-full mb-1 bg-gray-800 hover:bg-gray-700 text-white">Submit</button>
                <Link to="/signup" className="text-black font-semibold underline">Signup</Link>
            </form>
            </div></>
            )}
        </div>
    )
}

export default Login;