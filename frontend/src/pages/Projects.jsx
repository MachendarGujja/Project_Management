import { authManage } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import OfflinePinIcon from "@mui/icons-material/OfflinePin";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import ViewListIcon from "@mui/icons-material/ViewList";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from '@mui/icons-material/Close';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Projects = () => {
  const { token, user, logoutFn } = authManage();
  const { userId } = useParams();

  const [editname, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("pending");
  const [edit, setEdit] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pending",
  });

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const filterRef = useRef();

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const inputFunction = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const url =
        user?.role === "admin" ? `/projects/${userId}` : "/projects";

      const res = await API.get(url, authHeader);
      setProjects(res.data);
      setFilteredProjects(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const submitFunction = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Enter Project Name");
      return;
    }

    try {
      setLoading(true);
      const payload =
        user?.role === "admin"
          ? { ...formData, owner: userId }
          : { ...formData };

      const res = await API.post("/projects", payload, authHeader);

      const updatedProjects = [res.data, ...projects];
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);

      setFormData({
        name: "",
        description: "",
        status: "pending",
      });

      toast.success("Project Created");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create project");
      console.log(err.response?.data || err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleEdit = (data) => {
    setEdit(data._id);
    setEditName(data.name || "");
    setEditDescription(data.description || "");
    setEditStatus(data.status || "pending");
  };

  const handleSave = async (id) => {
    if (!editname.trim()) {
      toast.error("Enter Project Name");
      return;
    }

    try {
      setLoading(true);
      const res = await API.put(
        `/projects/${id}`,
        {
          name: editname,
          description: editDescription,
          status: editStatus,
        },
        authHeader
      );

      const updatedProjects = projects.map((p) =>
        p._id === id ? res.data : p
      );

      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setEdit(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update project");
      console.log(err.response?.data || err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/projects/${id}`, authHeader);

      const updatedProjects = projects.filter((p) => p._id !== id);
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);

      toast.success("Project deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
      console.log(err.response?.data || err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handlingStatus = async (id, value) => {
    try {
      setLoading(true);
      const res = await API.put(
        `/projects/${id}`,
        { status: value },
        authHeader
      );

      const updatedProjects = projects.map((p) =>
        p._id === id ? res.data : p
      );

      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      console.log(err.response?.data || err.message);
    }
    finally {
      setLoading(false);
    }
  };

  // const searchFunction = () => {
  //   if (search.trim() === "") {
  //     setFilteredProjects(projects);
  //     return;
  //   }

  //   const result = projects.filter((project) =>
  //     project.name.toLowerCase().includes(search.toLowerCase())
  //   );

  //   setFilteredProjects(result);
  // };

    const applySearchAndFilter = (searchValue, statusValues) => {
    let data = [...projects];

    // Search
    if (searchValue.trim() !== "") {
      data = data.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Status Filter
    if (statusValues.length > 0) {
      data = data.filter((project) =>
        statusValues.includes(project.status)
      );
    }

      setFilteredProjects(data);
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
    setFilteredProjects(projects);
  }

  useEffect(() => {
    if (token && user) {
      fetchProjects();
    }
  }, [token, user, userId]);

  return (
    <div className="h-screen w-full pt-20 bg-white flex gap-x-32">
      <div className="h-full w-[40%] bg-gray-100 flex items-center relative">
        {user?.role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="my-4 absolute top-4 z-[1] left-4 flex items-center justify-center rounded-xl h-10 px-2"
              title="Back"
            >
              <ArrowBackIosIcon />
              Back
            </Link>
          )}
        <div className="flex flex-col relative w-full items-start p-20 pt-28">

          {/* <h2 className="absolute top-6 left-4 font-semibold text-lg capitalize">
            Welcome {user?.name}
          </h2> */}

          {/* {user?.role === "user" && (
            <button
              className="my-4 absolute top-1 right-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white"
              title="Logout"
              onClick={logoutFn}
            >
              <LogoutIcon />
            </button>
          )} */}

          <h2 className="font-semibold text-lg mb-3">Create New Project :</h2>

          <form onSubmit={submitFunction} className="flex flex-col w-full">
            <label htmlFor="name" className="mb-1 text-black">
              Project Name
            </label>
            <input
              name="name"
              placeholder="Enter Project Name"
              className="rounded-xl h-10 mb-1 w-full ps-2 border border-solid border-gray-400"
              value={formData.name}
              onChange={inputFunction}
            />

            <label htmlFor="description" className="mb-1 text-black">
              Project Description
            </label>
            <input
              name="description"
              placeholder="Enter Project Description"
              className="rounded-xl h-10 mb-1 w-full ps-2 border border-solid border-gray-400"
              value={formData.description}
              onChange={inputFunction}
            />

            <label htmlFor="status" className="mb-1 text-black">
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

            <button
              type="submit"
              className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      
      <div className="w-[45%] flex items-center pt-6 h-full flex-col">
        <div className="flex items-center justify-between w-full mb-4 pe-8">
          <h2 className="font-semibold text-lg mb-3">Projects :</h2>

          <div className="flex items-center gap-x-3">
            <div className="relative">
              <input
                className="rounded-xl h-10 capitalize w-72 ps-2 pe-16 border border-solid border-gray-400"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    if(value.trim() === "") {
                        // setFilteredProjects(projects);
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
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border border-solid border-gray-200 rounded-xl p-4 z-50">
                <h3 className="font-semibold mb-2">Filter Status</h3>
                
                <FormGroup>
                {["pending", "in-progress", "completed"].map((status) => (
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
        (filteredProjects.length > 0 ? (
          filteredProjects.map((data) => (
            <li
              key={data._id}
              className={`flex items-center justify-between capitalize border border-solid border-gray-200 shadow-md relative mb-4 w-full px-4 rounded-xl
              ${data.status === "pending" && "bg-red-100/50"}
              ${data.status === "in-progress" && "bg-yellow-100/50"}
              ${data.status === "completed" && "bg-green-100/50"}`}
            >
              {edit === data._id ? (
                <div className="flex flex-col gap-2 my-3 w-full">
                  <input
                    className="rounded-xl h-10 capitalize w-full ps-2 border border-solid border-gray-300"
                    value={editname}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Project name"
                  />

                  <input
                    className="rounded-xl h-10 w-full ps-2 border border-solid border-gray-300"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Project description"
                  />

                  <select
                    className="rounded-xl h-10 w-full ps-2 border border-solid border-gray-300"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <div className="flex gap-2 justify-end">
                    <button
                      className="rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white"
                      onClick={() => setEdit(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-xl h-10 px-3 bg-gray-800 hover:bg-gray-700 text-white"
                      onClick={() => handleSave(data._id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm font-medium flex items-center gap-x-3">
                    <div>
                      <p className="text-base font-semibold line-clamp-1 w-[220px]">{data.name}</p>
                      <p className="text-xs normal-case text-gray-700 line-clamp-1 w-[220px]">
                        {data.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-4">
                    {user?.role === "admin" ? (
                      <Link
                        title="view tasks"
                        to={`/admin/users/${userId}/projects/${data._id}/tasks`}
                        className="flex items-center font-medium text-sm"
                      >
                        View Tasks
                        <ViewListIcon className="text-blue-900 ml-1" />
                      </Link>
                    ) : (
                      <Link
                        title="view tasks"
                        to={`tasks/${data._id}`}
                        className="flex items-center font-medium text-sm"
                      >
                        View Tasks
                        <ViewListIcon className="text-blue-900 ml-1" />
                      </Link>
                    )}

                    <select
                      className="rounded-xl h-10 mb-1 w-28 ps-2 border border-solid border-gray-300"
                      value={data.status}
                      onChange={(e) =>
                        handlingStatus(data._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white"
                      title="Edit"
                      onClick={() => handleEdit(data)}
                    >
                      <ModeEditOutlineIcon />
                    </button>

                    <button
                      className="my-4 rounded-xl h-10 px-2 bg-gray-800 hover:bg-gray-700 text-white"
                      title="Delete"
                      onClick={() => handleDelete(data._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </>
              )}

              <div className="absolute -right-10 top-5">
                {data.status === "completed" && (
                  <OfflinePinIcon fontSize="large" className="text-green-800" />
                )}
                {data.status === "in-progress" && (
                  <DonutLargeIcon
                    fontSize="large"
                    className="text-yellow-600"
                  />
                )}
                {data.status === "pending" && (
                  <WorkHistoryIcon
                    fontSize="large"
                    className="text-orange-800"
                  />
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-xl text-gray-500">No Projects Found</p>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Projects;