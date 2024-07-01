document.addEventListener('DOMContentLoaded', async () => {
    const experienciasSection = document.getElementById('experiencias-section');
    const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    const editModal = new bootstrap.Modal(document.getElementById('editExperienciaModal'));
    const newExperienciaModal = new bootstrap.Modal(document.getElementById('newExperienciaModal'));

    const viewModalLabel = document.getElementById('viewModalLabel');
    const viewModalBody = document.querySelector('#viewModal .modal-body');
    const editModalLabel = document.getElementById('editExperienciaModalLabel');
    const saveChangesBtn = document.getElementById('saveChangesBtnModalExp');
    const newExperienciaBtn = document.getElementById('newExperienciaBtn');
    const saveNewExperienciaBtn = document.getElementById('saveNewExperienciaBtn');

    let currentExperienciaId = null;

    // Función para cargar las experiencias desde el servidor
    async function fetchExperiencias() {
        try {
            const response = await fetch(`/workexperiences`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar las experiencias');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al cargar las experiencias:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar las experiencias laborales',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
            return [];
        }
    }

    // Función para cargar una experiencia específica desde el servidor
    async function fetchExperiencia(id) {
        try {
            const response = await fetch(`/workexperience/${id}`);
            if (!response.ok) {
                throw new Error('No se pudo cargar la experiencia');
            }
            const experiencia = await response.json();
            //console.log('Experiencia cargada:', experiencia);
            return experiencia;
        } catch (error) {
            console.error('Error al cargar la experiencia:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar la experiencia',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
            return null;
        }
    }

    // Función para borrar una experiencia por ID
    async function deleteExperiencia(id) {
        try {
            const response = await fetch(`/workexperience/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la experiencia');
            }

            const experiencias = await fetchExperiencias();
            renderExperiencias(experiencias);
        } catch (error) {
            console.error('Error al eliminar la experiencia:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al eliminar la experiencia',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    }


    // Función para construir las cards de cada experiencia
    function renderExperiencias(experiencias) {
        experienciasSection.innerHTML = '';

        experiencias.forEach(experiencia => {
            // Construir la estructura de la card
            const cardHTML = `
                <div class="card card-container mb-3">
                    <div class="img-container">
                        <img src="assets/${experiencia.img}" alt="${experiencia.img}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${experiencia.titulo}</h5>
                        <label>Period:</label>
                        <p class="card-text">${experiencia.periodo}</p>
                        <label>Languages/Libraries:</label>
                        <p class="card-text">${experiencia.lenguajes}</p>
                        <button type="button" class="btn btn-secondary btn-sm view-more-btn" data-id="${experiencia._id}">See More</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm edit-btn" data-id="${experiencia._id}">Editar</button>
                        <button type="button" class="btn btn-outline-danger btn-sm delete-btn" data-id="${experiencia._id}">Borrar</button>
                    </div>
                </div>
            `;

            experienciasSection.innerHTML += cardHTML;
        });

        // Agregar evento de clic a todos los botones "Ver Más"
        document.querySelectorAll('.view-more-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const experienciaId = event.target.getAttribute('data-id');
                const experiencia = await fetchExperiencia(experienciaId);
                if (experiencia) {
                    renderViewModalContent(experiencia);
                    viewModal.show();
                }
            });
        });

        // Agregar evento de clic a todos los botones "Editar"
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const experienciaId = event.target.getAttribute('data-id');
                currentExperienciaId = experienciaId;
                const experiencia = await fetchExperiencia(experienciaId);
                if (experiencia) {
                    renderEditModalContent(experiencia);
                    editModal.show();
                }
            });
        });

        // Agregar evento de clic a todos los botones "Borrar"
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const experienciaId = event.target.getAttribute('data-id');
                const result = await Swal.fire({
                    title: 'Borrar Experiencia',
                    text: "¿Esta seguro de querer borrar la experiencia?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
                });

                if (result.isConfirmed) {
                    await deleteExperiencia(experienciaId);
                }
            });
        });
    }


    // Función para renderizar el contenido del modal de visualización
    function renderViewModalContent(experiencia) {
        viewModalLabel.innerText = experiencia.titulo;
        viewModalBody.innerHTML = `
        <p><b>Period:</b> ${experiencia.periodo}</p>
        <p><b>Languages/Libraries:</b> ${experiencia.lenguajes}</p>
        <p><b>Responsibilities:</b> ${experiencia.descripcion}</p>
        <p><b>Employment Arrangement:</b> ${experiencia.modalidad}</p>
        <p><b>URL:</b> <a href="${experiencia.url}" target="_blank">${experiencia.url}</a></p>
        <p><b>Repository:</b> <a href="${experiencia.githube}" target="_blank">${experiencia.githube}</a></p>
        `;
    }

    // Función para renderizar el contenido del modal de edición
    function renderEditModalContent(experiencia) {
        editModalLabel.innerText = `${experiencia.titulo}`;
        document.getElementById('editExpTitulo').value = experiencia.titulo;
        document.getElementById('editPeriodo').value = experiencia.periodo;
        document.getElementById('editDescripcion').value = experiencia.descripcion;
        document.getElementById('editModalidad').value = experiencia.modalidad;
        document.getElementById('editUrl').value = experiencia.url;
        document.getElementById('editLenguajes').value = experiencia.lenguajes;
        document.getElementById('editGithube').value = experiencia.githube;
        // Mostrar el nombre de la imagen actual
        const imgInput = document.getElementById('editImg');
        imgInput.setAttribute('data-current-img', experiencia.img);
        imgInput.previousElementSibling.innerText = experiencia.img.split('/').pop();
    }

    // Evento para guardar los cambios del formulario de edición
    saveChangesBtn.addEventListener('click', async () => {
        if (!currentExperienciaId) return;

        const form = document.getElementById('editExperienciaForm');
        const formData = new FormData(form);

        try {
            const response = await fetch(`/workexperience/${currentExperienciaId}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la experiencia');
            }

            const experiencias = await fetchExperiencias();
            renderExperiencias(experiencias);
            editModal.hide();
        } catch (error) {
            console.error('Error al actualizar la experiencia:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar la experiencia',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    });

    // Evento para abrir el modal de nueva experiencia
    newExperienciaBtn.addEventListener('click', () => {
        newExperienciaModal.show();
    });

    // Evento para guardar la nueva experiencia
    saveNewExperienciaBtn.addEventListener('click', async () => {
        const formData = new FormData(document.getElementById('newExperienciaForm'));

        try {
            const response = await fetch(`/workexperience`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al agregar la experiencia');
            }

            const experiencias = await fetchExperiencias();
            renderExperiencias(experiencias);
            newExperienciaModal.hide();
        } catch (error) {
            console.error('Error al agregar la experiencia:', error);
            console.log(formData)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al agregar la experiencia',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    });

    // Cargar las experiencias al cargar la página
    const experiencias = await fetchExperiencias();
    renderExperiencias(experiencias);
});