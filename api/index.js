import express from "express";
import userRoutes from "./routes/users.js";
import accessRoutes from "./routes/access.js";
import doorsRoutes from "./routes/doors.js";
import permissionsRoutes from "./routes/permissions.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRoutes);
app.use("/", accessRoutes);
app.use("/", doorsRoutes);
app.use("/", permissionsRoutes);

app.listen(8800);