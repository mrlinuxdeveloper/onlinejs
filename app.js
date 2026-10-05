const DB = require('./DB');
const router = require('./router/blogRoutes');
const express = require('express')
const {blogIndex, blogShow, blogCrerate} = require("./controller/blogController");


// epp
const app = express()


// midell waer
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))



// route
app.get('/',(req, res)=>{
    res.render('index');
})
router.get('/blog',blogIndex)
router.get('/blog/:id',blogCrerate)
router.get('/blog/:id',blogShow)
router

app.get('/about',(req, res)=>{
    res.render('about')
})

app.use((req, res) => {
    res.status(404).send("Not Found");
})

DB(app);