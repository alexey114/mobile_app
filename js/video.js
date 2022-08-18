let preview = document.getElementById("preview");
let recording = document.getElementById("recording");
let startButton = document.getElementById("startButton");
let stopButton = document.getElementById("stopButton");
let downloadButton = document.getElementById("downloadButton");
let logElement = document.getElementById("log");

let recordingTimeMS = 5000;

//используется для вывода текстовых строк в <div>
function log(msg) {
    logElement.innerHTML += msg + "\n";
}

//возвращает новое значение Promise, которое разрешается по истечении указанного количества миллисекунд
function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}

//MediaStream для записи и продолжительность записи в миллисекундах
function startRecording(stream, lengthInMS) {

    //MediaRecorderкоторый будет обрабатывать запись ввода stream
    let recorder = new MediaRecorder(stream);
    //Создает пустой массив, data который будет использоваться для хранения Blobмультимедийных данных, предоставленных нашему ondataavailableобработчику событий
    let data = [];
  
    //Настраивает обработчик dataavailableсобытия. dataСвойство полученного события Blobсодержит медиаданные. Обработчик событий просто помещает Blob в data массив
    recorder.ondataavailable = event => data.push(event.data);
    //Запускает процесс записи вызовом recorder.start(), и выводит сообщение в журнал с обновленным состоянием регистратора и количеством секунд, в течение которых он будет вести запись
    recorder.start();
    log(recorder.state + " for " + (lengthInMS/1000) + " seconds...");
  
    //Создает новый Promise, named stopped, который разрешается при вызове обработчика событий (en-US)MediaRecorder и отклоняется, если вызывается его обработчик событий. Обработчик отклонения получает на вход название возникшей ошибки-onstop\onerror
    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = event => reject(event.name);
    });
  
    //Создает новый объект с Promiseименем recorded, который разрешается по истечении заданного количества миллисекунд. После разрешения он останавливается, MediaRecorderесли он записывает
    let recorded = wait(lengthInMS).then(
      () => recorder.state == "recording" && recorder.stop()
    );
  
    //Эти строки создают новый Promise, который выполняется, когда оба Promises ( stoppedи recorded) разрешены. Как только это разрешается, данные массива возвращаются startRecording()вызывающей стороне
    return Promise.all([
      stopped,
      recorded
    ])
    .then(() => data);
  }

  function stop(stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  startButton.addEventListener("click", function() {

    let checkboxVideo = document.getElementById("checkboxVideo").checked
    //navigator.mediaDevices.getUserMedia() (en-US) вызывается для запроса новогоMediaStreamфайла с видео- и аудиодорожками. Это поток, который мы будем записывать
    
    navigator.mediaDevices.getUserMedia({
      video: checkboxVideo,
      audio: true
    })
      //Когда Promise, возвращаемый методом getUserMedia(), разрешается, свойство <video>элемента предварительного просмотра srcObject (en-US) устанавливается как входной поток, что приводит к тому, что видео, снятое камерой пользователя, отображается в поле предварительного просмотра. Поскольку <video>элемент отключен, звук воспроизводиться не будет. Ссылка кнопки «Загрузить» также устанавливается для ссылки на поток. Затем, в строке 8, мы организуем preview.captureStream()вызов preview.mozCaptureStream(), чтобы наш код работал в Firefox, в котором MediaRecorder.captureStream()метод имеет префикс. Затем создается и возвращается новый Promise, который разрешается, когда начинается воспроизведение видео предварительного просмотра.
    .then(stream => {
      preview.srcObject = stream;
      downloadButton.href = stream;
      preview.captureStream = preview.captureStream || preview.mozCaptureStream;
      return new Promise(resolve => preview.onplaying = resolve);

      //Когда видео предварительного просмотра начинает воспроизводиться, мы знаем, что есть носитель для записи, поэтому мы отвечаем, вызывая startRecording()функцию, которую мы создали ранее, передавая поток видео предварительного просмотра (в качестве исходного медиа для записи) и recordingTimeMSколичество миллисекунд медиа для записи. записывать. Как упоминалось ранее, startRecording()возвращает a Promise, обработчик разрешения которого вызывается (получая в качестве входных данных массив Blobобъектов, содержащих фрагменты записанных мультимедийных данных) после завершения записи.
    }).then(() => startRecording(preview.captureStream(), recordingTimeMS))

    // Обработчик разрешения процесса записи получает в качестве входных данных массив медиаданных, Blob локально известный как recordedChunks. Первое, что мы делаем, — это объединяем куски в один Blob, чей MIME-тип имеет "video/webm"значение, используя тот факт, что Blob()конструктор объединяет массивы объектов в один объект. Затем URL.createObjectURL()используется для создания URL-адреса, который ссылается на большой двоичный объект; затем это становится значением src атрибута элемента воспроизведения записанного видео (чтобы вы могли воспроизводить видео из большого двоичного объекта), а также целью ссылки кнопки загрузки.download Затем устанавливается атрибут кнопки загрузки . Хотя download атрибут может быть логическим значением, вы также можете установить его в виде строки, чтобы использовать ее в качестве имени загруженного файла. Таким образом, установив для download атрибута ссылки для скачивания значение «RecordedVideo.webm», мы сообщаем браузеру, что нажатие на кнопку должно загрузить файл с именем "RecordedVideo.webm", содержимым которого является записанное видео

    .then (recordedChunks => {
      let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
      console.log('recordedBlob', recordedBlob)
      console.log('recordedChunks', recordedChunks)
      recording.src = URL.createObjectURL(recordedBlob);
      downloadButton.href = recording.src;
      downloadButton.download = "RecordedVideo.webm";
      
      //Размер и тип записанного носителя выводятся в область журнала под двумя видео и кнопкой загрузки.
      log("Successfully recorded " + recordedBlob.size + " bytes of " +
          recordedBlob.type + " media.");
    })

    //Для catch()всех Promises выводит ошибку в область ведения журнала, вызывая нашу log()функцию.
    .catch(log);
  }, false);

  stopButton.addEventListener("click", function() {
    stop(preview.srcObject);
  }, false);