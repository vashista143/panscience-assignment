import React, { useEffect, useState } from 'react';
import {useForm} from 'react-hook-form'
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
const HomePage = ({ authuser }) => {
  const [sortOption, setSortOption] = useState("");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showadduserform, setshowadduserform] = useState(false);
  const [usertasks,setusertasks]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [createtaskloading, setcreatetaskloading]=useState(false);
const [editForm, setEditForm] = useState({
  title: "",
  description: "",
  dueDate: "",
  priority: "",
  status: ""
});
 const [files, setFiles] = useState([]);
 const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  const MAX_FILES = 3;
  const MAX_FILE_SIZE_MB = 10;

  if (selectedFiles.length + files.length > MAX_FILES) {
    setFileError(`You can only upload up to ${MAX_FILES} files.`);
    return;
  }

  const oversizedFiles = selectedFiles.filter(
    (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
  );

  if (oversizedFiles.length > 0) {
    setFileError(`Each file must be less than ${MAX_FILE_SIZE_MB}MB.`);
    return;
  }
  setFileError("");
  setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
};
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };
const [editUserId, setEditUserId] = useState(null);
const [editUserData, setEditUserData] = useState({
  name: '',
  email: '',
  password: '',
  role: ''
});
useEffect(() => {
  let sorted = [...tasks.filter(task => task.assignedTo === authuser._id)];

  switch (sortOption) {
    case "dueDate":
      sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "priority":
      const priorityMap = { high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);
      break;
    case "status":
      const statusOrder = { pending: 1, "in-progress": 2, completed: 3 };
      sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      break;
    default:
      break;
  }

  setusertasks(sorted);
}, [sortOption, tasks, authuser]);
   const [isFormVisible, setFormVisible] = useState(false);
   const [openFormUserId, setOpenFormUserId] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
   const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };
  const toggleadminForm = (userId) => {
  if (openFormUserId === userId) {
    setOpenFormUserId(null); 
  } else {
    setOpenFormUserId(userId);
  }
};

const handleEditUser = (user) => {
  setEditUserId(user._id); 
  setEditUserData({
    name: user.name,
    email: user.email,
    password: '',  
    role: user.role,
  });
};

