const axios = require('axios');
require('dotenv').config();
const models = require('../database/models');

const mediaUrl = process.env.MEDIA_URL;
const publishUrl = process.env.PUBLISH_URL;
const logoImage = process.env.LOGO_IMAGE;
const token = process.env.INS_TOKEN;

let caption = "Test";
let mdurl = null;
let pburl = null;
let userImageUrl = null;
let logoContainer = null;
let userImageContainer = null;
let lastPublishContainer = null;

exports.uploadInsta = async (data) => {
    try {
        models.Board.findOne({
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
            order: [['boardCode', 'ASC']],
            where: {allowBoard: true, boardCode: data}
        }).then((result) => {
            result = JSON.parse(JSON.stringify(result));
            //console.log(result);
            caption = `부산소마고 대나무숲 ${result.AllowBoard.AllowBoardCode}번째 제보\n${result.contents}\n- ${result.User.name}님 제보 -`;
            result.Image == null ? notImage() : isImage(result);
        }).catch((err) => {
            console.error(err);
        })
    } catch (err) {
        console.log(err);
    }

}

async function notImage() {
    mdurl = mediaUrl + "?image_url=" + logoImage + "&caption=" + encodeURI(caption) + "&access_token=" + token;
    axios.post(mdurl)
        .then((res) => {
           // console.log(res.data.id);
            pburl = publishUrl + "?creation_id=" + res.data.id + "&access_token=" + token;
        }).then(() => {
        publish(pburl)
        }).catch((err) => {
            console.error(err);
        })
}


async function isImage(result){
    mdurl = mediaUrl + "?image_url=" + logoImage + "&is_carousel_item=" + "true" + "&access_token=" + token;
    userImageUrl = mediaUrl + "?image_url=" + null + "&is_carousel_item=" + "true" + "&access_token=" + token; // null 부분에 유저 이미지 링크 첨부
    axios.post(mdurl)
        .then((res) => {
            logoContainer = res.data.id;
        }).then(() => {
            axios.post(userImageUrl)
                .then((res) => {
                    userImageContainer = res.data.id;
                }).then(() => {
                    lastPublishContainer = mediaUrl + "?children=" + logoContainer + "," + userImageContainer + "&media_type=" + "CAROUSEL" +  "&caption=" + encodeURI(caption) + "&access_token=" + token;
                    axios.post(lastPublishContainer);
            }).then(() => {
                publish(lastPublishContainer)
            }).catch((err) => {
                console.log(err);
            })
    })
}

async function publish(pburl) {
    axios.post(pburl)
        .then(() => console.log(`success`))
        .catch((err) => {
            console.error(err);
        })
}
