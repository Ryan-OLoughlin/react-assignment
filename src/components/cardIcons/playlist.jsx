import React, { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Checkbox from "@mui/material/Checkbox";
import IconButtonMui from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { MoviesContext } from "../../contexts/moviesContext";

const PlaylistIcon = ({ movie }) => {
  const context = useContext(MoviesContext);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const toggleInPlaylist = (playlist) => {
    const movieId = movie.id;
    if (playlist.movieIds.includes(movieId)) {
      context.removeMovieFromPlaylist(playlist.id, movieId);
    } else {
      context.addMovieToPlaylist(playlist.id, movie);
    }
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = context.createPlaylist(newName.trim());
    context.addMovieToPlaylist(id, movie);
    setNewName("");
  };

  const handleDeletePlaylist = (id) => {
    context.deletePlaylist(id);
  };

  return (
    <>
      <IconButton aria-label="add to playlist" onClick={handleOpen}>
        <PlaylistAddIcon color="secondary" fontSize="large" />
      </IconButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Add to playlist</DialogTitle>
        <DialogContent>
          <List>
            {context.playlists && context.playlists.length ? (
              context.playlists.map((pl) => (
                <ListItem key={pl.id} button onClick={() => toggleInPlaylist(pl)}>
                  <ListItemText primary={pl.name} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={() => toggleInPlaylist(pl)}
                      checked={pl.movieIds.includes(movie.id)}
                    />
                    <IconButtonMui edge="end" onClick={() => handleDeletePlaylist(pl.id)}>
                      <DeleteIcon />
                    </IconButtonMui>
                  </ListItemSecondaryAction>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No playlists yet" />
              </ListItem>
            )}
          </List>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <TextField
              label="New playlist"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              size="small"
              fullWidth
            />
            <Button variant="contained" onClick={handleCreate}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaylistIcon;
