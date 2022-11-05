const axios = require('axios');
require('dotenv').config();
const models = require('../database/models');

exports.uploadInsta = async (data) => {
    try {


        const mediaUrl = process.env.MEDIA_URL;
        const publishUrl = process.env.PUBLISH_URL;
        const logoImage = process.env.LOGO_IMAGE;
        const token = process.env.INS_TOKEN;
        let caption = "Test"
        let mediaId = null;
        let mdurl = mediaUrl + "?image_url=" + logoImage + "&caption=" + caption + "&access_token=" + token;
        let pburl = `${publishUrl}?creation_id=${null}&access_token=${token}`;
        models.Board.findOne({
            attributes: ['contents'],
            where: {boardCode: data}
        }).then((result) => {
            caption = result.contents;
        })


            axios.post(mdurl)
                .then((res) => {
                    console.log(res.data.id);
                    pburl = `${publishUrl}?creation_id=${res.data.id}&access_token=${token}`;
                })
                .catch((err) => {
                    console.error(err);
                }).then(() => {


                axios.post(pburl)
                    .then(() => console.log(`success`))
                    .catch((err) => {
                        console.error(err);
                    })
            })


    } catch (err) {
        console.log(err);
    }
}


