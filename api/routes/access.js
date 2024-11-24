import express from "express";
import { getAccess, getAccessTest, getAccessLog, addAccess} from "../controllers/access.js";

const router = express.Router();

router.get("/access/", getAccess);

router.get("/accessTest/", getAccessTest);

router.get("/accessLog/:userID", getAccessLog);

router.post("/access/", addAccess);

export default router;