const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../database/models');
const { instar } = require('./ins_upload.js')
const { auth,authManage } = require('./isLogined');

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
        result = JSON.parse(JSON.stringify(result));
        return senddata(req,res, change(result));
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})
function change (data){
    data = JSON.parse(JSON.stringify(data));
    data.map((i) => {
        if(i.isAnonymous == true){
            i.Usercode = -1;
            i.User.code = -1;
            i.User.name = '익명';
            i.User.nickname = '익명';
        }
    })

    return data;
}

function senddata (req,res,data){
    res.send(data);
}

router.post('/', auth,async (req, res, next) => {
    //console.log(req);
    models.Board.create({
        contents : req.body.contents,
        allowBoard: false,
        Usercode: req.body.Usercode,
        isAnonymous: req.body.isAnonymous
    }).then(() => {
        return  res.status(200).send('Success');
    }).catch((err) => {
        //console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.delete('/',authManage,async (req, res, next) => {
    models.Board.destroy({
        where: {boardCode: req.body.boardCode}
    }).then(() => {
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.post('/update',authManage,async (req, res, next) => {
    models.Board.update({
        allowBoard : true,
    },{
        where: {boardCode: req.body.boardCode}
    }).then(() => {
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})

router.get('/manage',authManage,async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            }
        ],
        order: [['boardCode', 'ASC']],
    }).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})


module.exports = router;