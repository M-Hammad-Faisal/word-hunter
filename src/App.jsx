import "./App.css";
import {useState, useEffect, useMemo} from "react";
import {Grid, Typography, TextField, CircularProgress, Button, IconButton} from "@mui/material";
import {Brightness4, Brightness7} from "@mui/icons-material";
import axios from "axios";
import debounce from "lodash/debounce";
import Meanings from "./components/Meanings";

function App() {
    const [word, setWord] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [meanings, setMeanings] = useState([]);
    const [recentSearches, setRecentSearches] = useState(() => JSON.parse(localStorage.getItem("recentSearches")) || []);
    const [theme, setTheme] = useState("light");

    // Memoize the debounced fetchWord function to ensure it’s stable
    const fetchWord = useMemo(() => {
        return debounce((searchWord) => {
            if (searchWord?.trim() === "") {
                console.log("Empty search, clearing meanings");
                setMeanings([]);
                setIsLoading(false);
                return;
            }
            console.log(`Fetching word: ${searchWord}`);
            setIsLoading(true);
            axios
                .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord.trim()}`)
                .then((response) => {
                    console.log("Fetch successful:", response.data);
                    setMeanings(response.data);
                    setRecentSearches((prev) => {
                        const newSearches = [searchWord, ...prev.filter((w) => w !== searchWord)].slice(0, 5);
                        localStorage.setItem("recentSearches", JSON.stringify(newSearches));
                        return newSearches;
                    });
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    setMeanings([]);
                    setIsLoading(false);
                });
        }, 500);
    }, []); // Empty array ensures fetchWord is created once

    useEffect(() => {
        console.log("useEffect triggered with word:", word);
        fetchWord(word);
        return () => {
            console.log("Cleaning up debounce for word:", word);
            fetchWord.cancel();
        };
    }, [word, fetchWord]);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const getRandomWord = () => {
        setIsLoading(true);
        axios
            .get("https://random-word-api.herokuapp.com/word?number=1")
            .then((response) => {
                const randomWord = response.data[0];
                console.log("Random word fetched:", randomWord);
                setWord(randomWord);
            })
            .catch((error) => {
                console.error("Random word fetch error:", error);
                setIsLoading(false);
            });
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <Grid
            container
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "20px",
            }}
        >
            {/* Header */}
            <Grid
                sx={{
                    marginY: "2vw",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    background: theme === "light" ? "#fff" : "#37474F",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <IconButton
                    onClick={toggleTheme}
                    sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        color: theme === "light" ? "#26A69A" : "#80CBC4"
                    }}
                >
                    {theme === "light" ? <Brightness4/> : <Brightness7/>}
                </IconButton>
                <svg width="64" height="64" viewBox="0 0 64 64" style={{margin: "0 auto"}}>
                    <rect width="64" height="64" rx="16" fill={theme === "light" ? "#26A69A" : "#00695C"}/>
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="32"
                          fontFamily="Poppins" fontWeight="600">WH
                    </text>
                </svg>
                <Typography
                    variant="h2"
                    noWrap
                    sx={{
                        textTransform: "uppercase",
                        fontSize: {xs: "8vw", md: "6vw"},
                        textAlign: "center",
                        color: theme === "light" ? "#26A69A" : "#80CBC4",
                        fontWeight: 600,
                        marginTop: "1vw",
                    }}
                >
                    {word || "Word Hunter"}
                </Typography>
                <TextField
                    autoFocus
                    variant="outlined"
                    placeholder="Search a word"
                    value={word}
                    onChange={(e) => setWord(e.target.value.trim())}
                    inputProps={{maxLength: 20}}
                    sx={{
                        width: {xs: "80vw", md: "50vw"},
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            fontSize: {xs: "6vw", md: "4vw"},
                            "& fieldset": {borderColor: theme === "light" ? "#26A69A" : "#80CBC4"},
                            "&:hover fieldset": {borderColor: theme === "light" ? "#00695C" : "#4DB6AC"},
                            "&.Mui-focused fieldset": {borderColor: theme === "light" ? "#00695C" : "#4DB6AC"},
                        },
                        "& .MuiInputBase-input": {
                            textAlign: "center",
                            color: theme === "light" ? "#37474F" : "#ECEFF1"
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={getRandomWord}
                    sx={{
                        marginTop: "1vw",
                        fontSize: {xs: "3vw", md: "1.5vw"},
                        backgroundColor: theme === "light" ? "#26A69A" : "#00695C",
                        "&:hover": {backgroundColor: theme === "light" ? "#00695C" : "#004D40"},
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 500,
                        animation: "bounce 2s infinite",
                    }}
                >
                    Random Word
                </Button>
            </Grid>

            {/* Recent Searches */}
            {recentSearches.length > 0 && word === "" && !isLoading && (
                <Grid sx={{marginBottom: "2vw"}}>
                    <Typography sx={{
                        fontSize: {xs: "4vw", md: "2vw"},
                        textAlign: "center",
                        color: theme === "light" ? "#37474F" : "#ECEFF1"
                    }}>
                        Recent Searches:
                    </Typography>
                    <Grid sx={{display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center"}}>
                        {recentSearches.map((search) => (
                            <Button
                                key={search}
                                onClick={() => setWord(search)}
                                variant="outlined"
                                sx={{
                                    borderColor: theme === "light" ? "#26A69A" : "#80CBC4",
                                    color: theme === "light" ? "#26A69A" : "#80CBC4",
                                    "&:hover": {
                                        borderColor: theme === "light" ? "#00695C" : "#4DB6AC",
                                        backgroundColor: "rgba(38, 166, 154, 0.1)"
                                    },
                                }}
                            >
                                {search}
                            </Button>
                        ))}
                    </Grid>
                </Grid>
            )}

            {/* Loading or Results */}
            {isLoading ? (
                <CircularProgress sx={{color: theme === "light" ? "#26A69A" : "#80CBC4"}}/>
            ) : meanings.length > 0 && word !== "" ? (
                <Grid
                    xs={12}
                    md={8}
                    sx={{
                        marginY: "1vw",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        animation: "fadeIn 0.5s ease-in",
                    }}
                >
                    <Grid
                        container
                        sx={{
                            flexDirection: "column",
                            borderRadius: "16px",
                            padding: "2vw",
                            backgroundColor: theme === "light" ? "#fff" : "#37474F",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Grid sx={{paddingX: "1.5vw", width: "100%"}}>
                            <audio
                                src={meanings[0]?.phonetics.find((p) => p.audio)?.audio || ""}
                                controls
                                style={{
                                    width: "100%",
                                    backgroundColor: theme === "light" ? "#E0F2F1" : "#455A64",
                                    borderRadius: "8px"
                                }}
                            >
                                Your browser does not support the audio element!
                            </audio>
                        </Grid>
                        {meanings.map((meaning, index) => (
                            <Meanings key={index} word={word} meaning={meaning} theme={theme}/>
                        ))}
                    </Grid>
                </Grid>
            ) : word !== "" && !isLoading ? (
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: {xs: "5vw", md: "2vw"},
                        textAlign: "center",
                        color: theme === "light" ? "#37474F" : "#ECEFF1"
                    }}
                >
                    No results found for "{word}". Try another word!
                </Typography>
            ) : null}

            {/* Footer */}
            <Typography
                variant="h6"
                sx={{
                    marginTop: "2vw",
                    fontSize: {xs: "3vw", md: "1.5vw"},
                    textAlign: "center",
                    color: theme === "light" ? "#78909C" : "#B0BEC5"
                }}
            >
                © {new Date().getFullYear()} All Rights Reserved.
            </Typography>
        </Grid>
    );
}

export default App;