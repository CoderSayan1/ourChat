import { Router } from "express";
import { allUsers, checkApi, getProfile, loginUser, logoutUser, messageOfUser, registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route('/test').get(checkApi)
router.route('/register').post(registerUser)
router.route('/profile').get(getProfile)
router.route('/login').post(loginUser)
router.route('/messages/:userId').get(messageOfUser)
router.route('/allPeople').get(allUsers)
router.route('/logout').post(logoutUser)

export default router;