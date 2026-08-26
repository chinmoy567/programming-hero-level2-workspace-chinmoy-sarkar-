import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import bcrypt from "bcrypt";


const loginUser =async (payload: ILoginUser)=> {
const {email,password} = payload;
    
//find user by email
const user =await prisma.user.findUniqueOrThrow({
    where:{email}
})
//check password
const isPasswordMatched = await bcrypt.compare(password, user.password);
if(!isPasswordMatched){
    throw new Error("Password is incorrect");      
};
return user;
}
export const authService = {
    loginUser
}
