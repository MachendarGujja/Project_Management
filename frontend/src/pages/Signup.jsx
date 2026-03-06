import axios from 'axios';
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Signup = () => {
    const [user, setUser] =  useState({
        name:"",
        role:"user",
        email:"",
        password:""
    })
    const navigate = useNavigate();

    const inputFunction = (e) => {
        setUser({...user,[e.target.name]:e.target.value});
    }

    const submitFunction = async(e) => {
        e.preventDefault();
        // console.log(user);
        if(user.name === '' || user.email === '' || user.password === '') {
            alert("Fill out all the fields");
        }
        else {
            await axios.post("http://localhost:4000/api/auth/signup",user);
            alert("User Created Successfully");
            navigate("/login")
        }
    }

    return (
        <div className="h-screen w-screen bg-gray-300 flex flex-col items-center justify-center">
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
                <input name="password" className="rounded-xl h-10 mb-8 w-full ps-2" type="password" placeholder="Enter Password" onChange={inputFunction} />
                <button type="submit" className="rounded-xl h-10 w-full bg-gray-800 hover:bg-gray-700 text-white mb-1">Submit</button>
                <Link to="/login" className="text-black font-semibold underline">Login</Link>
            </form>
            </div>
        </div>
    )
}

export default Signup;