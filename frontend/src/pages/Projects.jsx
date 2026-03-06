import {authManage} from '../context/AuthContext';
import {useState, useEffect, useCallback} from 'react';
import {Link,useParams} from 'react-router-dom';
import axios from 'axios';
import DeleteIcon  from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Projects = () => {
    const {token,user, logoutFn} = authManage();
    const [editname, setEditName] = useState("");
    const [edit, setEdit] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status:"pending"
    });
    const [projects, setProjects] = useState([]);
    const {userId} = useParams();
    const inputFunction = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value});
    };
    const submitFunction = async(e) => {
        e.preventDefault();
        if(!formData.name.trim()) {
            alert("Enter Name");
            return; 
        }
        const res = await axios.post("http://localhost:4000/api/projects",formData, {
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setProjects(prev => [...prev,res.data])
        setFormData({name:"",description:"",status:"pending"});
        alert("Project Created");
    }
    const displayProjects = async() => {
        try {
        const resData = await axios.get("http://localhost:4000/api/projects/",{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setProjects(resData.data);
        // console.log(resData)
        // console.log("Token:", token);
        }
        catch(err) {
            console.log(err.response?.data);
        }
    }

    const displayUserProjects = async() => {
        try {
            const res = await axios.get(`http://localhost:4000/api/projects/${userId}`,{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });
            setProjects(res.data);
        }
        catch(err) {
            console.log(err.message);
        }
    }
    
    const handleEdit = (data) => {
        // console.log(data);
        setEdit(data._id);
        setEditName(data.name);
    }
    const handleSave = async(id) => {
        try {
        const res = await axios.put(`http://localhost:4000/api/projects/${id}`,{name : editname},{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setProjects(prev => prev.map((p)=>p._id === id? res.data:p));
        setEdit(null);
        // console.log(projects);
        }
        catch(err){
            console.error(err);
        }
    }

    const handleDelete = async(id) => {
        try {
        await axios.delete(`http://localhost:4000/api/projects/${id}`,{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setProjects(prev => prev.filter((s)=> s._id !== id));
        alert("project deleted successfully");
    }
    catch(err) {
        console.log(err);
    }
    }

    const handlingStatus = async(id,v) => {
        try {
            const res = await axios.put(`http://localhost:4000/api/projects/${id}`,{ status : v},{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            setProjects((prev)=> prev.map((p)=> p._id === id ? res.data:p));
            // console.log("status changed successfully");
        }
        catch(err) {
            console.error(err);
        }
    }

    useEffect(()=> {
        if(user?.role === 'user'){
            displayProjects();
        }
        else if(user?.role === 'admin'){
            displayUserProjects();
        }
        // console.log(user)
    },[token,user])
    return (
        <div className="h-screen w-full p-10 bg-gray-300 flex items-start justify-around">
        <div className="h-full w-[40%] flex items-center">
        <div className="flex flex-col relative w-full items-start p-20 pt-28 bg-gray-400 rounded-xl">
        {user?.role === 'admin'&&<Link to="/admin-dashboard" className="my-4 flex items-center justify-center rounded-xl h-10 px-2" title="Back"><ArrowBackIosIcon />Back</Link>}
        <h2 className="absolute top-6 left-4 font-semibold text-lg capitalize">Welcome {user?.name}</h2>
        {user?.role === 'user'&& <button className="my-4 absolute top-1 right-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white" title="Logout" onClick={logoutFn}><LogoutIcon /></button>}
        <h2 className="font-semibold text-lg mb-3">Create New Project :</h2>
        <form onSubmit={submitFunction} className="flex flex-col w-full">
            <label htmlFor="name" className="mb-1 text-black">Project Name</label>
            <input name="name" placeholder="Enter Project Name" className="rounded-xl h-10 mb-1 w-full ps-2" value={formData.name} onChange={inputFunction} />
            <label htmlFor="description" className="mb-1 text-black">Project Description</label>
            <input name="description" placeholder="Enter Project Description" className="rounded-xl h-10 mb-1 w-full ps-2" value={formData.description} onChange={inputFunction} />
            <label htmlFor="status" className="mb-1 text-black">Project Status</label>
            <select name="status" className="rounded-xl h-10 mb-1 w-full ps-2" value={formData.status} onChange={inputFunction}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
            {/* <input name="status" className="rounded-xl h-10 mb-1 w-full ps-2" value={formData.status} onChange={inputFunction} /> */}
            <button type="submit" className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white w-full">Submit</button>
        </form>
        </div>
        </div>
        <ul className="w-[40%] flex items-start flex-col">
            <h2 className="font-semibold text-lg mb-3">Projects :</h2>
            {projects.length > 0?(
                projects.map((data)=>(
                    <li key={data._id} className={`flex items-center justify-between capitalize relative mb-2 w-full px-4 rounded-xl
                    ${data.status === "pending" && "bg-red-100/50"}
                    ${data.status === "in-progress" && "bg-yellow-100/50"}
                    ${data.status === "completed" && "bg-green-100/50"}`}>
                    {edit === data._id?
                    (<div className="flex items-center justify-between my-2 w-full">
                    <input className="rounded-xl h-10 mb-1 capitalize w-96 ps-2" value={editname} onChange={(e)=> setEditName(e.target.value)} />
                    <button className="my-4 rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white" onClick={()=>setEdit(null)}>Cancel</button>
                    <button className="my-4 rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white" onClick={()=>handleSave(data._id)}>Save</button>
                    </div>):
                    (<><div className="text-sm font-medium flex items-center gap-x-3">
                    <p className="text-base font-semibold">{data.name}</p>
                    </div>
                    <div className="flex items-center gap-x-4">
                    {user?.role === 'admin'? (<Link title="view tasks" to={`/admin/users/${userId}/projects/${data._id}/tasks`} className="flex items-center font-medium text-sm">View Tasks<ViewListIcon className="text-blue-900 ml-1" /></Link>)
                    :(<Link title="view tasks" to={`tasks/${data._id}`} className="flex items-center font-medium text-sm">View Tasks<ViewListIcon className="text-blue-900 ml-1" /></Link>)}
                    <select className="rounded-xl h-10 mb-1 w-28 ps-2" value={data.status} onChange={(e)=> handlingStatus(data._id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white" title="Edit" onClick={()=> handleEdit(data)}><ModeEditOutlineIcon /></button>
                    <button className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white" title="Delete" onClick={()=> handleDelete(data._id)}><DeleteIcon /></button>
                    </div></>)
                    }<div className="absolute -right-10 top-5">{data.status === 'completed' && <OfflinePinIcon fontSize="large" className="text-green-800" />}
                    {data.status === 'in-progress' && <DonutLargeIcon fontSize="large" className="text-yellow-600" />}
                    {data.status === 'pending' && <WorkHistoryIcon fontSize="large" className="text-orange-800" />}</div>
                    </li>
                ))
            ):(
                    <p>No Project</p>
                )
            }
        </ul>
        </div>
    )
}

export default Projects;