const handleUserEditSubmit = async (data) => {
  try {
    const res = await fetch(`https://panscience-assignment-nfvf.onrender.com/api/auth/updateuser/${editUserId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      console.log("User updated successfully");
      await getUsers();  
      reset();
      setEditUserId(null); 
    } else {
      console.log("Failed to update user");
    }
  } catch (err) {
    console.error("Error updating user:", err);
  }
};

const handleDeleteUser = async (user) => {
  try {
    const res = await fetch(`https://panscience-assignment-nfvf.onrender.com/api/auth/delete/${user._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      console.log("User deleted");
      await getUsers();
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleEdit = (task) => {
  setEditTaskId(task._id);
  setEditForm({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate.split("T")[0], 
    priority: task.priority,
    status: task.status
  });
};
const handleSave = async () => {
  try {
    const res = await fetch("https://panscience-assignment-nfvf.onrender.com/api/task/updatetask", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskid: editTaskId, ...editForm })
    });

    if (res.ok) {
      console.log("Task updated");
      setEditTaskId(null);
      await getTasks();
    }
  } catch (error) {
    console.log(error);
  }
};

  const handleDelete=async(task)=>{
    try{
      const res=await fetch("https://panscience-assignment-nfvf.onrender.com/api/task/deletetask",{
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskid: task._id })
      })
      if(res.ok){
        console.log("task deleted")
        await window.location.reload();
      }
    }catch(error){
      console.log(error)
    }
  }
  const addusersubmit=async (data)=>{
    console.log(data)
    try {
    const res = await fetch("https://panscience-assignment-nfvf.onrender.com/api/auth/adduser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newUser = await res.json();
      console.log("User added successfully", newUser);
      reset(); 
      setUsers(prevUsers => [...prevUsers, newUser.user]);
      setShowAddUserForm(false);
      
    } else {
      console.log("Failed to add user");
    }
  } catch (err) {
    console.error("Error adding user:", err);
  }
};
const onadminSubmit = (userId) => async (data) => {
  setcreatetaskloading(true);
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("priority", data.priority);
    formData.append("dueDate", data.dueDate);
    formData.append("assignedTo", userId);

    files.forEach((file) => {
      formData.append("files", file); // 👈 important: must match 'files' in multer
    });

    const res = await fetch("https://panscience-assignment-nfvf.onrender.com/api/task/addtask", {
      method: "POST",
      credentials: "include",
      body: formData, // no content-type header
    });

    if (res.ok) {
      console.log("Task created successfully");
      reset();
      getTasks();
      setcreatetaskloading(false);
      await window.location.reload();
    } else {
      const errorText = await res.text();
      console.error("Failed to create task:", errorText);
    }
  } catch (error) {
    console.error("Error creating task:", error);
  }
};


  const onSubmit = async (data) => {
    console.log(files)
    setcreatetaskloading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('priority', data.priority);
    formData.append('dueDate', data.dueDate);
    formData.append('assignedTo', authuser._id);
     files.forEach(file => {
      formData.append('files', file);  
    });
    console.log("add task started", formData)
    try {
      const res = await fetch("https://panscience-assignment-nfvf.onrender.com/api/task/addtask", {
        method: "POST",
        credentials: "include",
        body: formData, 
      });
      if(res.ok){
        console.log("print success")
        reset();
        toggleForm();
        setcreatetaskloading(false);
        await getTasks();
      }else {
        console.log("Error:", await res.text());
      }
    }catch(error){
      console.log("error to add task",error);
    }
  }
  const getUsers = async () => {
    try {
      const res = await fetch("https://panscience-assignment-nfvf.onrender.com/api/task/getusers", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data); 
      console.log(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const getTasks = async () => {
    try {
      const res = await fetch("https://panscience-assignment-nfvf.onrender.com/api/task/gettasks", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setTasks(data); 
      console.log(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    getTasks();
  }, []);

useEffect(() => {
  if (tasks.length > 0 && authuser?._id) {
    setusertasks(tasks.filter(task => task.assignedTo === authuser._id));
  } else {
    setusertasks([]);
  }
}, [tasks, authuser]);

  if (loading) {
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
    </div>
  </div>
</div>
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  if(createtaskloading){
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
    </div>
  </div>
</div>

}  
  if(authuser.role === "admin" ){
    return(
    <div>
    <div className='flex justify-between pt-1 pr-9'>
      <div
          onClick={() => setshowadduserform(!showadduserform)}
          className="w-fit h-[32px] ml-5 flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-1.5 cursor-pointer hover:shadow-sm "
        >
          <div className="text-sm font-medium text-gray-800">Add User</div>
        </div>
      <div
          onClick={() => setShowDetails(!showDetails)}
          className="w-fit h-[32px] flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-1.5 cursor-pointer hover:shadow-sm "
        >
          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
            {authuser.name[0].toUpperCase()}
          </div>
          <div className="text-sm font-medium text-gray-800">Hi, {authuser.name}</div>
        </div>
        </div>
      {showadduserform && (
  <div className="absolute left-0 right-0 mx-auto mt-2 w-[90%] sm:w-[60%] md:w-[40%] lg:w-[25%] border rounded-lg shadow-lg z-50 pb-4 pt-3 px-4 bg-white">
    <form onSubmit={handleSubmit(addusersubmit)}>
      <h3 className="text-md font-semibold mb-4 text-center">Add New User</h3>

      {/* Username */}
      <label className="block text-sm font-medium">Enter username</label>
      <input
        {...register("name", { required: "Username is required" })}
        className="w-full border border-gray-300 rounded-md px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        type="text"
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      {/* Email */}
      <label className="block text-sm font-medium mt-2">Enter Email</label>
      <input
        {...register("email", { required: "Email is required" })}
        className="w-full border border-gray-300 rounded-md px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        type="email"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      {/* Password */}
      <label className="block text-sm font-medium mt-2">Enter Password</label>
      <input
        {...register("password", { required: "Password is required" })}
        className="w-full border border-gray-300 rounded-md px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        type="password"
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      {/* Role */}
      <label className="block text-sm font-medium mt-2">Select Role</label>
      <select
        {...register("role", { required: "Role is required" })}
        className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">Select a role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

      {/* Submit */}
      <div className="flex justify-center">
        <input
          type="submit"
          className="bg-blue-500 text-white px-4 py-1.5 rounded-md mt-4 hover:bg-blue-600 transition duration-200"
        />
      </div>
    </form>
  </div>
)}


      {showDetails && (
                <div className="absolute right-0 mt-2 mr-2 bg-[#6363a0] text-white border rounded-lg shadow-lg w-fit z-50 pb-4 pt-3 px-4">
                  <h3 className="text-md font-semibold mb-2">Account Info</h3>
                  <p className="text-sm text-white">Name: {authuser.name}</p>
                  <p className="text-sm text-white">Role: {authuser.role}</p>
                  <p className="text-sm  text-white whitespace-nowrap overflow-hidden text-ellipsis">Email: {authuser.email}</p>
                </div>
              )}  
    <div>
      {users.map(user => {
  const userTasks = tasks.filter(task => task.assignedTo === user._id);

  return (
    <div key={user._id} className="mb-6">
      <div className="justify-center flex px-2 sm:px-4">
  <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] shadow-lg p-4 rounded-lg">
    
    {/* Top Container */}
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 items-start sm:items-center justify-between">
      
      {/* User Info */}
      <div className="flex flex-row sm:flex-col gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">{user.name}</h2>
        
        <div className="flex flex-col sm:flex-row sm:gap-10 text-xs sm:text-sm text-gray-800">
          <h2>Email: {user.email}</h2>
          <h2>Role: {user.role}</h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => handleEditUser(user)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => handleDeleteUser(user)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          <MdDelete />
        </button>
        <button
          onClick={() => toggleadminForm(user._id)}
          className="bg-blue-500 border rounded-[10px] px-3 py-1 text-sm"
        >
          {openFormUserId === user._id ? "Cancel" : "Create New Task"}
        </button>
      </div>

    </div>
  </div>
</div>


  
{openFormUserId === user._id && (
  <div className="flex justify-center mt-6 px-2 sm:px-4">
    <form
      onSubmit={handleSubmit(onadminSubmit(user._id))}
      className="w-full sm:w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] bg-white border border-gray-300 rounded-xl shadow-lg p-4 sm:p-6 space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Create New Task
      </h2>

      {/* Task Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "Title is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          {...register("status", { required: "Status is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          {...register("priority", { required: "Priority is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          {...register("dueDate", { required: "Due Date is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
          Upload PDF Files (Max: 3 and less than 10mb)
        </label>
        {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
        <input
          type="file"
          className="w-full border rounded-md p-2 text-sm"
          accept="application/pdf"
          onChange={handleFileChange}
          multiple
        />
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-sm sm:text-base">Selected Files:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 mt-1 sm:mt-0"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 sm:px-5 py-2 rounded-md hover:bg-indigo-600 transition-colors text-sm sm:text-base"
        >
          Create Task
        </button>
      </div>
    </form>
  </div>
)}


      {/* Task list for this user */}
      {userTasks.length === 0 ? (
  <p className="text-gray-500 flex justify-center">No tasks assigned</p>
) : (
  <div className="space-y-4 mt-2">
    {userTasks.map(task => (
      <div key={task._id} className="flex justify-center my-6 px-2 sm:px-4">
        <div className="w-full sm:w-[80%] lg:w-[50%] bg-white border border-gray-300 rounded-xl shadow-lg p-4">
          
          {/* Title & Edit */}
          <div className="flex flex-row sm:flex-row justify-between sm:items-center border-b border-gray-200 pb-2 mb-2 gap-2">
            {editTaskId === task._id ? (
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="border px-2 py-1 rounded w-full sm:w-auto"
              />
            ) : (
              <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
            )}

            <div className="flex gap-2 flex-wrap">
              {editTaskId === task._id ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  <FiEdit />
                </button>
              )}
              <button
                onClick={() => handleDelete(task)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                <MdDelete />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-3 text-sm sm:text-base">
            <span className="font-medium">Description: </span>
            {editTaskId === task._id ? (
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="border w-full px-2 py-1 rounded"
              />
            ) : (
              task.description
            )}
          </div>

          {/* Status & Due Date */}
          <div className="flex flex-row sm:flex-row sm:justify-between sm:items-center border-t border-gray-200 pt-2 gap-2">
            <div>
              <span className="font-medium">Status: </span>
              {editTaskId === task._id ? (
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              ) : (
                task.status
              )}
            </div>

            <div>
              <span className="font-medium">Due: </span>
              {editTaskId === task._id ? (
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  className="border rounded px-2 py-1"
                />
              ) : (
                new Date(task.dueDate).toLocaleDateString()
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="mt-2">
            <span className="font-medium">Priority: </span>
            {editTaskId === task._id ? (
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority}
              </span>
            )}
          </div>

          {/* Files */}
          {task.files && task.files.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-start border-t border-gray-200 pt-2">
              <span className="font-medium">Files:</span>
              <div className="flex flex-wrap gap-4">
                {task.files.map((file, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      <img
                        src="./pdf.png"
                        className="h-[100px] w-[70px] object-cover"
                        alt="file"
                      />
                      <p className="text-xs text-center">{file.name}</p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
})}
{editUserId && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[60%]">
      <form onSubmit={handleSubmit(handleUserEditSubmit)}>
        <h3 className="text-md font-semibold mb-2">Edit User</h3>
        
        <label>Enter username</label>
        <input
          {...register("name", { required: "Username is required" })}
          className="w-full border border-gray-300 rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="text"
          value={editUserData.name}
          onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <label>Enter Email</label>
        <input
          {...register("email", { required: "Email is required" })}
          className="w-full border border-gray-300 rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="email"
          value={editUserData.email}
          onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <label>Enter Password</label>
        <input
          {...register("password", { required: "Password is required" })}
          className="w-full border border-gray-300 rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password"
          value={editUserData.password}
          onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <label>Select Role</label>
        <select
          {...register("role", { required: "Role is required" })}
          className="border border-gray-300 mt-3 ml-2 rounded-md"
          value={editUserData.role}
          onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}

        <div className="flex justify-center mt-3">
          <input type="submit" className="bg-blue-500 px-3 py-1 rounded-md" />
        </div>
      </form>
    </div>
  </div>
)}
    </div>
    </div>

  )
  }else{
    return(
    <div>
      <div className='flex justify-end items-center gap-4 pt-1 pr-9'>
  {/* Sort Dropdown */}
  <select
    value={sortOption}
    onChange={(e) => setSortOption(e.target.value)}
    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
  >
    <option value="">Sort by</option>
    <option value="dueDate">Due Date</option>
    <option value="priority">Priority</option>
    <option value="status">Status</option>
  </select>
  <div
    onClick={() => setShowDetails(!showDetails)}
    className="w-fit h-[32px] flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-1.5 cursor-pointer hover:shadow-sm "
  >
    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
      {authuser.name[0].toUpperCase()}
    </div>
    <div className="text-sm font-medium text-gray-800">Hi, {authuser.name}</div>
  </div>
        </div>
      {showDetails && (
                <div className="absolute right-0 mt-2 mr-2 bg-[#6363a0] text-white border rounded-lg shadow-lg w-fit z-50 pb-4 pt-3 px-4">
                  <h3 className="text-md font-semibold mb-2">Account Info</h3>
                  <p className="text-sm text-white">Name: {authuser.name}</p>
                  <p className="text-sm text-white">Role: {authuser.role}</p>
                  <p className="text-sm  text-white whitespace-nowrap overflow-hidden text-ellipsis">Email: {authuser.email}</p>
                </div>
              )}
      
      
      <div className="space-y-6">
{usertasks.map((task) => (
  <div key={task._id} className="flex justify-center my-6">
    <div className="w-[50%] bg-white border border-gray-300 rounded-xl shadow-lg p-4">
      
      <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
        {editTaskId === task._id ? (
          <input
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="border px-2 py-1 rounded"
          />
        ) : (
          <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
        )}

        <div className="flex gap-2">
          {editTaskId === task._id ? (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => handleEdit(task)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              <FiEdit />
            </button>
          )}
          <button
            onClick={() => handleDelete(task)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            <MdDelete />
          </button>
        </div>
      </div>
      <div className="mb-3">
        <span className="font-medium">Description: </span>
        {editTaskId === task._id ? (
          <textarea
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="border w-full px-2 py-1 rounded"
          />
        ) : (
          task.description
        )}
      </div>
      <div className="flex justify-between items-center border-t border-gray-200 pt-2">
        <div>
          <span className="font-medium">Status: </span>
          {editTaskId === task._id ? (
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="border rounded px-2 py-1"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          ) : (
            task.status
          )}
        </div>

        <div>
          <span className="font-medium">Due: </span>
          {editTaskId === task._id ? (
            <input
              type="date"
              value={editForm.dueDate}
              onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
              className="border rounded px-2 py-1"
            />
          ) : (
            new Date(task.dueDate).toLocaleDateString()
          )}
        </div>
      </div>

      {/* Priority */}
      <div className="mt-2">
        <span className="font-medium">Priority: </span>
        {editTaskId === task._id ? (
          <select
            value={editForm.priority}
            onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
            className="border rounded px-2 py-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        ) : (
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.priority}
          </span>
        )}
      </div>
      {/* Files (PDF links) */}
{task.files && task.files.length > 0 && (
  <div className="mt-4 flex gap-5 items-center border-t border-gray-200 pt-2">
    <span className="font-medium">Files:</span>
    <div className="flex gap-5">
      {task.files?.map((file, index) => (
  <div key={index} className="flex items-center gap-2">
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      <div className='flex-col'><img src='./pdf.png' className='h-[100px] w-[70px]'/> {file.name}</div>
    </a>
  </div>
))}

    </div>
  </div>
)}
    </div>
  </div>
))}

      </div>
      <div >
      <div className='flex justify-center'>
      <button onClick={toggleForm} className='bg-blue-500 border-1 rounded-[10px] mb-5 px-2 py-1'>
        {isFormVisible ? 'cancel' : 'Create New Task'}
      </button>
      </div>
      {isFormVisible && (
  <div className="flex justify-center mt-6">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[50%] bg-white border border-gray-300 rounded-xl shadow-lg p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
        Create New Task
      </h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "Title is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          {...register("status", { required: "Status is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          {...register("priority", { required: "Priority is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="low" className='text-green-300'>Low</option>
          <option value="medium" className='text-yellow-300'>Medium</option>
          <option value="high" className='text-red-300'>High</option>
        </select>
        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          {...register("dueDate", { required: "Due Date is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
      </div>
      <div className="container mx-auto p-8">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Upload PDF Files (Max: 3 and less than 10mb)</label>
          {fileError && <p className="text-red-500 text-sm mt-2">{fileError}</p>}
          <input
            type="file"
            className="file-input border rounded-md p-2"
            accept="application/pdf"
            onChange={handleFileChange}
            multiple
          />
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-lg">Selected Files:</h3>
          <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
    </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition-colors"
        >
          Create Task
        </button>
      </div>
      
    </form>
  </div>
)}

    </div>
    </div>
    )}
};

export default HomePage;
