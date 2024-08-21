const express = require("express");
const fs = require("fs");

const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/users", (req, res) => {
  const data = fs.readFileSync("./users.json", { encoding: "utf8" });
  const obData = JSON.parse(data);
  console.log("DATA", data);
  res.status(200).json({ users: obData.employees });
});

app.post("/users", (req, res) => {
  console.log("BODY", req.body);

  const data = fs.readFileSync("./users.json", { encoding: "utf8" });
  const { users } = JSON.parse(data);
  const newUser = {
    id: `${users.length + 1}`,
    name: req.body.name,
    age: req.body.age,
  };
  users.push(newUser);
  fs.writeFileSync("./users.json", JSON.stringify({ users }));
  res.status(201).json({ name: newUser });
});

app.put("/users/:userId", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const data = fs.readFileSync("./users.json", { encoding: "utf8" });
  const { users } = JSON.parse(data);
  const findIndex = users.findIndex((users) => users.id === req.params.userId);
  if (findIndex > -1) {
    users[findIndex].name = req.body.name;
    fs.writeFileSync("./users.json", JSON.stringify({ users }));
    res.status(200).json({ user: users[findIndex] });
  } else {
    res.status(400).json({ messege: "Not found user ID" });
  }
});

app.delete("/users/:id", (req, res) => {
  const data = fs.readFileSync("./users.json", { encoding: "utf8" });
  const { users } = JSON.parse(data);
  const findIndex = users.findIndex((users) => users.id === req.params.id);
  if (findIndex > -1) {
    const deletUser = users.splice(findIndex, 1);
    fs.writeFileSync("./users.json", JSON.stringify({ users }));
    res.status(200).json({ user: deletUser[0] });
  } else {
    res.status(400).json({ messege: "Not found user ID" });
  }
});

app.listen(8000, () => {
  console.log("Server is running at localhost:8000");
});
