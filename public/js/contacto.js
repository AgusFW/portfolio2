// Inicializar EmailJS
(function () {
    emailjs.init("NE6xGlxHa3krVuyyU");
})();

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    //botón original
    var submitButton = document.getElementById('submit-button');
    var originalButtonContent = submitButton.innerHTML;

    // Cambiar el botón al spinner
    submitButton.innerHTML = '<div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div>';
    submitButton.disabled = true;

    emailjs.sendForm('service_7wxmlra', 'template_bho5vo7', this)
        .then(function () {
            alert('Mensaje enviado correctamente!');
            submitButton.innerHTML = originalButtonContent;
            submitButton.disabled = false;
            document.getElementById('contact-form').reset();
        }, function (error) {
            alert('Error al enviar el mensaje: ' + JSON.stringify(error));
            submitButton.innerHTML = originalButtonContent;
            submitButton.disabled = false;
        });
});
