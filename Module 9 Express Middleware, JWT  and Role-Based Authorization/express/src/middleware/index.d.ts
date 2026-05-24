import type {jwtPayload} from "jsonwebtoken";
declare global {
    namespace Express {
        export interface Request {
            user?: jwtPayload;
        }
    }
}