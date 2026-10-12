const mongoose = require('mongoose');
const Blog = require('../models/blogs');

async function blogHome(req, res, next) {
    try {
        const blog = await Blog.find().sort({ createdAt: -1 });
        res.render('index', { blog });
    } catch (error) {
        console.error('Unable to load news:', error.message);
        res.status(503).render('index', { blog: [], dbUnavailable: true });
    }
}

function blogIndex(req, res) { res.render('addblog'); }

async function blogCreate(req, res, next) {
    const title = (req.body.title || '').trim();
    const content = (req.body.content || '').trim();
    if (!title || !content) return res.status(400).render('addblog', { error: 'عنوان و متن خبر را وارد کنید.', values: { title, content } });
    try {
        const blog = await Blog.create({ title, content });
        res.redirect(`/blog/${blog.id}`);
    } catch (error) {
        console.error('Unable to create news:', error.message);
        res.status(503).render('addblog', {
            error: 'خبر ذخیره نشد؛ ارتباط با پایگاه داده برقرار نیست. کمی بعد دوباره تلاش کنید.',
            values: { title, content }
        });
    }
}

async function blogShow(req, res, next) {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('404');
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).render('404');
        res.render('editblog', { blog, error: null });
    } catch (error) { next(error); }
}

async function blogShowDitail(req, res, next) {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('404');
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).render('404');
        res.render('blogditail', { blog });
    } catch (error) { next(error); }
}

async function blogUpdate(req, res, next) {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('404');
    const title = (req.body.title || '').trim();
    const content = (req.body.content || '').trim();
    if (!title || !content) {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).render('404');
        return res.status(400).render('editblog', { blog: { ...blog.toObject(), title, content }, error: 'عنوان و متن خبر نمی‌توانند خالی باشند.' });
    }
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true, runValidators: true });
        if (!blog) return res.status(404).render('404');
        res.redirect(`/blog/${blog.id}`);
    } catch (error) {
        console.error('Unable to update news:', error.message);
        res.status(503).render('editblog', { blog: { _id: req.params.id, title, content }, error: 'ارتباط با پایگاه داده برقرار نیست؛ تغییرها ذخیره نشدند.' });
    }
}

async function blogDelete(req, res, next) {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).render('404');
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).render('404');
        res.redirect('/');
    } catch (error) { next(error); }
}

module.exports = { blogHome, blogIndex, blogCreate, blogShow, blogUpdate, blogDelete, blogShowDitail };
