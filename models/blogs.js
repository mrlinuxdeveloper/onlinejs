const mongoose = require('mongoose');
const  Blogs  = mongoose.Schema;

const blogSchema = new Blogs({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    }

},{timestamps:true, bufferCommands:false});
const Blog = mongoose.model('Blogs', blogSchema);
module.exports = Blog;

// const mongoose = require('mongoose');
//
// const blogSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true,
//             trim: true
//         },
//
//         content: {
//             type: String,
//             required: true
//         }
//     },
//     {
//         timestamps: true
//     }
// );
//
// const Blog = mongoose.model('Blog', blogSchema);
//
// module.exports = Blog;
