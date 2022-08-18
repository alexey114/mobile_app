//Функции браузера

// GPS
function callGPS() {
    let optionsGPS = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }

    function success(pos) {
        let crd = pos.coords;

        alert(`Ваше текущее местоположение:
                    Широта: ${crd.latitude},
                    Долгота: ${crd.longitude},
                    Плюс-минус ${crd.accuracy} метров.`,
        );
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        alert('Ваше текущее местоположение не определено');
    };

    navigator.geolocation.getCurrentPosition(success, error, optionsGPS);
}

// Уведомления

function callNotification() {
    const publicVapidKey = 'BIwYFIYGM0i9ZVjI970U-1oNH_s6q0t5n52S3ZQNtG16rYD06TXKcJJfUPX6e1gcS4W07pyUuBfxHufsyBThxBA'

    //NoteBook
    // Public Key:
    // BIwYFIYGM0i9ZVjI970U-1oNH_s6q0t5n52S3ZQNtG16rYD06TXKcJJfUPX6e1gcS4W07pyUuBfxHufsyBThxBA
    
    // Private Key:
    // FncHGrUQM_O-URiy5SwURscHOCj178PaIZCEYRvB0EI

    //PC
    //const publicVapidKey = 'BCBzqbESsxJXV_4FZXpttHZYCHVadkY8qkmjqWQOcFffRYaAX5Qfu4ABWy1E4k7lRmPQLvDXI14ZJasUAmAEQik'

    //check for service worker
    if ('serviceWorker' in navigator) {
        send().catch(err => console.log(err))
    }
    //register SW, registar push, send push
    async function send() {
        console.log('Registerin service worker...')
        const register = await navigator.serviceWorker.register('/worker.js', {
            scope: '../'
        })
        console.log('Service Worker Registered...')

        //register push
        console.log('Registerin service worker...')
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        })
        console.log('Push Registered...')

        //send push notification
        console.log('Sending Push...')
        await fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        })
        console.log('Push Send ...')
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4)
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/')

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length)

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

    //Запись камеры
    //Включение фонарика
    //Позвонить

//Функции мобильного

    //GPS
    //Уведомление
    //Запись звука
    //Запись камеры
    //Включение фонарика
    //Позвонить

//Функции мобильного браузера

    //GPS
    //Уведомление
    //Запись звука
    //Запись камеры
    //Включение фонарика
    //Позвонить