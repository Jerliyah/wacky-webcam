/* ====== DOM Grab ====== */
const player = document.querySelector('video');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const snaps_ctn = document.querySelector('div#snaps-ctn');
const snap_btn = document.querySelector('button#snap');
const filters = Array.from( document.querySelectorAll('div#filters > button') );



/* ====== Variables ====== */
var snap_count = 1;
var painting;



/* ====== Functions ====== */
function filter_red(pixels) {
    for(let i=0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50;  // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
    }

    return pixels
}

function filter_green(pixels) {
    for(let i=0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] * 0.5; // red
        pixels.data[i + 1] = pixels.data[i + 1] + 100; // green
        pixels.data[i + 2] = pixels.data[i + 2] - 50;  // blue
    }

    return pixels
}

function filter_blue(pixels) {
    for(let i=0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] = pixels.data[i + 0] - 50;   // red
        pixels.data[i + 1] = pixels.data[i + 1] * 0.5;  // green
        pixels.data[i + 2] = pixels.data[i + 2] + 100;  // blue
    }

    return pixels
}

function filter_surreal(pixels) {
    for(let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // red
        pixels.data[i + 100] = pixels.data[i + 1]; // green
        pixels.data[i - 150] = pixels.data[i + 2]; // blue
      }
    return pixels;
}


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
    clearInterval(painting)


    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;

    let filter = this.dataset.filter || null;

    painting = setInterval( () => {
        context.drawImage(player, 0, 0, canvas.width, canvas.height)

        if( filter ) {
            let pixels = context.getImageData(0, 0, canvas.width, canvas.height);

            var filtered_pixels = (() => {
                // Would be nice if this could be dynamic function calls
                switch( filter ) {
                    case 'red':     return filter_red(pixels)
                    case 'green':   return filter_green(pixels)
                    case 'blue':    return filter_blue(pixels)
                    case 'surreal': return filter_surreal(pixels)
                    default: return pixels
                }
            })()

            context.putImageData(filtered_pixels, 0, 0);
            // console.log(filtered_pixels)
        }

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

filters.forEach( (filter) => filter.addEventListener('click', paint_canvas) )


