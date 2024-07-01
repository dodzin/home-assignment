import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { User } from './model/user';
import { Post } from './model/post';
import { createPost, deletePost, editPost, fetchPosts, fetchUsers, likePost } from './api/api';
import { Header } from './components';
import { PostItem } from './components/PostItem';
import { PostEditor } from './components/PostEditor';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [usedUserIds, setUsedUserIds] = useState<number[]>([]);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    fetchPostsData();
  }, []);


  const fetchData = async () => {
    const usersData = await fetchUsers();
    setUsers(usersData);
    selectRandomUser(usersData);
  }

  const fetchPostsData = async () => {
    const postsData = await fetchPosts();
    setPosts(postsData);
  }

  const selectRandomUser = (users: User[]): any => {
    const availableUserIds = users.map(user => user.id).filter(id => !usedUserIds.includes(id));
    if (availableUserIds.length === 0) {
      setUsedUserIds([]);
      return selectRandomUser(users);
    }
    const randomUserId = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
    setActiveUser(users.find(user => user.id === randomUserId) || null);
    setUsedUserIds([...usedUserIds, randomUserId]);
  };

  const handlePostSubmit = async (post: Post) => {
    const newPost = await createPost(post);
    setPosts([newPost, ...posts]);
    setShowPostEditor(false);
  };

  const handlePostDelete = async () => {
    if (deletingPostId !== null) {
      await deletePost(deletingPostId);
      setPosts(posts.filter(post => post.id !== deletingPostId));
      setDeletingPostId(null);
      setShowDeleteConfirmation(false);
    }
  };

  const handlePostEdit = async (post: Post) => {
    const updatedPost = await editPost(post);
    setPosts(posts.map(p => p.id === post.id ? updatedPost : p));
    setEditingPost(null);
    setShowPostEditor(false);
  };

  const handlePostLike = async (postId: number) => {
    if (activeUser) {
      const updatedPost = await likePost(postId, activeUser.id);
      if (!updatedPost.createdAt) {
        updatedPost.createdAt = new Date().toISOString();
      }
      setPosts(posts.map(p => p.id === postId ? updatedPost : p));
    }
  };

  return (
    <>
      <Header
        activeUser={activeUser}
        onAvatarClick={() => selectRandomUser(users)}
        openPostEditor={() => setShowPostEditor(true)}
      />
      <Container className="posts-wrapper" style={{ marginTop: '20px' }}>
        {posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            activeUser={activeUser}
            onEdit={() => {
              setEditingPost(post);
              setShowPostEditor(true);
            }}
            onDelete={() => {
              setDeletingPostId(post.id);
              setShowDeleteConfirmation(true);
            }}
            onLike={() => handlePostLike(post.id)}
            users={users}
          />
        ))}
      </Container>
      {showPostEditor && (
        <PostEditor
          post={editingPost}
          onSubmit={editingPost ? handlePostEdit : handlePostSubmit}
          onCancel={() => setShowPostEditor(false)}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmationDialog
          open={showDeleteConfirmation}
          onConfirm={handlePostDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </>
  );
};
export default App;
