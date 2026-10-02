
const express = require("express");
const blogController = require("../controller/blogController");
const router = express.Router();

// index
router.get('/addblog',blogController.blogIndex)
// create
router.post("/addblog", blogController.blogCrerate)
// edit blog
router.get('/editblog/:id', blogController.blogShow);
// update
router.post('/editblog/:id', blogController.blogUpdate);
// delete blog
router.post('/deleteblog/:id',blogController.blogDelete)
// show ditail
router.get('/blogditail/:id',blogController.blogShowDitail)

module.exports = router;