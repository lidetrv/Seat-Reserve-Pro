import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import bookingRoutes from './routes/bookingRoutes';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

//ADD CORS MIDDLEWARE
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}))
// Middleware
app.use(express.json());

// Define Root Route
app.get('/', (req: Request, res: Response) => {
    res.send('Seat Reserve Pro API is Running!');
});

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on pot ${PORT}`);
})
// Start server after DB connection
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`✅ MongoDB connected successfully`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();


// // seat-reserve-pro-backend/src/server.ts (Updated for Bookings)

// import express, { Express, Request, Response } from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db';
// import authRoutes from './routes/authRoutes';
// import eventRoutes from './routes/eventRoutes';
// import bookingRoutes from './routes/bookingRoutes'; // <-- ADDED

// dotenv.config();
// connectDB();

// const app: Express = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());

// // Define Root Route
// app.get('/', (req: Request, res: Response) => {
//     res.send('Seat Reserve Pro API is Running!');
// });

// // Define API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/bookings', bookingRoutes); // <-- ADDED

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

