import express from "express";
import { getPermissions, getPermissionsUser, addPermissionToDoor, removePermissionFromDoor } from "../controllers/permissions.js";

const router = express.Router();

router.get("/permission/", getPermissions);

router.get("/permissionUser/:userID", getPermissionsUser);

router.post("permissionUserAdd/", addPermissionToDoor)

router.delete("/permissionUserDelete/", removePermissionFromDoor);

export default router;