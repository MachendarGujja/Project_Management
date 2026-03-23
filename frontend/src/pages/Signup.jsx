// import axios from 'axios';
import API from '../api/axios';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import toast from "react-hot-toast";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Signup = () => {
    const [user, setUser] =  useState({
        name:"",
        role:"user",
        email:"",
        password:""
    })
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPswd, setShowPswd] = useState(false);

    const inputFunction = (e) => {
        setUser({...user,[e.target.name]:e.target.value});
    }

    const submitFunction = async(e) => {
        e.preventDefault();
        // console.log(user);
        if(user.name === '' || user.email === '' || user.password === '') {
            toast.error("Fill out all the fields");
        }
        else {
            try {
            setLoading(true);
            await API.post("/auth/signup",user);
            toast.success("User Created Successfully");
            navigate("/login")
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
        <div className="h-screen w-screen bg-gray-300 flex flex-col items-center justify-center">
            {loading?
            (<div className="flex justify-center items-center h-96 w-full">
            <div className="h-10 w-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
            )
            :(<>
            <h3 className="pb-14 text-2xl font-semibold">Project Management</h3>
            <div className="flex flex-col items-start">
                <h3 className="pb-3 text-lg">SignUp</h3>
            <form onSubmit={submitFunction} className="flex p-6 flex-col bg-gray-400 rounded-xl w-[500px]">
                <label htmlFor="name" className="mb-1 text-black">User Name</label>
                <input name="name" className="rounded-xl h-11 mb-3 w-full ps-2" placeholder="Enter Name" onChange={inputFunction} />
                <label htmlFor="role" className="mb-1 text-black">Select Role</label>
                <select name="role" className="rounded-xl h-11 mb-3 w-full ps-2" value={user.role} onChange={inputFunction}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <label htmlFor="email" className="mb-1 text-black">Email</label>
                <input name="email" className="rounded-xl h-10 mb-3 w-full ps-2" placeholder="Enter Email" onChange={inputFunction} />
                <label htmlFor="password" className="mb-1 text-black">Password</label>
                <div className="relative"><input name="password" className="rounded-xl h-10 mb-8 w-full ps-2 pe-12" type={showPswd?"text":"password"} placeholder="Enter Password" onChange={inputFunction} /><button type="button" className="absolute top-1.5 right-3" onClick={()=>setShowPswd(!showPswd)}>{showPswd?<VisibilityIcon />:<VisibilityOffIcon />}</button></div>
                <button type="submit" className="rounded-xl h-10 w-full bg-gray-800 hover:bg-gray-700 text-white mb-1">Submit</button>
                <Link to="/login" className="text-black font-semibold underline">Login</Link>
            </form>
            </div>
            </>)}
        </div>
    )
}

export default Signup;