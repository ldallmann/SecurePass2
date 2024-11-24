import express from "express";
import { getDoors} from "../controllers/door.js";

const router = express.Router();

router.get("/door/", getDoors);

export default router;