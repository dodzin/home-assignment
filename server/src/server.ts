import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { User } from './models/user';
import { Post } from './models/post';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());


const ensurePostFields = (post: any): Post => {
  return {
    id: post.id,
    userId: post.userId,
    content: post.content,
    imageUrl: post.imageUrl || '',
    createdAt: post.createdAt || new Date().toISOString(),
    likes: post.likes || 0,
    likedBy: post.likedBy || []
  };
};

// GET users
app.get('/api/users', (req: Request, res: Response) => {
  const users: User[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../db', 'users.json'), 'utf-8'));
  res.json(users);
});

// GET posts
app.get('/api/posts', (req: Request, res: Response) => {
  let posts: Post[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../db', 'posts.json'), 'utf-8'));
  posts = posts.map(ensurePostFields);
  posts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(posts);
});

// POST new post
app.post('/api/posts', (req: Request, res: Response) => {
  const posts: Post[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../db', 'posts.json'), 'utf-8'));
  const newPost: Post = ensurePostFields(req.body);
  posts.push(newPost);
  fs.writeFileSync(path.join(__dirname, '../db', 'posts.json'), JSON.stringify(posts, null, 2));
  res.status(201).json(newPost);
});

// DELETE a post
app.delete('/api/posts/:id', (req: Request, res: Response) => {
  let posts: Post[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../db', 'posts.json'), 'utf-8'));
  const postId = parseInt(req.params.id);
  posts = posts.filter(post => post.id !== postId);
  fs.writeFileSync(path.join(__dirname, '../db', 'posts.json'), JSON.stringify(posts, null, 2));
  res.status(204).end();
});

// PUT edit a post
app.put('/api/posts/:id', (req: Request, res: Response) => {
  const posts: Post[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../db', 'posts.json'), 'utf-8'));
  const postId = parseInt(req.params.id);
  const updatedPost: Post = ensurePostFields(req.body);
  const postIndex = posts.findIndex(post => post.id === postId);
  posts[postIndex] = updatedPost;
  fs.writeFileSync(path.join(__dirname, '../db', 'posts.json'), JSON.stringify(posts, null, 2));
  res.json(updatedPost);
});

// PUT like a post
app.put('/api/posts/:id/like', (req: Request, res: Response) => {
  const posts: Post[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../db', 'posts.json'), 'utf-8'));
  const postId = parseInt(req.params.id);
  const { userId }: { userId: number } = req.body;
  const post = posts.find(post => post.id === postId);
  if (post) {
    if (!post.likedBy) {
      post.likedBy = [];
    }
    if (!post.likedBy.includes(userId)) {
      post.likes += 1;
      post.likedBy.push(userId);
    } else {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter(id => id !== userId);
    }
    fs.writeFileSync(path.join(__dirname, '../db', 'posts.json'), JSON.stringify(posts, null, 2));
    res.json(post);
  } else {
    res.status(404).send('Post not found');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});