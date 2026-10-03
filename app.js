const DB = require('./DB');
const router = require('./router/blogRoutes');
const express = require(express)
const app = express()


// midell waer
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))



// route
app.get('/',(req, res)=>{
    res.redirect()
})
