import {Router} from 'express';
const router = Router();
import {userController } from './user.controller';


//user registration route
router.post("/register",userController.registerUser)

router.get("/me",userController.getMyProfile)

export const userRoutes = router;   