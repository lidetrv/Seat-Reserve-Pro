// seat-reserve-pro-backend/src/middleware/adminMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

// Extend the Express Request interface again (assuming protect middleware ran first)
interface AdminRequest extends Request {
    user?: IUser;
}

// Restricts access only to users with the 'admin' role
export const admin = (req: AdminRequest, res: Response, next: NextFunction): void => {
    // We assume 'protect' middleware ran before this and attached req.user
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};