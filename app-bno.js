// Referencias a los elementos del DOM
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const btnTomarFoto = document.getElementById('btnTomarFoto');
const btnRepetir = document.getElementById('btnRepetir');
const btnConfirmar = document.getElementById('btnConfirmar');
const previewContainer = document.getElementById('previewContainer');

let streamCamara = null;

// 1. Solicitar acceso a la Webcam adaptado a formato vertical en móviles
async function iniciarCamara() {
    try {
        const constraints = {
            video: { 
                width: { ideal: 720 },
                height: { ideal: 1280 },
                facingMode: "user" // Usa "environment" si prefieres que abra la cámara trasera por defecto
            }, 
            audio: false 
        };

        streamCamara = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = streamCamara;
    } catch (error) {
        alert("No se pudo acceder a la cámara. Asegúrate de dar los permisos correspondientes.");
        console.error("Error al acceder a la webcam:", error);
    }
}

// 2. Capturar la foto adaptada al visor vertical
btnTomarFoto.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const contexto = canvas.getContext('2d');
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    video.parentElement.classList.add('hidden');
    previewContainer.classList.remove('hidden');

    btnTomarFoto.classList.add('hidden');
    btnRepetir.classList.remove('hidden');
    btnConfirmar.classList.remove('hidden');
});

// 3. Repetir la foto
btnRepetir.addEventListener('click', () => {
    video.parentElement.classList.remove('hidden');
    previewContainer.classList.add('hidden');

    btnTomarFoto.classList.remove('hidden');
    btnRepetir.classList.add('hidden');
    btnConfirmar.classList.add('hidden');
});

// 4. Confirmar y guardar la foto en el ordenador o móvil
btnConfirmar.addEventListener('click', () => {
    const imagenURL = canvas.toDataURL('image/png');

    const enlaceTemporal = document.createElement('a');
    enlaceTemporal.href = imagenURL;
    
    const fechaHora = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    enlaceTemporal.download = `captura_documento_${fechaHora}.png`;

    document.body.appendChild(enlaceTemporal);
    enlaceTemporal.click();
    document.body.removeChild(enlaceTemporal);

    alert("¡Foto confirmada y guardada con éxito!");
    btnRepetir.click();
});

// Arrancar la cámara automáticamente al cargar la página
iniciarCamara();