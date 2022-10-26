const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../database/models');
const { isLoggedIn, isNotLoggedIn, isManager} = require('./isLogined');

router.get('/',async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            }
        ],
        where : {allowBoard : true},
        order: [['boardCode', 'ASC']],
    }).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})

router.post('/',isLoggedIn,async (req, res, next) => {
    //console.log(req);
    models.Board.create({
        title : req.body.title,
        contents : req.body.contents,
        allowBoard : req.body.allowBoard,
        Usercode: req.user.code,
        isAnonymous: req.body.isAnonymous
    }).then(() => {
        return  res.status(200).send('Success');
    }).catch((err) => {
        //console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.delete('/',isLoggedIn,async (req, res, next) => {
    models.Board.destroy({
        where: {boardCode: req.body.boardCode}
    }).then(() => {
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.post('/update',isLoggedIn,async (req, res, next) => {
    models.Board.update({
        allowBoard : req.body.allowBoard,
    },{
        where: {boardCode: req.body.boardCode}
    }).then(() => {
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.get('/manage',isManager,async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            }
        ],
        where : {allowBoard : false},
        order: [['boardCode', 'ASC']],
    }).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})


module.exports = router;