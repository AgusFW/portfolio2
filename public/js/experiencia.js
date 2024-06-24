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
            const response = await fetch(`/experiencias`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar las experiencias');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al cargar las experiencias:', error);
            return [];
        }
    }

    // Función para cargar una experiencia específica desde el servidor
    async function fetchExperiencia(id) {
        try {
            const response = await fetch(`/experiencia/${id}`);
            if (!response.ok) {
                throw new Error('No se pudo cargar la experiencia');
            }
            const experiencia = await response.json();
            //console.log('Experiencia cargada:', experiencia);
            return experiencia;
        } catch (error) {
            console.error('Error al cargar la experiencia:', error);
            return null;
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
                        <img src="./assets/${experiencia.img}" alt="${experiencia.img}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${experiencia.titulo}</h5>
                        <label>Periodo:</label>
                        <p class="card-text">${experiencia.periodo}</p>
                        <label>Lenguajes:</label>
                        <p class="card-text">${experiencia.lenguajes}</p>
                        <button type="button" class="btn btn-secondary btn-sm view-more-btn" data-id="${experiencia._id}">Ver Más</button>
                        <button type="button" class="btn btn-outline-secondary btn-sm edit-btn" data-id="${experiencia._id}">Editar</button>
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
    }

    // Función para renderizar el contenido del modal de visualización
    function renderViewModalContent(experiencia) {
        viewModalLabel.innerText = experiencia.titulo;
        viewModalBody.innerHTML = `
        <p><b>Periodo:</b> ${experiencia.periodo}</p>
        <p><b>Lenguajes/Librerías:</b> ${experiencia.lenguajes}</p>
        <p><b>Funciones:</b> ${experiencia.descripcion}</p>
        <p><b>Modalidad:</b> ${experiencia.modalidad}</p>
        <p><b>URL:</b> <a href="${experiencia.url}" target="_blank">${experiencia.url}</a></p>
        <p><b>GitHub:</b> <a href="${experiencia.githube}" target="_blank">${experiencia.githube}</a></p>
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
        document.getElementById('editImg').value = experiencia.img;
    }

    // Evento para guardar los cambios del formulario de edición
    saveChangesBtn.addEventListener('click', async () => {
        if (!currentExperienciaId) return;

        const updatedExperiencia = {
            titulo: document.getElementById('editExpTitulo').value,
            periodo: document.getElementById('editPeriodo').value,
            descripcion: document.getElementById('editDescripcion').value,
            modalidad: document.getElementById('editModalidad').value,
            url: document.getElementById('editUrl').value,
            lenguajes: document.getElementById('editLenguajes').value,
            githube: document.getElementById('editGithube').value,
            img: document.getElementById('editImg').value
        };

        try {
            const response = await fetch(`/experiencia/${currentExperienciaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedExperiencia)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la experiencia');
            }

            const experiencias = await fetchExperiencias();
            renderExperiencias(experiencias); 
            editModal.hide();
        } catch (error) {
            console.error('Error al actualizar la experiencia:', error);
        }
    });

    // Evento para abrir el modal de nueva experiencia
    newExperienciaBtn.addEventListener('click', () => {
        newExperienciaModal.show();
    });

    // Evento para guardar la nueva experiencia
    saveNewExperienciaBtn.addEventListener('click', async () => {
        const newExperiencia = {
            titulo: document.getElementById('newExpTitulo').value,
            periodo: document.getElementById('newExpPeriodo').value,
            modalidad: document.getElementById('newExpModalidad').value,
            lenguajes: document.getElementById('newExpLenguajes').value,
            descripcion: document.getElementById('newExpDescripcion').value,
            githube: document.getElementById('newExpGithube').value,
            img: document.getElementById('newExpImg').value
        };

        try {
            const response = await fetch(`/experiencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newExperiencia)
            });

            if (!response.ok) {
                throw new Error('Error al agregar la experiencia');
            }

            const experiencias = await fetchExperiencias();
            renderExperiencias(experiencias);
            newExperienciaModal.hide();
        } catch (error) {
            console.error('Error al agregar la experiencia:', error);
        }
    });

    // Cargar las experiencias al cargar la página
    const experiencias = await fetchExperiencias();
    renderExperiencias(experiencias);
});