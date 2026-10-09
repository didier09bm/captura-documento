// Referencias a los elementos del DOM
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const btnTomarFoto = document.getElementById('btnTomarFoto');
const btnRepetir = document.getElementById('btnRepetir');
const btnConfirmar = document.getElementById('btnConfirmar');
const previewContainer = document.getElementById('previewContainer');

let streamCamara = null;

// 1. Solicitar acceso a la Webcam con permisos del navegador
async function iniciarCamara() {
    try {
        streamCamara = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: false 
        });
        video.srcObject = streamCamara;
    } catch (error) {
        alert("No se pudo acceder a la cámara. Asegúrate de dar los permisos correspondientes.");
        console.error("Error al acceder a la webcam:", error);
    }
}

// 2. Capturar la foto
btnTomarFoto.addEventListener('click', () => {
    // Definimos el tamaño del canvas igual al video real
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujamos el fotograma actual del video dentro del canvas
    const contexto = canvas.getContext('2d');
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Ocultamos el vídeo y mostramos la vista previa con el canvas
    video.parentElement.classList.add('hidden');
    previewContainer.classList.remove('hidden');

    // Cambiamos botones
    btnTomarFoto.classList.add('hidden');
    btnRepetir.classList.remove('hidden');
    btnConfirmar.classList.remove('hidden');
});

// 3. Repetir la foto
btnRepetir.addEventListener('click', () => {
    // Volvemos a mostrar la cámara en vivo y ocultamos la vista previa
    video.parentElement.classList.remove('hidden');
    previewContainer.classList.add('hidden');

    // Restablecemos los botones
    btnTomarFoto.classList.remove('hidden');
    btnRepetir.classList.add('hidden');
    btnConfirmar.classList.add('hidden');
});

// 4. Confirmar y guardar la foto en el ordenador
btnConfirmar.addEventListener('click', () => {
    // Convertimos el contenido del canvas a una URL de datos en formato PNG
    const imagenURL = canvas.toDataURL('image/png');

    // Creamos un elemento enlace temporal invisible
    const enlaceTemporal = document.createElement('a');
    enlaceTemporal.href = imagenURL;
    
    // Asignamos un nombre único al archivo basado en la fecha y hora actual
    const fechaHora = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    enlaceTemporal.download = `captura_documento_${fechaHora}.png`;

    // Añadimos el enlace al documento, simulamos el clic para descargar y lo removemos
    document.body.appendChild(enlaceTemporal);
    enlaceTemporal.click();
    document.body.removeChild(enlaceTemporal);

    alert("¡Foto confirmada y guardada con éxito en tu ordenador!");
    
    // Opcional: Reiniciar la app para tomar otra foto si se desea
    btnRepetir.click();
});

// Arrancar la cámara automáticamente al cargar la página
iniciarCamara();