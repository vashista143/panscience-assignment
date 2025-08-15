import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/user.js"
export const signup = async(req,res)=>{
    const {name, email, password, role}= req.body;
    console.log(req.body);
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"all feilds must be filled"})
        }
        const existinguser= await User.findOne({email: email});
        if(existinguser){
            return res.status(400).json({message:"all feilds must be filled"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newuser = new User({
        name,
        email: email,
        password: hashedPassword,
        role: role,
        });
        await newuser.save();
        const token = jwt.sign({ id: newuser._id, role: newuser.role }, "my-secret", {expiresIn: "7d",});
        res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict",
        secure: false,
        });
        return res.status(200).json({_id: newuser._id,
      name: newuser.name,
      email: newuser.email,
    admin: newuser.role})
    }catch(err){
        return res.status(400).json({message:"server error"})
    }
}

export const login = async(req,res)=>{
        const {email, password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "invalid email" });}
        const verified=await bcrypt.compareSync(password, user.password);
        if(!verified){
            return res.status(400).json({ message: "wrong password" });
        }
        const token = jwt.sign({ id: user._id }, "my-secret", {expiresIn: "7d",});
        res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict",
        secure: false,
        });
        return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        });
    }catch(error){
        console.log(error)
         return res.status(400).json({ message: "Internal server error" });
    }
}


export const logout = async(req,res)=>{
    try {
        res.clearCookie("jwt", {
  httpOnly: true,
  sameSite: "Strict",
  secure: false
});
        return res.status(200).json({message:"logged out succesfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteuser = async(req,res)=>{
    const {userid}= req.params;
    try {
    // Await the result of the deletion
    const result = await User.findByIdAndDelete(userid);

    // Check if a user was found and deleted
    if (result) {
      console.log("User deleted:", result);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adduser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const newUser = new User({
      name,
      email,
      hashedPassword,
      role,
    });
    await newUser.save();
    return res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Error adding user" });
  }
};

export const updateuser = async (req, res) => {
  const { userid } = req.params;
  const { name, email, password, role } = req.body;
  console.log(userid, name, email, password, role);

  try {
    // Hash the password if provided
    let hashedPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }
    const updateData = {
      name,
      email,
      role,
    };
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }
    const result = await User.findByIdAndUpdate(userid, updateData, { new: true });
    if (!result) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const checkauth=(req,res)=>{
  try{
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not verified" });
    }
    res.status(200).json(req.user);
    console.log(req.user)
  }catch(error){
        console.log(error)
        return res.status(500).json({ message: "user unverified" });
  }
}