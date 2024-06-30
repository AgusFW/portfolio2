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
            Swal.fire({
                icon: 'success',
                title: 'Message sent successfully',
                text: 'I will be contacting you shortly'
            });
            submitButton.innerHTML = originalButtonContent;
            submitButton.disabled = false;
            document.getElementById('contact-form').reset();
        }, function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar el mensaje: ' + JSON.stringify(error)
            });
            submitButton.innerHTML = originalButtonContent;
            submitButton.disabled = false;
        });
});