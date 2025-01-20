import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config({
    path: './src/.env'
});

import 'express-async-errors';
import './database/index';

import categoryRoutes from './routes/category.routes';
import tagRoutes from './routes/tag.routes';
import postRoutes from './routes/post.routes';
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';

import logger from './shared/logger.util';
import cors from 'cors';


const app = express();
const port = 3000;

app.use(cors());  //to allow our client to communicate with this backend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
    logger.error({
      message:err.message, stack: err.stack
    });
  
    res.status(500).send('Something went wrong');
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});



// for test purposes
// import jwt from 'jsonwebtoken';
// import User from './models/user';

// const secretKey = 'mySecretKey';

// function generateToken(userId: number) {
//     const payload = {userId};
    
//     const token = jwt.sign(payload, secretKey, {
//         expiresIn: '1h'
//     });
//     return token;
// }

// function verifyToken(token: string) {
//     try {
//         const decoded = jwt.verify(token, secretKey);
//         if (typeof decoded === "object" && decoded.userId) {
//             return decoded;
//         }
//         return null;
//     } catch (err) {
//         return null;
//     }
// }

// async function authenticateJWT(req: Request, res: Response, next: Function): Promise<any> {
//     const token = req.header("Authorization")?.replace("Bearer ", "").trim();

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized, access denied." });
//     }

//     const verified = verifyToken(token);

//     if (!verified) {
//         return res.status(401).json({ message: "Invalid token." });
//     }

//     try {
//         const user = await User.findByPk((verified as any).userId);
//         if (user) {
//             (req as any).user = user;
//             next();
//         } else {
//             return res.status(401).json({ message: "User not found." });
//         }
//     } catch (err) {
//         console.error("Error fetching user:", err);
//         return res.status(500).json({ message: "Internal server error." });
//     }
// }

// app.get("/test", authenticateJWT, (req, res) => {
//     res.json((req as any).user);
// });
// console.log('============ token =============== ', generateToken(1));
// console.log(require("crypto").randomBytes(64).toString("base64"));