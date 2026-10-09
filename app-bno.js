// Referencias a los elementos del DOM
const video = document.getElementById('webcam');
const videoContainer = document.getElementById('videoContainer');
const canvas = document.getElementById('canvas');
const previewContainer = document.getElementById('previewContainer');
const btnTomarFoto = document.getElementById('btnTomarFoto');
const btnRepetir = document.getElementById('btnRepetir');
const btnConfirmar = document.getElementById('btnConfirmar');

let streamCamara = null;

// 1. Solicitar acceso a la Webcam con resolución optimizada
async function iniciarCamara() {
    try {
        const constraints = {
            video: { 
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                facingMode: "user" // Cambiar a "environment" si prefieres usar la cámara trasera por defecto
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

// 2. Capturar la foto y alternar contenedores
btnTomarFoto.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const contexto = canvas.getContext('2d');
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Ocultar la cámara en directo y mostrar exclusivamente la vista previa
    videoContainer.classList.add('hidden');
    previewContainer.classList.remove('hidden');

    // Cambiar visibilidad de los botones
    btnTomarFoto.classList.add('hidden');
    btnRepetir.classList.remove('hidden');
    btnConfirmar.classList.remove('hidden');
});

// 3. Repetir la foto (volver a la cámara en directo)
btnRepetir.addEventListener('click', () => {
    previewContainer.classList.add('hidden');
    videoContainer.classList.remove('hidden');

    btnTomarFoto.classList.remove('hidden');
    btnRepetir.classList.add('hidden');
    btnConfirmar.classList.add('hidden');
});

// 4. Confirmar y descargar la foto localmente
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
    
    // Volver automáticamente a la cámara para tomar otra si se desea
    btnRepetir.click();
});

// Arrancar la cámara automáticamente al cargar la página
iniciarCamara();