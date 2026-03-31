// import axios from 'axios';
import API from '../api/axios';
import {useState,useEffect,useCallback} from 'react';
import {authManage} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PieChart } from '@mui/x-charts/PieChart';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import toast from 'react-hot-toast';

const adminDashboard = () => {
    const [userlist, setUserlist] = useState([]);
    const [projectsCount, setProjectsCount] = useState([]);
    const [tasksCount, setTasksCount] = useState([]);
    const {token,user,logoutFn} = authManage();
    const [loading, setLoading] = useState(false);
    const [loadingPop, setLoadingPop] = useState(false);
    const [open, setOpen] = useState(false);
    const completed = projectsCount.filter(p => p.status === "completed").length;
    const pending = projectsCount.filter(p => p.status === "pending").length;
    const inProgress = projectsCount.filter(p => p.status === "in-progress").length;
    const completedTask = tasksCount.filter(p => p.status === "done").length;
    const pendingTask = tasksCount.filter(p => p.status === "todo").length;
    const inProgressTask = tasksCount.filter(p => p.status === "in-progress").length;
    const [formData, setFormdata] = useState({
        name : "",
        description : "",
        status : "pending",
        assignTo : ""
    });

    const inputFunction = (e) => {
        // console.log(e.target.name)
        setFormdata({...formData, [e.target.name] : e.target.value});
    }

    const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: true,
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: '#e9f1f8',
        border: '1px solid #7c7c7cff',
        borderRadius: '10px',
        boxShadow: 24,
        p: 3,
    };
    // const api = axios.create({
    //     baseURL : "http://localhost:4000/api"
    // });

    const fetchUsers = useCallback(async()=>{
        try {
        setLoading(true);
        const res = await API.get("/admin/users",{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setUserlist(res.data.users);
        setProjectsCount(res.data.projects);
        setTasksCount(res.data.tasks);
        // console.log(res.data);
        }
        catch(err) {
        console.log(err.message);
    }
    finally {
            setLoading(false);
        }
    },[token]);

    const createProjectFun = async(e) => {
        e.preventDefault();
        // console.log(formData);
        if(formData.name === '' && formData.description === '' && formData.assignTo === '') {
            toast.error("Fil details");
        }
        try {
            setLoadingPop(true);
            const payload = 
            user?.role === "admin"? {...formData, owner : formData.assignTo} : {...formData};
            await API.post('/projects', payload, {
                headers : {
                    Authorization : `Bearer ${token}`
                } 
            })
            setOpen(false);
            setFormdata({name : "",
                description : "",
                status : "pending",
                assignTo : ""});
            
            toast.success("Project Created Successfully");
        }
        catch(err) {
            console.log(err.message);
        }
        finally {
            setLoadingPop(false);
        }
    }

    useEffect(()=> {
        fetchUsers();
    },[fetchUsers])

    return (
        <div className="h-screen pt-20 w-screen flex items-start gap-x-10">
        <div className="w-[50%] p-6 py-10 bg-[#F1F5F9] h-full">
        <div className="flex items-center justify-between w-full mb-4">
        <h2 className="font-bold text-lg mb-4">Productivity Insights</h2>
        {/* <button className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white" title="Logout" onClick={logoutFn}><LogoutIcon /></button> */}
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="border border-solid border-gray-400/50 p-3 rounded-xl">
                <h3 className="font-semibold text-base mb-3">Total Projects Completed : {projectsCount.filter((s)=>s.status === "completed").length}/{projectsCount.length}</h3>
                <PieChart
                series={[
                    {
                    data: [
                        { id: 0, value: completed, label: 'Completed' },
                        { id: 1, value: pending, label: 'Pending' },
                        { id: 2, value: inProgress, label: 'InProgress' },
                    ],
                    },
                ]}
                width={200}
                height={200}
                />
            </div>
            <div className="border border-solid border-gray-400/50 p-3 rounded-xl">
                <h3 className="font-semibold text-base mb-3">Total Tasks Completed : {tasksCount.filter((s)=>s.status === 'done').length}/{tasksCount.length}</h3>
                 <PieChart
                series={[{ innerRadius: 50, outerRadius: 100, data : [
                { label: 'Done', value: completedTask, color: '#0088FE' },
                { label: 'Pending', value: pendingTask, color: '#00C49F' },
                { label: 'Todo', value: inProgressTask, color: '#FFBB28' },
                ], arcLabel: 'value' }]}
                {...settings}
                />
            </div>
        </div>
        </div>
        <div className="w-[50%] p-6 py-10">
        <div className="flex items-center justify-between w-[90%]">
        <h2 className="font-bold text-lg">Active Users :</h2>
        <div>
        <button className="my-4 rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white ps-3.5" onClick={()=>setOpen(true)}>New Project <AddIcon className="!text-2xl mb-0.5" /></button>
        <Modal
            open={open}
            onClose={()=>setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <h2 className="font-semibold text-lg mb-3">Create New Project :</h2>
            {loadingPop?
            (<div className="flex justify-center items-center h-96 w-full">
            <div className="h-10 w-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
            </div>
            ):(
          <form onSubmit={createProjectFun}  className="flex flex-col w-full">
            <label htmlFor="name" className="mb-1 text-black font-medium">
              Project Name
            </label>
            <input
              name="name"
              placeholder="Enter Project Name"
              className="rounded-xl h-10 mb-1 w-full ps-2 border border-solid border-gray-400"
              value={formData.name}
              onChange={inputFunction}
            />

            <label htmlFor="description" className="mb-1 text-black font-medium">
              Project Description
            </label>
            <input
              name="description"
              placeholder="Enter Project Description"
              className="rounded-xl h-10 mb-1 w-full ps-2 border border-solid border-gray-400"
              value={formData.description}
              onChange={inputFunction}
            />

            <label htmlFor="status" className="mb-1 text-black font-medium">
              Project Status
            </label>
            <select
              name="status"
              className="rounded-xl h-10 mb-1 w-full ps-2 border border-solid border-gray-400"
              value={formData.status}
              onChange={inputFunction}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <label htmlFor="assignTo" className="mb-1 text-black font-medium">
              Assign To
            </label>
            <select
              name="assignTo"
              className="rounded-xl h-10 mb-1 w-full ps-2 border border-solid border-gray-400"
              value={formData.assignTo}
              onChange={inputFunction}
            >
            <option value="">Select User</option>
              {userlist && userlist.map((user) =>
                <option key={user._id} value={user._id}>{user.name}</option>
                )}
            </select>
            <div className="flex items-center justify-between gap-x-2">
            <button
              type="submit"
              className="mt-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white w-full"
            >
              Submit
            </button>
            <button
              type="button" onClick={()=>setOpen(false)}
              className="mt-4 rounded-xl h-10 px-2 border border-solid border-gray-800 hover:bg-gray-700 hover:text-white font-semibold text-gray-800 w-full"
            >
              Cancel
            </button>
            </div>
          </form>)}
        </Box>
        </Modal>
        </div>
        </div>
        {loading?
        (<div className="flex justify-center items-center h-96 w-full">
        <div className="h-10 w-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
        </div>
        ):
        (userlist.length === 0?
        (<div className="font-semibold text-lg text-center">No Users</div>):
        (<>{userlist.map((data) => 
        <div key={data._id} className="text-sm mt-3 mb-4 h-16 bg-[#dbe6f0] hover:bg-[#d2e0ed] p-2 w-[90%] rounded-xl flex items-center justify-between">
            <Link to={`/admin/users/${data._id}/projects`} className="p-1.5 font-medium w-full flex items-center justify-between gap-x-3">
            <p className="text-base font-semibold capitalize ps-4">{data.name}</p>
            <ArrowForwardIosIcon className="text-gray-700" />
            </Link>
        </div>
        )}</>)
        )}
        </div>
        </div>
    )
}

export default adminDashboard;