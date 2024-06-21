document.addEventListener('DOMContentLoaded', async () => {
    const experienciasSection = document.getElementById('experiencias-section');

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
            return []; // Retornar un array vacío en caso de error
        }
    }

    // Función para construir las cards de Bootstrap para cada experiencia
    function renderExperiencias(experiencias) {
        experienciasSection.innerHTML = ''; // Limpiar el contenido anterior

        experiencias.forEach(experiencia => {
            // Construir la estructura de la card
            const cardHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${experiencia.titulo}</h5>
                        <label>Periodo:</label>
                        <p class="card-text">${experiencia.periodo}</p>
                        <label>Lenguajes:</label>
                        <p class="card-text">${experiencia.lenguajes}</p>
                        <button type="button" class="btn btn-secondary btn-sm">Ver Más</button>
                    </div>
                </div>
            `;

            // Agregar la card al contenedor de experiencias
            experienciasSection.innerHTML += cardHTML;
        });
    }

    // Cargar las experiencias al cargar la página
    const experiencias = await fetchExperiencias();
    renderExperiencias(experiencias);
});
