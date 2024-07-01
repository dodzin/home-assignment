import React from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography, Tooltip } from '@mui/material';
import { Edit, Delete, ThumbUp } from '@mui/icons-material';
import { Post } from '../../model/post';
import { User } from '../../model/user';
import { UserAvatar } from '../UserAvatar';

type PostItemProps = {
    post: Post;
    activeUser: User | null;
    onEdit: () => void;
    onDelete: () => void;
    onLike: () => void;
    users: User[];
};

export const PostItem: React.FC<PostItemProps> = ({ post, activeUser, onEdit, onDelete, onLike, users }) => {
    const isUserPost = activeUser && post.userId === activeUser.id;

    const handleLike = () => {
        if (activeUser) {
            onLike();
        }
    };
    const getLikersNames = () => {
        return post.likedBy.map(userId => users.find(user => user.id === userId)?.name || "Unknown").join(", ");
    };

    const getFormattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <Card style={{ maxWidth: 600, margin: '20px auto' }}>
            <CardHeader
                avatar={<UserAvatar user={users.find(user => user.id === post.userId) || { id: post.userId, name: "Unknown" }} />} // Замените на реальные данные пользователя
                title={users.find(user => user.id === post.userId)?.name || "Unknown"} // Замените на реальное имя пользователя
                subheader={getFormattedDate(post.createdAt)}
            />
            {post.imageUrl && <CardMedia component="img" image={post.imageUrl} alt="Post image" />}
            <CardContent>
                <Typography variant="body1">{post.content}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Tooltip title={getLikersNames()} >
                    <IconButton onClick={handleLike}>
                        <ThumbUp />
                        <Typography variant="body2" style={{ marginLeft: '5px' }}>
                            {post?.likedBy?.length}
                        </Typography>
                    </IconButton>
                </Tooltip>
                {isUserPost && (
                    <>
                        <IconButton onClick={onEdit}>
                            <Edit />
                        </IconButton>
                        <IconButton onClick={onDelete}>
                            <Delete />
                        </IconButton>
                    </>
                )}
            </CardActions>
        </Card >
    );
};


