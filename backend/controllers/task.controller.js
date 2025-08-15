import User from "../models/user.js"
import Task from "../models/task.js";
import multer from "multer";
import supabase from "../config/supabase.js";
import fs from 'fs/promises';

export const getusers= async(req,res)=>{
    try{
    const allusers=await User.find();
    res.json(allusers);
    }catch(error){
        console.log("error fetching data", error)
        res.status(500).send({message:"error fetching"})
    }
}
export const gettasks= async(req,res)=>{
    try{
    const alltasks=await Task.find();
    res.json(alltasks);
    }catch(error){
        console.log("error fetching data", error)
        res.status(500).send({message:"error fetching"})
    }
}

const storage = multer.memoryStorage(); // important for supabase uploads
const upload = multer({ storage });

export const addtask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  if (!title || !description || !status || !priority || !dueDate || !assignedTo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const fileInfos = [];

for (const file of req.files || []) {
  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("pdf-files")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }

  const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/pdf-files/${fileName}`;

  fileInfos.push({
    name: file.originalname,
    url: publicURL
  });
}

const newTask = new Task({
  title,
  description,
  status,
  priority,
  dueDate,
  assignedTo,
  files: fileInfos,
});


    await newTask.save();

    res.status(201).json({
      message: "Task added successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task" });
  }
};

export const deletetask = async (req, res) => {
  const { taskid } = req.body;
  if (!taskid) {
    return res.status(400).json({ message: "Task ID is required" });
  }
  try {
    const deletedTask = await Task.findByIdAndDelete(taskid);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    console.log("Task removed");
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updatetask= async (req, res) => {
  try {
    const { taskid, title, description, dueDate, priority, status } = req.body;

    if (!taskid) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskid,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(dueDate && { dueDate }),
        ...(priority && { priority }),
        ...(status && { status }),
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
}