const axios = require('axios');

function uploadInsta(){
    const mediaUrl = "https://graph.facebook.com/v15.0/17841455266680504/media"
    const publishUrl = "https://graph.facebook.com/v15.0/17841455266680504/media_publish"
    const logoImage = "https://ifh.cc/g/Vt7g4L.png"
    const token = "EAAVNoRY1CQcBANLwU5YMoXHIBuz8W06BP96n1OKVt4YiPwW7gnJ5B1c0sC8KYZAy7cfrgJZA6clG99kMH6PAHIzvUo71U1k2170CAwnqAMfS08ktW47c1DZBeNh9gpu1GIgXGxljpA37ZCedIHdG0KxYrwxWpPQMz9L8IPXIwbnDfNPs6k3BtNNZAuGTPZAgA4tCmlt044hw2ZBskW2ZAK7wj44JKfRq9xSjSjZBdQwVCBbPLRc8SZBvMJKeJHl8O8cgEZD"

    const containerCreate = {
        image_url: 'https://ifh.cc/g/Vt7g4L.png',
        caption: 'test',
        access_token: token
    }

    let mediaId = null;
    let mdurl = mediaUrl + "?image_url=" + containerCreate.image_url + "&caption=" + containerCreate.caption + "&access_token=" + containerCreate.access_token;


    axios.post(mdurl)
        .then((res) => {
            mediaId = res.data.id;
        }).then(()=>{
        let pburl = publishUrl + "?creation_id=" + mediaId + "&access_token=" + containerCreate.access_token;
        axios.post(pburl).then(() => {
            console.log(`success`);
        })
    })
}



module.exports.insAPI = uploadInsta();