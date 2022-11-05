const axios = require('axios');
require('dotenv').config();
const models = require('../database/models');

exports.uploadInsta = (data) => {
    try {




        const mediaUrl = prosess.env.MEDIA_URL;
        const publishUrl = prosess.env.PUBLISH_URL;
        const logoImage = prosess.env.LOGO_IMAGE;
        const token = prosess.env.TOKEN;
        let caption = "Test"
        let mediaId = null;
        let mdurl = mediaUrl + "?image_url=" + image_url + "&caption=" + caption + "&access_token=" + access_token;
        models.Board.findOne({
            attributes: ['contents'],
            where: {boardCode: data}
        }).then((result) => {
            caption = result.contents;
        })
        axios.post(mdurl)
            .then((res) => {
                mediaId = res.data.id;
            })
            .catch((err) => {
                console.error(err);
            })
        let pburl = publishUrl + "?creation_id=" + mediaId + "&access_token=" + access_token;
        axios.post(pburl)
            .then(() => console.log(`success`))
            .catch((err) => {
                console.error(err);
            })


    } catch (err) {
        console.log(err);
    }
}


