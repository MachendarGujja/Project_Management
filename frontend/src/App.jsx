import './App.css'
import Projects from './pages/Projects';
import AdminDashboard from './pages/adminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tasks from './pages/Tasks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'; 
import ProtectedRoutes from './components/ProtectedRoutes';
import AdminRoute from './components/AdminRoute';

function App() {
  
  return (
    <BrowserRouter>
      <Toaster position="top-center" 
      toastOptions={{
      duration: 3000,
      style: {
        background: "#1e2944ff",
        color: "#fff",
        borderRadius: "10px",
        padding: "12px 16px",
        minWidth: "400px",
        minHeight: "40px"
      }
  }}/>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<ProtectedRoutes><Projects /></ProtectedRoutes>} />
        <Route path="/tasks/:projectId" element={<ProtectedRoutes><Tasks /></ProtectedRoutes>} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users/:userId/projects" element={<AdminRoute><Projects /></AdminRoute>} />
        <Route path="/admin/users/:userId/projects/:projectId/tasks" element={<AdminRoute><Tasks /></AdminRoute>} />
       
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
