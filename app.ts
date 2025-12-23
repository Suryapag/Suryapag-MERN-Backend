import express, { Application, Request, Response } from 'express';
import {db} from './config/mongodb';
const auth = require('./middleware/authMiddleware');
const cors = require("cors");
const app: Application = express();
const PORT = process.env.PORT || 4041;

// Enable CORS
app.use(cors({
  origin: "http://192.168.64.1:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth);
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello TypeScript Backend!' });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

db.then();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});