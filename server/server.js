const express = require('express');
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');
const port = process.env.PORT || 5000;

MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then((client) => {
    const db = client.db('snakes_and_ladders');
    const taskCollection = db.collection('tasks');
    const taskRouter = createRouter(taskCollection);
    app.use(('/api/tasks'), taskRouter);
    const taskCollection2 = db.collection('actions');
    const taskRouter2 = createRouter(taskCollection2);
    app.use(('/api/actions'), taskRouter2);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, function() {
    console.log(`Server is now running`);
});