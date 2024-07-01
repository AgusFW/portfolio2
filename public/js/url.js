// Obtener los botones
const btnEspañol = document.getElementById('btn-espanol');
const btnEnglish = document.getElementById('btn-english');

// Agregar eventos de clic
btnEspañol.addEventListener('click', function (event) {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.pathname = '/espanol';
    window.location.href = url.href;
});

btnEnglish.addEventListener('click', function (event) {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.pathname = '/english';
    window.location.href = url.href;
});