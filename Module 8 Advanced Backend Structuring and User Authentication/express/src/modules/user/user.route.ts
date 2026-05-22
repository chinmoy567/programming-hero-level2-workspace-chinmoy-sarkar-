import{Router} from "express"
import { userController } from "./user.controller";
const router = Router();


// Route to handle POST requests and insert data into the database
router.post("/",userController.createUser);
export const userRoute = router;