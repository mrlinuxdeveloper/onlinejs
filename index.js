const express = require('express');
const app = express();
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const Blog = require("./models/blogs");
const DB =require('./DB')

const blogRoutes = require("./router/blogRoutes");


//for select engine view
app.set("view engine", "ejs");



//middle ware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Route
app.use(blogRoutes);

app.get("/", (req, res) => {
    Blog.find()
        .then((result) => {
            res.render("index", {
                title: "home",
                blog: result
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error loading blogs");
        });
});

app.get("/about", (req, res) => {
    res.render("about",);
})
app.get("/nav", (req, res) => {
    res.render("nav",);
})
app.use((req, res) => {
    res.status(404).render("404",);
})
// app.listen(3000, "localhost", () => {
//     console.log("server is listening on port 3000 ...");
// });

//for connect ot database mongodb
DB(app);
//for run listening port
// app.listen(3000);