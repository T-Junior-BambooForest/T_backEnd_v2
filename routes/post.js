const express = require('express');
const router = express.Router();
const axios = require('axios');
const models = require('../database/models');
const { auth,authManage } = require('./isLogined');
const { uploadInsta } = require('./ins_upload');
const {uploadFacebk} = require("./fbk_upload");
const multer = require("multer")
const path = require("path");;
const fs = require('fs');
console.log(path.join(__dirname,'routes','test.json'))
let df = fs.readFileSync(path.join(__dirname,'test.json')).toString();
router.get('/',async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            },
            {
                model: models.AllowBoard,
                attributes: ['AllowBoardCode'],
            }
        ],
        order: [[models.AllowBoard,'AllowBoardCode', 'ASC']],
        where: {allowBoard: true}
    }).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        return res.json(result.reverse());
    }).catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    })
})


router.post('/',auth,async (req, res, next) => {
    //console.log(req);
    let {Usercode,isAnonymous,contents,Image} = req.body;
    let name;
    df = fs.readFileSync(path.join(__dirname,'test.json')).toString();
    models.Users.findByPk(Usercode).then((result) => {
        result = JSON.parse(JSON.stringify(result));
        name = result.name;
        console.log(name);
        let test = {contents,Usercode,name};
        let a = JSON.parse(df);
        a.push(test);
        a = JSON.stringify(a);
        fs.writeFileSync(path.join(__dirname,'test.json'),a);


    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })

    if(isAnonymous == true){
        Usercode = -1;
    }
    models.Board.create({
        contents : contents,
        allowBoard: false,
        userCode: Usercode,
        isAnonymous: isAnonymous,
        Image: Image
    }).then((result) => {
        //console.log(result);
        let boardCode = (result.dataValues.boardCode).toString();
        console.log(boardCode);
       //    console.log(JSON.parse(JSON.stringify(result));)
        ImageUp(req,res, boardCode);
        return  res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
})
function ImageUp(req,res,boardCode){
    try {

        let file = req.body.Image;
        let fileName;
        if (file != file.replace(/^data:image\/png;base64,/, "")) {
             fileName =path.join( __dirname , "../Image", `${boardCode}.png`);
            file = file.replace(/^data:image\/png;base64,/, "");
        }
        else if (file != file.replace(/^data:image\/jpeg;base64,/, "")) {
             fileName = path.join( __dirname ,"../Image", `${boardCode}.png`);
            file = file.replace(/^data:image\/jpeg;base64,/, "");
        }
        else if (file != file.replace(/^data:image\/jpg;base64,/, "")) {
             fileName =path.join( __dirname ,"../Image", `${boardCode}.png`);
            file = file.replace(/^data:image\/jpg;base64,/, "");
        }
        else{
            throw new Error("이미지가 아닙니다.");
            return;
        }
        fs.writeFileSync(fileName, file, "base64");
    } catch (error) {
        console.log(error);
    }

}


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
    }).catch(err => {
        console.error(err);
        return res.status(500).send('Server Error');
    })
    models.AllowBoard.create({
        boardCode : req.body.boardCode,
        }).then((data) => {
        uploadInsta(req.body.boardCode);
        uploadFacebk(req.body.boardCode);

        //console.log(data);
        return res.status(200).send('Success');
    }).catch((err) => {
        console.error(err);
        return res.status(500).send('Server Error');
    });
    // insUpload.insAPI();
})

router.get('/manage',authManage,async (req, res, next) => {
    models.Board.findAll({
        include: [
            {
                model: models.Users,
                attributes: ['code', 'name', 'nickname'],
            },{
                model: models.AllowBoard,
                attributes: ['AllowBoardCode'],
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