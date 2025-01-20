import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const secretKey = process.env.JWT_SECRET!;

export function generateToken(userId: number, expiresIn = '1h'): string {
    const payload = { userId };
    const token = jwt.sign(payload, secretKey, {
        expiresIn
    });

    return token;
}

export function encryptPassword(password: string) {
    const encryptedPassword = jwt.sign(password, secretKey);
    return encryptedPassword;
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        return null;
    }
}

export async function authenticateJWT(req: Request, res: Response, next: Function): Promise<any> {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, access denied." });
    }

    await authenticateJWT_common(req, res, next, token);
}

export async function authenticateJWTOptional(req: Request, res: Response, next: Function): Promise<any> {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    await authenticateJWT_common(req, res, next, token);
}

export async function authenticateJWT_common(req: Request, res: Response, next: Function, token?: string,): Promise<any> {

    if (!token) {
        return next();
    }

    const verified = verifyToken(token);

    if (!verified) {
        return res.status(401).json({ message: "Invalid token." });
    }

    try {
        const user = await User.findByPk((verified as any).userId);
        if (user) {
            (req as any).user = user;
            next();
        } else {
            return res.status(401).json({ message: "User not found." });
        }
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal server error." });
    }

}