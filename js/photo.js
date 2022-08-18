// Получаем доступ к камере
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Не включаем аудио опцией `{ audio: true }` поскольку сейчас мы работаем только с изображениями
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.srcObject = stream;
        video.play();
    });
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var video = document.getElementById('photo');

// Обработчик события нажатия на кнопку "Сделать снимок"
document.getElementById("snap").addEventListener("click", function() {
	context.drawImage(video, 0, 0, 160, 120);
});