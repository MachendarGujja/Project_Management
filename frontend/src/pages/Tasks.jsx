// import axios from 'axios';
import API from '../api/axios';
import {useState, useEffect, useCallback} from 'react';
import {authManage} from '../context/AuthContext';
import {Link, useParams} from 'react-router-dom'
import DeleteIcon  from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const {projectId, userId} = useParams();
    const {token,user} = authManage();
    const [projectName, setProjectName] = useState("");
    const [taskData, setTaskData] = useState({
        title : "",
        description : "",
        status : "todo"
    })
    const [edit, setEdit] = useState(null);
    const [taskValue, setTaskValue] = useState("");
    // const [statusValue, setStatusValue] = useState("");

    // const projectNameFunction = async() => {
    //     try {
    //     const res = await axios.get(`http://localhost:4000/api/projects/${projectId}`,{
    //         headers : {
    //             Authorization : `Bearer ${token}`
    //         }
    //     });
    //     setProjectName(res.data);
    //     // console.log("proj",res.data)
    // }
    // catch(err) {
    //     console.log(err.message);
    // }
    // }

    const fetchTasks = useCallback(async() => {
        try {
           const res = await API.get(`/tasks/${projectId}`,{
            headers : {
                Authorization : `Bearer ${token}`
            }
           });
           setTasks(res.data.tasks);
           setProjectName(res.data.projectData);
        //    console.log(res.data)
        }
        catch(err) {
            console.log(err.message);
        }
    },[projectId,token]);

    const handleEditValues = (e) => {
        // console.log(e.target.value)
        setTaskData({...taskData, [e.target.name] : e.target.value});
        // console.log(taskData);
    }

    const TaskSubmitFunction = async(e) => {
        e.preventDefault();
        if(taskData.title === '' || taskData.description === ''){
            alert("Enter Details of task");
            return;
        }
        try {
        const res = await API.post(`/tasks/${projectId}`,{
            title : taskData.title,
            description : taskData.description,
            status : taskData.status
        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=> [...prev, res.data]);
        alert("task created successfully");
        setTaskData({
            title:"",
            description:"",
            status:"todo"
        })
    }
    catch(err) {
        console.log(err.message);
    }
    }

    const handleEditFun = (data) => {
        setEdit(data._id);
        setTaskValue(data.title);
        // console.log("edit",data);
    }

    const submitTaskFun = async() => {
        // console.log(taskValue);
        try {
        const res = await API.put(`/tasks/${edit}`,{
            title : taskValue
        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=>prev.map((e)=>e._id === edit ? res.data:e));
        setEdit(null);
    }
    catch(err) {
        console.log(err.message);
    }
    }

    const handleStatus = async(v,id) => {
        // console.log(v);
        // setStatusValue(e.target.value);
        const res = await API.put(`/tasks/${id}`,{
            status : v
        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=>prev.map((d)=>d._id === id ? res.data:d));
    }

    const handleDeleteFun = async(id) => {
        const res = await API.delete(`/tasks/${id}`,{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=>prev.filter((d)=>d._id !== id));
    }

    useEffect(()=>{
        if(projectId && token){
        fetchTasks();
        // projectNameFunction();
        }
        // console.log("Project ID:", projectId);
    },[fetchTasks])

    return (
            <div className="h-screen w-full p-10 bg-gray-300 flex items-start justify-around">
            <div className="h-full w-[40%] flex items-center">
            <div className="flex flex-col relative w-full items-start p-20 pt-28 bg-gray-400 rounded-xl">
            {user?.role === "admin"?(<Link to={`/admin/users/${userId}/projects/`} className="my-4 absolute top-1 left-4 flex items-center justify-center rounded-xl h-10 px-2" title="Back"><ArrowBackIosIcon />Back</Link>):
            (<Link to="/" className="my-4 absolute top-1 left-4 flex items-center justify-center rounded-xl h-10 px-2" title="Back"><ArrowBackIosIcon />Back</Link>)}
            <h2 className="font-semibold text-lg mb-3">Create New Task :</h2>
            <form onSubmit={TaskSubmitFunction} className="flex flex-col w-full">
                <label htmlFor="title" className="mb-1 text-black">Task Title</label>
                <input name="title" onChange={handleEditValues} value={taskData.title} placeholder="Enter Task Title" className="rounded-xl h-10 mb-1 w-full ps-2" />
                <label htmlFor="description" className="mb-1 text-black">Task Description</label>
                <input name="description" onChange={handleEditValues} value={taskData.description} placeholder="Enter Task Description" className="rounded-xl h-10 mb-1 w-full ps-2" />
                <label htmlFor="status" className="mb-1 text-black">Task Status</label>
                <select name="status" onChange={handleEditValues} value={taskData.status} className="rounded-xl h-10 mb-1 w-full ps-2">
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                {/* <input name="status" className="rounded-xl h-10 mb-1 w-full ps-2" value={formData.status} onChange={inputFunction} /> */}
                <button type="submit" className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white w-full">Submit</button>
            </form>
            </div>
            </div>
            <ul className="w-[40%] flex items-start flex-col">
                <h2 className="font-semibold text-lg mb-3 capitalize">{`${projectName?.name} Tasks :`}</h2>
                {tasks.length > 0?(
                    tasks.map((data)=>(
                        <li key={data._id} className={`flex items-center justify-between capitalize relative mb-2 w-full px-4 rounded-xl
                        ${data.status === "todo" && "bg-red-100/50"}
                        ${data.status === "in-progress" && "bg-yellow-100/50"}
                        ${data.status === "done" && "bg-green-100/50"}`}>
                        {edit === data._id?
                        (<div className="flex items-center justify-between my-2 w-full">
                        <input className="rounded-xl h-10 mb-1 capitalize w-96 ps-2" value={taskValue} onChange={(e)=>setTaskValue(e.target.value)} />
                        <button className="my-4 rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white" onClick={()=>setEdit(null)}>Cancel</button>
                        <button className="my-4 rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white" onClick={()=>submitTaskFun()}>Save</button>
                        </div>):
                        (<><div className="text-sm font-medium flex items-center gap-x-3">
                        <p className="text-base font-semibold">{data.title}</p>
                        </div>
                        <div className="flex items-center gap-x-4">
                        <select onChange={(e)=>handleStatus(e.target.value,data._id)} value={data.status} className="rounded-xl h-10 mb-1 w-28 ps-2">
                            <option value="todo">Todo</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                        <button className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white" onClick={()=>handleEditFun(data)} title="Edit"><ModeEditOutlineIcon /></button>
                        <button className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white" title="Delete" onClick={()=>handleDeleteFun(data._id)}><DeleteIcon /></button>
                        </div></>)
                        }<div className="absolute -right-10 top-5">{data.status === 'done' && <OfflinePinIcon fontSize="large" className="text-green-800" />}
                        {data.status === 'in-progress' && <DonutLargeIcon fontSize="large" className="text-yellow-600" />}
                        {data.status === 'todo' && <WorkHistoryIcon fontSize="large" className="text-orange-800" />}</div>
                        </li>
                    ))
                ):(
                        <p>No Tasks</p>
                    )
                }
            </ul>
            </div>
        )
}
export default Tasks;