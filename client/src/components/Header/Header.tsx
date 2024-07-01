import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import "./styles.css";
import { UserAvatar } from "../UserAvatar";
import { User } from "../../model/user";

type HeaderProps = {
  activeUser: User | null;
  onAvatarClick: () => void;
  openPostEditor: () => void;
};

export const Header: React.FC<HeaderProps> = ({ activeUser, onAvatarClick, openPostEditor }) => {
  const user: User = activeUser || { id: 0, name: "" };


  return (
    <AppBar position="static">
      <Toolbar disableGutters className="app-toolbar">
        <Tooltip title="Switch User">
          <IconButton onClick={onAvatarClick}>
            <UserAvatar user={user} className="user-avatar" />
          </IconButton>
        </Tooltip>
        <div>
          <Typography className="app-title main" variant="h6">
            BriefCam Social
          </Typography>
          <Typography className="app-title" variant="subtitle1" lineHeight={1}>
            {user.name}
          </Typography>
        </div>
        <Tooltip title="Add Post">
          <IconButton onClick={openPostEditor}>
            <AddOutlined htmlColor="white" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
