import React from "react";
import { useQuery } from '@tanstack/react-query';
import Spinner from '../spinner';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getGenres } from "../../api/tmdb-api";
import img from '../../images/pexels-dziana-hasanbekava-5480827.jpg'

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const formControl =
{
    margin: 1,
    minWidth: "90%",
    backgroundColor: "rgb(255, 255, 255)"
};

export default function FilterMoviesCard(props) {

    const { data, error, isPending, isError } = useQuery({
        queryKey: ['genres'],
        queryFn: getGenres,
    });

    if (isPending) {
        return <Spinner />;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }
    const genres = data.genres;
    if (genres[0].name !== "All") {
        genres.unshift({ id: "0", name: "All" });
    }

    const handleChange = (e, type, value) => {
        props.onUserInput(type, value);
    };

    const handleTextChange = (e) => {
        handleChange(e, "name", e.target.value);
    };

    const handleGenreChange = (e) => {
        handleChange(e, "genre", e.target.value);
    };

    const handleSortByChange = (e) => {
        handleChange(e, "sortBy", e.target.value);
    };

    const handleSortOrderChange = (e) => {
        handleChange(e, "sortOrder", e.target.value);
    };

    const handleTypeChange = (e, v) => {
      // v will be 'movies' or 'people'
      if (v) handleChange(e, 'filterType', v);
    };

    return (
        <Card
            sx={{
                backgroundColor: "rgb(204, 204, 0)"
            }}
            variant="outlined">
            <CardContent>
                <Typography variant="h5" component="h1">
                    <SearchIcon fontSize="large" />
                    Filter the movies.
                </Typography>
                <TextField
                    sx={{ ...formControl }}
                    id="filled-search"
                    label="Search field"
                    type="search"
                    variant="filled"
                    value={props.titleFilter}
                    onChange={handleTextChange}
                />

                <FormControl sx={{ ...formControl }}>
                    <InputLabel id="genre-label">Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        id="genre-select"
                        label="Genre"
                        defaultValue=""
                        value={props.genreFilter}
                        onChange={handleGenreChange}
                    >
                        {genres.map((genre) => {
                            return (
                                <MenuItem key={genre.id} value={genre.id}>
                                    {genre.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <FormControl sx={{ ...formControl }}>
                    <InputLabel id="sortby-label">Sort By</InputLabel>
                    <Select
                        labelId="sortby-label"
                        id="sortby-select"
                        label="Sort By"
                        value={props.sortBy || ''}
                        onChange={handleSortByChange}
                    >
                        {props.filterType === 'people' ? (
                            // When filtering people, show person-specific sort options
                            [
                                <MenuItem key="name" value="name">Alphabetical (A-Z)</MenuItem>,
                                <MenuItem key="age" value="age">Age</MenuItem>,
                                <MenuItem key="movie_count" value="movie_count">Total Movie Count</MenuItem>
                            ]
                        ) : (
                            // Default movie sort options
                            [
                                <MenuItem key="title" value="title">Title (A-Z)</MenuItem>,
                                <MenuItem key="release_date" value="release_date">Release Date</MenuItem>,
                                <MenuItem key="vote_average" value="vote_average">Rating</MenuItem>,
                                <MenuItem key="popularity" value="popularity">Popularity</MenuItem>
                            ]
                        )}
                    </Select>
                </FormControl>

                <FormControl sx={{ ...formControl }}>
                    <InputLabel id="sortorder-label">Order</InputLabel>
                    <Select
                        labelId="sortorder-label"
                        id="sortorder-select"
                        label="Order"
                        value={props.sortOrder || 'asc'}
                        onChange={handleSortOrderChange}
                    >
                        <MenuItem value="asc">Ascending</MenuItem>
                        <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                </FormControl>

                                {props.showTypeToggle && (
                                    <ToggleButtonGroup
                                        value={props.filterType || 'movies'}
                                        exclusive
                                        onChange={handleTypeChange}
                                        aria-label="filter type"
                                        sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
                                    >
                                        <ToggleButton value="movies">Movies</ToggleButton>
                                        <ToggleButton value="people">People</ToggleButton>
                                    </ToggleButtonGroup>
                                )}
            </CardContent>
            <CardMedia
                sx={{ height: 300 }}
                image={img}
                title="Filter"
            />
            <CardContent>
                <Typography variant="h5" component="h1">
                    <SearchIcon fontSize="large" />
                    Filter the movies.
                    <br />
                </Typography>
            </CardContent>
        </Card>
    );
}