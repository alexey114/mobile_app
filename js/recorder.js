//Запись звука

const URL = 'voice.php';

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);

        document.querySelector('#start').addEventListener('click', function () {
            mediaRecorder.start();
            console.log("start")
        });

        let audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", function (event) {
            audioChunks.push(event.data);
        });

        document.querySelector('#stop').addEventListener('click', function () {
            mediaRecorder.stop();
            console.log("stop")
        });

        mediaRecorder.addEventListener("stop", function () {
            const audioBlob = new Blob(audioChunks, {
                type: 'audio/wav'
            });
            console.log("save wav")

            let fd = new FormData();
            fd.append('voice', audioBlob);
            sendVoice(fd);
            audioChunks = [];
        });
    });

async function sendVoice(fd) {
    let promise = await fetch(URL, {
        method: 'POST',
        body: fd
    });
    if (promise.ok) {
        let response = await promise.json();
        console.log(response.data);
        let audio = document.createElement('audio');
        audio.src = response.data;
        audio.controls = true;
        audio.autoplay = true;
        document.querySelector('#files').appendChild(audio);
    }
    console.log(promise);
}

//Возникли проблемы с обработкой запроса обратного. В итоге запись звука и видео производится непосредствено через JS.