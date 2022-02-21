const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('post_list');
})

router.get('/create', (req, res) => {
    res.render('post_form');
})



module.exports = router;