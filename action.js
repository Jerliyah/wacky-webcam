/* ====== DOM Grab ====== */
const player = document.querySelector('video');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const snap_btn = document.querySelector('button#snap');
const snaps_ctn = document.querySelector('div#snaps-ctn');


/* ====== Variables ====== */
var snap_count = 1;



/* ====== Functions ====== */
function get_video() {
    navigator.mediaDevices.getUserMedia({video:true, audio:false})
    .then( (media_obj) => {
        console.log(media_obj);
        player.srcObject = media_obj
    })
    .catch( (error) => {
        alert(error + "\n\nThis page needs webcam access to function.\nTry refreshing the page and be sure to allow webcam access through your browser's prompt.")
    })
}


function paint_canvas() {

    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;

    setInterval( () => {
        context.drawImage(player, 0, 0, canvas.width, canvas.height)
    }, 
    16 /* Loop every 16 milliseconds */);
}

function take_snapshot() {
    let img_data_url = canvas.toDataURL('image/jpeg');

    let name = `Snap ${snap_count}`
    snap_count++

    let a = document.createElement('a');
    a.href = img_data_url;
    a.download = name;
    a.innerHTML = `<img src="${img_data_url}"> <p>${name}</p>`

    snaps_ctn.insertAdjacentElement('afterbegin', a)

}





/* ====== Events ====== */
get_video()
player.addEventListener('canplay', paint_canvas)
snap_btn.addEventListener('click', take_snapshot)


