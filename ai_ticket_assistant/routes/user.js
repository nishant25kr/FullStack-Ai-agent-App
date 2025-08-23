import express from "express"
import { getUser, login, logout, signup, update } from "../controllers/user";
import {authenticate} from "../middlewares/auth"

const router = express.Router()


router.post('/update-user',authenticate,update)
router.post('/users',authenticate,getUser)


router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

export default router;