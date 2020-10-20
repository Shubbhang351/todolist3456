const express = require("express");
const kenx = require("knex");
const PORT = process.env.PORT || 5000

const db = kenx({
  client: "pg",
  connection: {
    host: "ec2-35-173-94-156.compute-1.amazonaws.com",
    user: "klnogembilikhe",
    password: "c642200ab0b9af6beb68275bd157c6f054b380fb6b5cb27e83360f9b66466547",
    database: "
df79a5mgc9buav"
  }
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static("public"));

// res.render
app.get("/", (req, res) => {
  db.select("*")
    .from("task")
    .then(data => {
      res.render("index", { todos: data });
    })
    .catch(err => res.status(400).json(err));
});

// create new task
app.post("/addTask", (req, res) => {
  const { textTodo } = req.body;
  db("task")
    .insert({ task: textTodo })
    .returning("*")
    .then(todo => {
      res.redirect("/");
    })
    .catch(err => {
      res.status(400).json({ message: "unable to create a new task" });
    });
});

app.put("/moveTaskDone", (req, res) => {
  const { name, id } = req.body;

  if (name === "todo") {
    db("task")
      .where("id", "=", id)
      .update("status", 1)
      .returning("status")
      .then(task => {res.json(task[0])});
  } else {
    db("task")
      .where("id", "=", id)
      .update("status", 0)
      .returning("status")
      .then(task => {res.json(task[0])});
  }
});

app.listen(PORT, () => console.log("app is running on port 8080"));

