const express = require('express');
const router = require("../router/blogRoutes");
const Blog = require("../models/blogs");

//index
function blogIndex(req, res) {
    res.render("addblog");
}
//create
function blogCrerate(req, res) {
    console.log(req.body);
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content
    });
        blog.save()
            .then(() => {
                res.redirect('/');
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send("Error saving blog");
            });
}
//show
function blogShow(req, res) {
    let id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render("editblog", {
                title: "Edit Blog",
                blog: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error loading blog");
        });
}
// showDitail
function blogShowDitail(req, res) {
    let id = req.params.id;
    Blog.findById(id)
        .then(result => {
            if(!result){
                return res.status(404).send("No blog found");
            }
            res.render("blogditail", {title : result.title, blog : result});
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error deleting blog");
        })
}
// update
// async function blogUpdate(req, res) {
//     try {
//         const id = req.params.id;
//
//         const blog = await Blog.findById(id);
//
//         if (!blog) {
//             return res.status(404).send("Blog not found");
//         }
//
//         await Blog.findByIdAndUpdate(id, {
//             title: req.body.title ?? blog.title,
//             content: req.body.content ?? blog.content
//         });
//
//         res.redirect("/");
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Error updating blog");
//     }
// }
// for change field item if user changed it
function blogUpdate(req, res) {
    const id = req.params.id;

    const updateData = {};

    if (req.body.title && req.body.title.trim() !== "") {
        updateData.title = req.body.title;
    }

    if (req.body.content && req.body.content.trim() !== "") {
        updateData.content = req.body.content;
    }

    Blog.findByIdAndUpdate(
        id,
        updateData,
        {
            returnDocument: 'after',
            runValidators: true
        }
    )
        .then((blog) => {
            if (!blog) {
                return res.status(404).send("Blog not found");
            }

            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error updating blog");
        });
}
//delete
function blogDelete(req, res) {
    let id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error deleting blog");
        })
}

module.exports = {
    blogIndex,
    blogCrerate,
    blogShow,
    blogUpdate,
    blogDelete,
    blogShowDitail
};
