import {authManage} from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
const Header = () => {
    const {user, logoutFn} = authManage();
    return (
        <div className="fixed top-0 w-full h-20 z-10 bg-[#e9f1f8] text-[#000] shadow-lg flex justify-between items-center">
        <div className="flex items-center justify-between w-full px-4">
            <p className="font-bold text-xl">Project Management</p>
            <div className="flex items-center gap-x-4">
            <p className="capitalize font-semibold">Welcome {user&&user.name.split(" ")[0]} [{user&&user.role}]</p>
            <button onClick={()=>logoutFn()} className="font-semibold flex items-center gap-x-2 bg-red-600 hover:bg-red-500 rounded-lg p-1.5 px-2 text-white">
                <p className="pb-0.5">Logout</p>
                <LogoutIcon className="!text-[18px]" />
            </button>
        </div>
        </div>
        </div>
    )
}

export default Header;