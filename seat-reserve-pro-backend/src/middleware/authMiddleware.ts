// seat-reserve-pro-backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend the Express Request interface to include the user object
interface AuthRequest extends Request {
    user?: IUser;
}

// Protects general routes (requires any logged-in user)
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    // Check for the token in the 'Authorization' header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

            // Attach user data (excluding password) to the request object
            const user = await User.findById(decoded.id).select('-password');
            
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).json({ message: 'Not authorized, user not found' });
            }

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};