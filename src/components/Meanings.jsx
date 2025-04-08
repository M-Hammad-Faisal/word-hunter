import React from "react";
import { Grid, Typography } from "@mui/material";

const Meanings = ({ word, meaning, theme }) => {
    return (
        <>
            {meaning.meanings.map((mean) =>
                mean.definitions.map((def, index) => (
                    <Grid
                        item
                        key={index}
                        sx={{
                            backgroundColor: theme === "light" ? "#E0F2F1" : "#455A64",
                            color: theme === "light" ? "#37474F" : "#ECEFF1",
                            borderRadius: "12px",
                            padding: "1.5vw",
                            margin: "1vw",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <Grid xs={12} item sx={{ padding: "1vw" }}>
                            <Typography
                                variant="h4"
                                sx={{ textAlign: "justify", fontSize: { xs: "4vw", md: "2vw" }, fontWeight: 500 }}
                            >
                                <b>Part of Speech: </b>
                                {mean.partOfSpeech}
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{ textAlign: "justify", fontSize: { xs: "4vw", md: "2vw" } }}
                            >
                                <b>Definition: </b>
                                {def.definition}
                            </Typography>
                            {def.example && (
                                <Typography
                                    variant="h4"
                                    sx={{ textAlign: "justify", fontSize: { xs: "4vw", md: "2vw" }, fontStyle: "italic" }}
                                >
                                    <b>Example: </b>
                                    {def.example}
                                </Typography>
                            )}
                            {def.synonyms.length > 0 && (
                                <Typography
                                    variant="h4"
                                    sx={{ textAlign: "justify", fontSize: { xs: "4vw", md: "2vw" } }}
                                >
                                    <b>Synonyms: </b>
                                    {def.synonyms.join(", ")}
                                </Typography>
                            )}
                            {def.antonyms.length > 0 && (
                                <Typography
                                    variant="h4"
                                    sx={{ textAlign: "justify", fontSize: { xs: "4vw", md: "2vw" } }}
                                >
                                    <b>Antonyms: </b>
                                    {def.antonyms.join(", ")}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                ))
            )}
        </>
    );
};

export default Meanings;