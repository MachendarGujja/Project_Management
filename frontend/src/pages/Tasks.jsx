// import axios from 'axios';
import API from '../api/axios';
import {useState, useEffect, useCallback, useRef} from 'react';
import {authManage} from '../context/AuthContext';
import {Link, useParams} from 'react-router-dom';
import toast from "react-hot-toast";
import DeleteIcon  from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from '@mui/icons-material/Close';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const {projectId, userId} = useParams();
    const {token,user} = authManage();
    const [projectName, setProjectName] = useState("");
    const [taskData, setTaskData] = useState({
        title : "",
        description : "",
        status : "todo",
        deadline : ""
    })
    const [edit, setEdit] = useState(null);
    const [taskValue, setTaskValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [statusFilter, setStatusFilter] = useState([]);
    const [notifiedTasks, setNotifiedTasks] = useState([]);
    const filterRef = useRef();
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
            setLoading(true);
           const res = await API.get(`/tasks/${projectId}`,{
            headers : {
                Authorization : `Bearer ${token}`
            }
           });
           setTasks(res.data.tasks);
           setFilteredTasks(res.data.tasks);
           setProjectName(res.data.projectData);
        //    console.log(res.data)
        }
        catch(err) {
            console.log(err.message);
        }
        finally {
            setLoading(false);
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
            toast.error("Enter Details of task");
            return;
        }
        try {
        setLoading(true);
        // console.log(taskData);
        const res = await API.post(`/tasks/${projectId}`,{
            title : taskData.title,
            description : taskData.description,
            status : taskData.status,
            deadline : taskData.deadline ? new Date(taskData.deadline) : null
        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=> [...prev, res.data]);
        setFilteredTasks((prev)=> [...prev, res.data]);
        // console.log(tasks.deadline);
        toast.success("task created successfully");
        setTaskData({
            title:"",
            description:"",
            status:"todo",
            deadline: ""
        })
    }
    catch(err) {
        console.log(err.message);
    }
    finally {
            setLoading(false);
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
        setLoading(true);
        const res = await API.put(`/tasks/${edit}`,{
            title : taskValue
        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=>prev.map((e)=>e._id === edit ? res.data:e));
        setFilteredTasks((prev)=>prev.map((e)=>e._id === edit ? res.data:e));
        setEdit(null);
    }
    catch(err) {
        console.log(err.message);
    }
    finally {
            setLoading(false);
        }
    }

    const handleStatus = async(v,id) => {
        // console.log(v);
        // setStatusValue(e.target.value);
        try {
        setLoading(true);
        const res = await API.put(`/tasks/${id}`,{
            status : v
        },{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=>prev.map((d)=>d._id === id ? res.data:d));
        setFilteredTasks((prev)=>prev.map((d)=>d._id === id ? res.data:d));
    }
    catch(err) {
        console.log(err.message);
    }
    finally {
            setLoading(false);
        }
    }

    const handleDeleteFun = async(id) => {
        try {
        setLoading(true);
        const res = await API.delete(`/tasks/${id}`,{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setTasks((prev)=>prev.filter((d)=>d._id !== id));
        setFilteredTasks((prev)=>prev.filter((d)=>d._id !== id));
        }
        catch(err) {
        console.log(err.message);
    }
    finally {
            setLoading(false);
        }
    }

    const applySearchAndFilter = (searchValue, statusValues) => {
    let data = [...tasks];
    // console.log(data);

    // Search
    if (searchValue.trim() !== "") {
      data = data.filter((task) =>
        task.title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Status Filter
    if (statusValues.length > 0) {
      data = data.filter((task) =>
        statusValues.includes(task.status)
      );
    }

      setFilteredTasks(data);
    };

    const toggleStatusFilter = (status) => {
      setStatusFilter((prev) => {
        const exists = prev.includes(status);
        const updated = exists
          ? prev.filter((s) => s !== status)
          : [...prev, status];

        applySearchAndFilter(search, updated);
        return updated;
      });
    };

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
        ) {
        setShowFilter(false); // 👈 close dropdown
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

    const clearFunction = () => {
        setSearch("");
        setFilteredTasks(tasks);
    }

    useEffect(()=>{
        if(!tasks.length) return;

        const interval = setInterval(()=>{
            const now = new Date();
            tasks.forEach((task)=>{
                if(task.deadline) {
                    // console.log(task.title)
                    const deadline = new Date(task.deadline);
                    const diff = deadline - now;

                    if(diff > 0 && diff < 3 * 60 * 1000 && !notifiedTasks.includes(task._id)) {
                        // console.log("deadline")
                        toast.error(`${task.title} deadline soon!`);
                        setNotifiedTasks((prev)=>[...prev, task._id]);
                    }
                }
            })
            // console.log(new Date());
        },60000);
        return () => clearInterval(interval);
    },[tasks]);

    useEffect(()=>{
        if(projectId && token){
        fetchTasks();
        // projectNameFunction();
        }
        // console.log(tasks);
        // console.log("Project ID:", projectId);
    },[fetchTasks])

    return (
            <div className="h-screen w-full pt-20 bg-gray-300 flex gap-x-32">
            <div className="h-full w-[40%] bg-gray-400 flex items-center">
            <div className="flex flex-col relative w-full items-start p-20 pt-28">
            {user?.role === "admin"?(<Link to={`/admin/users/${userId}/projects/`} className="my-4 absolute top-1 left-4 flex items-center justify-center rounded-xl h-10 px-2" title="Back"><ArrowBackIosIcon />Back</Link>):
            (<Link to="/" className="my-4 absolute top-1 left-4 flex items-center justify-center rounded-xl h-10 px-2" title="Back"><ArrowBackIosIcon />Back</Link>)}
            <h2 className="font-semibold text-lg mb-3">Create New Task :</h2>
            <form onSubmit={TaskSubmitFunction} className="flex flex-col w-full">
                <label htmlFor="title" className="mb-1 text-black">Task Title</label>
                <input name="title" onChange={handleEditValues} value={taskData.title} placeholder="Enter Task Title" className="rounded-xl h-10 mb-1 w-full ps-2" />
                <label htmlFor="description" className="mb-1 text-black">Task Description</label>
                <input name="description" onChange={handleEditValues} value={taskData.description} placeholder="Enter Task Description" className="rounded-xl h-10 mb-1 w-full ps-2" />
                <label htmlFor="status" className="mb-1 text-black">Task Status</label>
                <select name="status" onChange={handleEditValues} value={taskData.status} className="rounded-xl h-10 mb-1 w-full ps-2 pe-2">
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <label htmlFor="deadline" className="mb-1 text-black">Select Deadline (Optional)</label>
                <input name="deadline" onChange={handleEditValues} value={taskData.deadline} type="datetime-local" placeholder="Select Deadline" className="rounded-xl h-10 mb-1 w-full ps-2 pe-2" />
                <button type="submit" className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white w-full">Submit</button>
            </form>
            </div>
            </div>
            <div className="w-[45%] flex items-center flex-col pt-6 h-full">
                <div className="flex items-center justify-between w-full mb-4">
                <h2 className="font-semibold text-lg mb-3 capitalize">{`${projectName?.name} Tasks :`}</h2>
                <div className="flex items-center gap-x-3">
                <div className="relative">
                <input
                    className="rounded-xl h-10 capitalize w-72 ps-2 pe-16"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        if(value.trim() === "") {
                            applySearchAndFilter(value, statusFilter);
                        }
                    }
                    }
                    onKeyDown={(e)=> {
                        if(e.key === "Enter"){
                        applySearchAndFilter(search, statusFilter);
                        }
                    }
                    }
                />
                {
                    search.trim() !== "" &&
                    <button
                    type="button"
                    className="absolute top-1 right-12 rounded-xl h-8 px-3 text-gray-800 hover:text-red-600"
                    onClick={clearFunction} title="Clear"
                >
                    <CloseIcon></CloseIcon>
                </button>
                }
                    <button
                    type="button"
                    className="absolute top-1 right-1 rounded-xl h-8 px-3 bg-gray-800 hover:bg-gray-700 text-white"
                    // onClick={searchFunction}
                    onClick={() => applySearchAndFilter(search, statusFilter)}
                >
                    <SearchIcon />
                </button>
                </div>

                {/* <button  className="rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white">
                <FilterListIcon />
                </button> */}
                <div className="relative" ref={filterRef}>
                <button
                onClick={() => setShowFilter(!showFilter)}
                className="rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white"
                >
                <FilterListIcon />
                </button>

                {showFilter && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl p-4 z-50">
                    <h3 className="font-semibold mb-2">Filter Status</h3>
                    
                    <FormGroup>
                    {["todo", "in-progress", "done"].map((status) => (
                    <FormControlLabel key={status} control={<Checkbox checked={statusFilter.includes(status)}
                        onChange={() => toggleStatusFilter(status)} />} label={status} />
                    ))}
                    </FormGroup>

                    <button
                    onClick={() => {
                        setStatusFilter([]);
                        applySearchAndFilter(search, []);
                    }}
                    className="mt-2 w-full bg-gray-100 py-1 rounded-lg hover:bg-gray-200"
                    >
                    Clear Filter
                    </button>
                </div>
                )}
            </div>
                
            </div>
                </div>
            <ul className="w-full h-[calc(100dvh_-_180px)] overflow-hidden relative overflow-y-auto pe-16">
                {loading?
                (<div className="flex justify-center items-center h-96 w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-10 w-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                </div>
                ):
                (filteredTasks.length > 0?(
                    filteredTasks.map((data)=>(
                        <li key={data._id} className={`flex items-center justify-between capitalize relative mb-2 w-full px-4 py-2 rounded-xl
                        ${data.status === "todo" && "bg-red-100/50"}
                        ${data.status === "in-progress" && "bg-yellow-100/50"}
                        ${data.status === "done" && "bg-green-100/50"}`}>
                        <p className={data.deadline?"text-red-600 font-semibold text-[11px] normal-case text-gray-700 absolute top-[1px] right-2":"text-green-600 font-semibold text-xs normal-case text-gray-700 absolute top-1 right-2"}>
                        {(data.deadline && data.status !== "done") && "Deadline On " + new Date(data.deadline).toLocaleString()}
                        </p>
                        {edit === data._id?
                        (<div className="flex items-center justify-between my-2 w-full">
                        <input className="rounded-xl h-10 mb-1 capitalize w-96 ps-2" value={taskValue} onChange={(e)=>setTaskValue(e.target.value)} />
                        <button className="my-4 rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white" onClick={()=>setEdit(null)}>Cancel</button>
                        <button className="my-4 rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white" onClick={()=>submitTaskFun()}>Save</button>
                        </div>):
                        (<><div className="text-sm font-medium flex flex-col gap-x-3">
                        <p className="text-base font-semibold">{data.title}</p>
                        <p className="text-xs normal-case text-gray-700">
                        {data.description}
                        </p>
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
                        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-xl text-gray-500">No Tasks Found</p>
                    )
                )}
            </ul>
            </div>
            </div>
        )
}
export default Tasks;