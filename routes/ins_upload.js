const axios = require('axios');

const mediaUrl = "https://graph.facebook.com/v15.0/17841455266680504/media"
const publishUrl = "https://graph.facebook.com/v15.0/17841455266680504/media_publish"
const logoImage = "https://ifh.cc/g/Vt7g4L.png"
const token = "EAAVNoRY1CQcBAKNU3NlTLRvZAVWH0DPXraX83ZBdPONVUIIYWiTQBJidFZALyM2AZCofj2t9Bh4sQeOr6IFolWOZBGZBxkwpZCuM1oIGXxECV7qjzAh75LaZCslZCRiHWBHzfCfN7p7YKCz0EIpw2MoTqVSzksucdVcwNTJ6CKjOfChNlLBnEV5JTY1cht8ZCXlmIx243hFCrMZBLZAAbjL1XAnc7oZC9ZBb28IGZAHZCQudZAIm9FUMbatsX6Ls48KfBO4yZBTI0ZD"


let publishContent = `${publishUrl}
    ?creation_id={}
    &access_token=${token}`

const containerCreate = {
    image_url: 'https://ifh.cc/g/Vt7g4L.png',
    caption: 'test',
    access_token: token
};
let mediaId = null;
let mdurl = mediaUrl + "?image_url=" + containerCreate.image_url + "&caption=" + containerCreate.caption + "&access_token=" + containerCreate.access_token;


axios.post(mdurl)
    .then( (response) => {
        mediaId = response.data.id;
    }).then(()=>{
    let pburl = publishUrl + "?creation_id=" + mediaId + "&access_token=" + containerCreate.access_token;
    axios.post(pburl).then((response) => {
        console.log(`success`);
    })
})