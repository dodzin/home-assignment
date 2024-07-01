export interface Post {
    id: number;
    userId: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
    likes: number;
    likedBy: number[];
}