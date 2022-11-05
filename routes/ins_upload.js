const axios = require('axios');

function uploadInsta(){
    const mediaUrl = "https://graph.facebook.com/v15.0/17841455266680504/media"
    const publishUrl = "https://graph.facebook.com/v15.0/17841455266680504/media_publish"
    const logoImage = "https://ifh.cc/g/Vt7g4L.png"
    const token = "EAAVNoRY1CQcBAMX0gIrC3TYUbgWmMptgR33kZCrjZAld1bNcdzgCa4DZA1BRf3mocijtOjvLiIOdeA4ny8DhaDuZAoTfoZAjFTWbnm4qpTMnwbx51ZCgK9D7wic2orTdTm5IQ9MELJyIT9iPjfH2S5rkw3nC2mxegzUoz8OBZCXA8gQpgkrS4cUHWvtiONeQzcurld9G9gjr22tUP5CIPVCZCl0BsnVcd734xql22JQw2QF4uPUXABrcTWZBZACpEFEXYZD"

    const containerCreate = {
        image_url: 'https://ifh.cc/g/Vt7g4L.png',
        caption: 'test',
        access_token: token
    }

    let mediaId = null;
    let mdurl = mediaUrl + "?image_url=" + containerCreate.image_url + "&caption=" + containerCreate.caption + "&access_token=" + containerCreate.access_token;


    try {
        axios.post(mdurl)
            .then((res) => {
                mediaId = res.data.id;
            }).then(()=>{
            let pburl = publishUrl + "?creation_id=" + mediaId + "&access_token=" + containerCreate.access_token;
            axios.post(pburl)
                .then(() => {
                    console.log(`success`);
                })
        })
    } catch(err){
        console.log(err);
    }
}


module.exports.insAPI = uploadInsta();