import express from 'express';
import cookieParser from 'cookie-parser';
import authRouts from './routes/auth.routes.js';
import foodRouts from './routes/food.routes.js';
import foodPartnerRouts from './routes/food-partner.routes.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173/user/login', // Update with your frontend URL
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("./public"));


app.use('/api/auth', authRouts);
app.use('/api/food', foodRouts);
app.use('/api/food-partner', foodPartnerRouts);


export default app;