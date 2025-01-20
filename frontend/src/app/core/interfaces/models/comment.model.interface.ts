import { IUser } from "./user.model.interface";

export interface IComment {
    id: number;
    postId: number;
    userId: number;
    user: IUser;
    content: string;
    createdAt: string;
    updatedAt: string;
}