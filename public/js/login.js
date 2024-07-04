document.addEventListener('DOMContentLoaded', function() {
    const loginModalElement = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalElement);
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const btnLogin = document.getElementById('btn-login');

    function checkAuthentication() {
        fetch('/is-authenticated')
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    logoutBtn.style.display = 'flex';
                    document.querySelectorAll('.auth-required').forEach(el => {
                        el.style.display = 'flex';
                    });
                } else {
                    logoutBtn.style.display = 'flex';
                    document.querySelectorAll('.auth-required').forEach(el => {
                        el.style.display = 'none';
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al verificar autenticación'
                });
            });
    }

    btnLogin.addEventListener('click', function() {
        loginModal.show();
    });

    logoutBtn.addEventListener('click', function() {
        fetch('/logout', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logout exitoso',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    loginModal.hide();
                    checkAuthentication();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al cerrar sesión'
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cerrar sesión'
                });
            });
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get('email');
        const password = formData.get('password');

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Autenticación exitosa') {
                loginModal.hide();
                checkAuthentication();
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Autenticación exitosa',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al iniciar sesión'
            });
        });
    });

    checkAuthentication(); 
});