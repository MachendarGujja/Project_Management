import axios from 'axios';
import {useState,useEffect,useCallback} from 'react';
import {authManage} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PieChart } from '@mui/x-charts/PieChart';

const adminDashboard = () => {
    const [userlist, setUserlist] = useState([]);
    const [projectsCount, setProjectsCount] = useState([]);
    const [tasksCount, setTasksCount] = useState([]);
    const {token,user,logoutFn} = authManage();
    const completed = projectsCount.filter(p => p.status === "completed").length;
    const pending = projectsCount.filter(p => p.status === "pending").length;
    const inProgress = projectsCount.filter(p => p.status === "in-progress").length;
    const completedTask = tasksCount.filter(p => p.status === "done").length;
    const pendingTask = tasksCount.filter(p => p.status === "todo").length;
    const inProgressTask = tasksCount.filter(p => p.status === "in-progress").length;

    const settings = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    hideLegend: true,
    };
    const api = axios.create({
        baseURL : "http://localhost:4000/api"
    });

    const fetchUsers = useCallback(async()=>{
        const res = await api.get("/admin/users",{
            headers : {
                Authorization : `Bearer ${token}`
            }
        });
        setUserlist(res.data.users);
        setProjectsCount(res.data.projects);
        setTasksCount(res.data.tasks);
        // console.log(res.data);
    },[token])

    useEffect(()=> {
        fetchUsers();
    },[fetchUsers])

    return (
        <div className="h-screen w-screen flex items-start gap-x-10">
        <div className="w-[50%] p-6 py-10 bg-gray-100 h-full">
        <div className="flex items-center justify-between w-full mb-4">
        <h2 className="font-bold text-lg mb-4">Welcome Admin : {user?.name.split(" ")[0]}</h2>
        <button className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white" title="Logout" onClick={logoutFn}><LogoutIcon /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-solid border-gray-300 p-3 rounded-xl">
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
            <div className="border-2 border-solid border-gray-300 p-3 rounded-xl">
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
        <h2 className="font-bold text-lg mb-4">Active Users :</h2>
        {userlist.length === 0?
        (<div className="font-semibold text-lg text-center">No Users</div>):
        (<>{userlist.map((data) => 
        <div key={data._id} className="text-sm w-[95%] font-medium flex items-center justify-between gap-x-3 my-3 h-16 bg-green-200 p-3 rounded-xl">
            <p className="text-base font-semibold capitalize ps-4">{data.name}</p>
            <Link to={`/admin/users/${data._id}/projects`} className="p-1.5"><ArrowForwardIosIcon className="text-gray-700" /></Link>
        </div>
        )}</>)
        }
        </div>
        </div>
    )
}

export default adminDashboard;