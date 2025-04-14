import express from "express";
import cookieparser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Test successful");
});

app.listen(5580, () => {
  console.log(`Server listening on http://localhost:${5580}`);
});
