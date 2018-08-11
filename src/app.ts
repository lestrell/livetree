import express from "express";
import helmet from "helmet";

export const app = express();
app.use(helmet());

const clientDist = __dirname + "/../client/dist";
app.use(express.static(clientDist));

app.get("*", (req, res) => res.sendFile("index.html", { root: clientDist }));
