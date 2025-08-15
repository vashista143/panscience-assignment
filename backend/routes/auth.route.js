import express from "express"
import {protectroute} from "../middleware/auth.middleware.js"
import {login, logout, adduser, updateuser, deleteuser, signup, checkauth} from "../controllers/auth.controller.js"
const router= express.Router()
router.post("/login",login)
router.post("/signup",signup)
router.post("/logout",logout)
router.post("/adduser",adduser)
router.delete("/delete/:userid",deleteuser)
router.put("/updateuser/:userid",updateuser)
router.get("/check", protectroute, checkauth)
export default router;