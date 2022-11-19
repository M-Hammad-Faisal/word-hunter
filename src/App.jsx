import "./App.css";
import { useState, useEffect } from "react";
import { Grid, Typography, TextField, CircularProgress } from "@mui/material";
import axios from "axios";
import Meanings from "./components/Meanings";

function App() {
  const [word, setWord] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [meanings, setMeanings] = useState([]);

  useEffect(() => {
    if (word !== "") {
      setIsLoading(true);
      axios
        .get("https://api.dictionaryapi.dev/api/v2/entries/en/" + word.trim())
        .then((response) => {
          console.log(response.data);
          setMeanings(response.data);
          setIsLoading(false);
        })
        .catch((response) => {
          setMeanings([]);
          setIsLoading(false);
        });
    }
  }, [word]);

  return (
    <Grid
      container
      sx={{
        height: word === "" ? "80vh" : "",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Grid
        sx={{
          marginY: "1vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            noWrap
            sx={{ textTransform: "uppercase", fontSize: "6vw" }}
          >
            {word || "Word Hunter"}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            autoFocus={true}
            variant="standard"
            placeholder="Search a word"
            value={word}
            onChange={(event) => setWord(event.target.value.trim())}
            inputProps={{
              maxLength: 20,
            }}
            sx={{
              width: "50vw",
              "& label.Mui-focused": {
                color: "black",
              },
              ".css-1x51dt5-MuiInputBase-input-MuiInput-input": {
                textAlign: "center",
                fontSize: "2vw",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "black",
                display: "none",
              },
            }}
          />
        </Grid>
      </Grid>
      {isLoading === true ? (
        <Typography
          variant="h2"
          sx={{
            fontSize: "5vw",
            textAlign: "center",
          }}
        >
          <CircularProgress sx={{ color: "black" }} />
        </Typography>
      ) : meanings === null || word === "" ? null : (
        <Grid
          sx={{
            marginY: "1vw",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingX: "20vw",
          }}
        >
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "2vw",
              padding: "1.5vw",
              backgroundColor: "black",
              color: "white",
            }}
          >
            {meanings.length > 0 && (
              <Grid sx={{ paddingX: "1.5vw", width: "100%" }}>
                <audio
                  src={
                    meanings[0]?.phonetics[0]?.audio === ""
                      ? meanings[0]?.phonetics[1]?.audio
                      : meanings[0]?.phonetics[0]?.audio
                  }
                  controls={true}
                  sx={{ width: "100%" }}
                >
                  Your Browser donot support Audio Element!
                </audio>
              </Grid>
            )}
            {meanings.length === 0 ? (
              <Typography
                variant="h4"
                sx={{
                  fontSize: "2vw",
                  textAlign: "center",
                }}
              >
                No Results Found!!!
              </Typography>
            ) : (
              meanings.map((meaning, index) => {
                return (
                  <Grid key={index} item>
                    <Meanings word={word} meaning={meaning} />
                  </Grid>
                );
              })
            )}
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Typography
          variant="h6"
          sx={{
            fontSize: "2vw",
            textAlign: "center",
          }}
        >
          @ {new Date().getFullYear()} All Rights Reserved.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default App;
