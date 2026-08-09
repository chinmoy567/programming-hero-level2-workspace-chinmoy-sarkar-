import {Router} from 'express';
const router = Router();
import {userController } from './user.controller';


//user registration route
router.post("/register",userController.registerUser)

export const userRouter = router;   