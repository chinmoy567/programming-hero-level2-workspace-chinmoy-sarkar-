import type { Request, Response, NextFunction } from "express";


const auth = ()=>{
return async (req: Request, res: Response, next: NextFunction ) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
        sucess: false,
        message: "Unauthorized" 
        });
  }
  next();
};
};

export default auth;    