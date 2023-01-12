import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/User.js";
import { adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', adminOnly, getUsers);
router.get('/users/:id', adminOnly, getUserById);
router.post('/users', adminOnly, createUser);
router.patch('/users/:id', adminOnly, updateUser);
router.delete('/users/:id', adminOnly, deleteUser);

export default router;
