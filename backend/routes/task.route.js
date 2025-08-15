import express from "express";
import {
  getusers,
  deletetask,
  updatetask,
  addtask,
  gettasks
} from "../controllers/task.controller.js";
import multer from "multer";

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 👇 use the middleware here
router.post("/addtask", upload.array("files", 3), addtask);

router.get("/getusers", getusers);
router.get("/gettasks", gettasks);
router.post("/deletetask", deletetask);
router.post("/updatetask", updatetask);

export default router;
