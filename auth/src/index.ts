import express from "express";

const app = express();

app.use(express.json());

app.get("/api/users/currentuser", (req, res) => {
  res.send("hI Here!");
});

app.listen(3000, () => console.log("listen on 3000!"));
