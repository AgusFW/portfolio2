document.addEventListener('DOMContentLoaded', async () => {
    const estudiosSection = document.getElementById('estudios-section');
    const viewModalEstudios = new bootstrap.Modal(document.getElementById('viewModalestudios'));
    const editEstudiosModal = new bootstrap.Modal(document.getElementById('editEstudiosModal'));
    const newEstudioModal = new bootstrap.Modal(document.getElementById('newEstudioModal'));

    const viewModalEstudiosLabel = document.getElementById('viewModalEstudiosLabel');
    const viewModalEstudiosBody = document.querySelector('#viewModalestudios .body-estudios');
    const editEstudiosModalLabel = document.getElementById('editEstudiosModalLabel');
    const saveChangesBtnModalEst = document.getElementById('saveChangesBtnModalEst');
    const newEstudioBtn = document.getElementById('newEstudioBtn');
    const saveNewEstudioBtn = document.getElementById('saveNewEstudioBtn');

    let currentEstudioId = null;

    // Función para cargar los estudios desde el servidor
    async function fetchEstudios() {
        try {
            const response = await fetch(`/estudios`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los estudios');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al cargar los estudios:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar los estudios',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
            return [];
        }
    }

    // Función para cargar un estudio específica desde el servidor
    async function fetchEstudio(id) {
        try {
            const response = await fetch(`/estudio/${id}`);
            if (!response.ok) {
                throw new Error('No se pudo cargar el estudio');
            }
            const estudio = await response.json();
            //console.log('Estudio cargado:', estudio);
            return estudio;
        } catch (error) {
            console.error('Error al cargar el estudio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar el estudio',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
            return null;
        }
    }

    // Función para borrar un estudio por ID
    async function deleteEstudio(id) {
        try {
            const response = await fetch(`/estudio/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el estudio');
            }

            const estudios = await fetchEstudios();
            renderEstudios(estudios);
        } catch (error) {
            console.error('Error al eliminar el estudio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar el estudio',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    }

    // Función para construir las cards de cada estudio
    function renderEstudios(estudios) {
        estudiosSection.innerHTML = '';

        estudios.forEach(estudio => {
            // Construir la estructura de la card
            const cardHTML = `
                <div class="card card-container mb-3">
                    <div class="img-container">
                        <img src="./assets/${estudio.img}" alt="${estudio.img}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${estudio.titulo}</h5>
                        <label>Periodo:</label>
                        <p class="card-text">${estudio.periodo}</p>
                        <label>Lenguajes:</label>
                        <p class="card-text">${estudio.lenguajes}</p>
                        <button type="button" class="btn btn-secondary btn-sm view-more-Est-btn" data-id="${estudio._id}">Ver Más</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm edit-Est-btn auth-required" data-id="${estudio._id}">Editar</button>
                        <button type="button" class="btn btn-outline-danger btn-sm delete-Est-btn auth-required" data-id="${estudio._id}">Borrar</button>
                    </div>
                </div>
            `;

            estudiosSection.innerHTML += cardHTML;
        });

        // Agregar evento de clic a todos los botones "Ver Más"
        document.querySelectorAll('.view-more-Est-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const estudioId = event.target.getAttribute('data-id');
                const estudio = await fetchEstudio(estudioId);
                if (estudio) {
                    renderViewModalEstContent(estudio);
                    viewModalEstudios.show();
                }
            });
        });

        // Agregar evento de clic a todos los botones "Editar"
        document.querySelectorAll('.edit-Est-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const estudioId = event.target.getAttribute('data-id');
                currentEstudioId = estudioId;
                const estudio = await fetchEstudio(estudioId);
                if (estudio) {
                    renderEditModalEstContent(estudio);
                    editEstudiosModal.show();
                }
            });
        });

        // Agregar evento de clic a todos los botones "Borrar"
        document.querySelectorAll('.delete-Est-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const estudioId = event.target.getAttribute('data-id');
                const result = await Swal.fire({
                    title: 'Borrar Estudio',
                    text: "¿Esta seguro de querer borrar este estudio?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                });

                if (result.isConfirmed) {
                    await deleteEstudio(estudioId);
                }
            });
        });

        checkAuthentication();
    }

    // Función para renderizar el contenido del modal de visualización
    function renderViewModalEstContent(estudio) {
        viewModalEstudiosLabel.innerText = estudio.titulo;
        viewModalEstudiosBody.innerHTML = `
        <p><b>Periodo:</b> ${estudio.periodo}</p>
        <p><b>Tecnologias:</b> ${estudio.lenguajes}</p>
        <p><b>Descripcion:</b> ${estudio.descripcion}</p>
        <div class="img-container-estudios">
            <img src="./assets/${estudio.certificado}" alt="${estudio.certificado}">
        </div>
        `;
    }

    // Función para renderizar el contenido del modal de edición
    function renderEditModalEstContent(estudio) {
        editEstudiosModalLabel.innerText = `${estudio.titulo}`;
        document.getElementById('editEstTitulo').value = estudio.titulo;
        document.getElementById('editEstPeriodo').value = estudio.periodo;
        document.getElementById('editEstDescripcion').value = estudio.descripcion;
        document.getElementById('editEstLenguajes').value = estudio.lenguajes;
        // Mostrar el nombre de la imagen actual
        const imgInput = document.getElementById('editEstImg');
        imgInput.setAttribute('data-current-img', estudio.img);
        imgInput.previousElementSibling.innerText = estudio.img ? estudio.img.split('/').pop() : 'No hay img';

        // Mostrar el nombre del certificado actual
        const certificadoInput = document.getElementById('editEstCerti');
        certificadoInput.setAttribute('data-current-certificado', estudio.certificado);
        certificadoInput.previousElementSibling.innerText = estudio.certificado ? estudio.certificado.split('/').pop() : 'No hay certificado';
    }

    // Evento para guardar los cambios del formulario de edición
    saveChangesBtnModalEst.addEventListener('click', async () => {
        if (!currentEstudioId) return;

        const form = document.getElementById('editEstudiosForm');
        const formData = new FormData(form);

        try {
            const response = await fetch(`/estudio/${currentEstudioId}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estudio');
            }

            const estudio = await fetchEstudios();
            renderEstudios(estudio);
            editEstudiosModal.hide();
        } catch (error) {
            console.error('Error al actualizar el estudio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar el estudio',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    });

    // Evento para abrir el modal de nueva experiencia
    newEstudioBtn.addEventListener('click', () => {
        newEstudioModal.show();
    });

    // Evento para guardar la nueva experiencia
    saveNewEstudioBtn.addEventListener('click', async () => {
        const form = document.getElementById('newEstudioForm');
        const formData = new FormData(form);

        try {
            const response = await fetch(`/estudio`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al agregar el estudio');
            }

            const estudios = await fetchEstudios();
            renderEstudios(estudios);
            newEstudioModal.hide();
        } catch (error) {
            console.error('Error al agregar el estudio:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al agregar el estudio',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    });

    // Función para verificar la autenticación del usuario
    function checkAuthentication() {
        fetch('/is-authenticated')
            .then(response => response.json())
            .then(data => {
                if (data.authenticated) {
                    // Mostrar botones de edición y borrado
                    document.querySelectorAll('.auth-required').forEach(el => {
                        el.style.display = 'flex';
                    });
                } else {
                    // Ocultar botones de edición y borrado
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

    // Cargar los estudios al cargar la página
    const estudios = await fetchEstudios();
    renderEstudios(estudios);
});