import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { Post } from '../../model/post';

interface PostEditorProps {
  post: Post | null;
  onSubmit: (post: Post) => void;
  onCancel: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({ post, onSubmit, onCancel }) => {
  const [content, setContent] = useState(post ? post.content : '');
  const [imageUrl, setImageUrl] = useState(post ? post.imageUrl : '');

  const handleSubmit = () => {
    const newPost: Post = {
      id: post ? post.id : Date.now(),
      userId: post ? post.userId : 1, // Replace with the actual active user ID
      content,
      imageUrl,
      createdAt: post ? post.createdAt : new Date().toISOString(),
      likes: post ? post.likes : 0,
      likedBy: post ? post.likedBy : [],
    };
    onSubmit(newPost);
  };

  return (
    <Dialog open onClose={onCancel}>
      <DialogTitle>{post ? 'Edit Post' : 'New Post'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Content"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Image URL"
          type="text"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};


