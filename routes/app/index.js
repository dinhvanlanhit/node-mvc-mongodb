'use strict'
const express = require('express')
const router = express.Router()
router.get('/', (req, res) => { 
    res.cookie('lang', 'en', { maxAge: 900000 });
    res.render("welcome") 
}) // api status
module.exports = router
