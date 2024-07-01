import { Post } from "../model/post";
import { User } from "../model/user";


const API_URL = 'http://localhost:3000/api';

export const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

export const fetchPosts = async (): Promise<Post[]> => {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};

export const createPost = async (post: Post): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to create post');
    }
    return response.json();
};

export const deletePost = async (postId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
};

export const editPost = async (post: Post): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts/${post.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to edit post');
    }
    return response.json();
};

export const likePost = async (postId: number, userId: number): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
        throw new Error('Failed to like post');
    }
    return response.json();
};