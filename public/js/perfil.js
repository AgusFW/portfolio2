
document.addEventListener('DOMContentLoaded', async () => {
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const editProfileForm = document.getElementById('editProfileForm');

    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const profileDescription = document.getElementById('profile-description');
    const profileSkills = document.getElementById('profile-skills');

    // Función para cargar el perfil
    async function fetchProfileData() {
        try {
            const response = await fetch(`/perfil/1`);
            if (!response.ok) {
                throw new Error('Perfil no encontrado');
            }
            const perfil = await response.json();
            // Llenar los datos del perfil en la página
            profileName.innerText = perfil.nombre;
            profileTitle.innerText = perfil.titulo;
            profileDescription.innerText = perfil.perfil;
            profileSkills.innerText = perfil.skills;
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar el perfil',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    }

    // Evento al abrir el modal de edición
    document.getElementById('editModal').addEventListener('show.bs.modal', async () => {
        try {
            // Cargar los datos del perfil en el formulario de edición
            const response = await fetch(`/perfil/1`); 
            if (!response.ok) {
                throw new Error('Perfil no encontrado');
            }
            const perfil = await response.json();
            // Llenar el formulario con los datos del perfil
            document.getElementById('editNombre').value = perfil.nombre;
            document.getElementById('editTitulo').value = perfil.titulo;
            document.getElementById('editPerfil').value = perfil.perfil;
            document.getElementById('editSkills').value = perfil.skills;
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
        }
    });

    // Evento al cerrar el modal de edición
    document.getElementById('editModal').addEventListener('hidden.bs.modal', () => {
        editProfileForm.reset();
    });

    // Evento para guardar los cambios del formulario de edición
    document.getElementById('saveChangesBtn').addEventListener('click', async () => {
        const nombre = document.getElementById('editNombre').value;
        const titulo = document.getElementById('editTitulo').value;
        const perfil = document.getElementById('editPerfil').value;
        const skills = document.getElementById('editSkills').value;

        try {
            const response = await fetch(`/perfil/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, titulo, perfil, skills })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el perfil');
            }

            const updatedPerfil = await response.json();
            // Actualizar los datos mostrados en la página
            profileName.innerText = updatedPerfil.nombre;
            profileTitle.innerText = updatedPerfil.titulo;
            profileDescription.innerText = updatedPerfil.perfil;
            profileSkills.innerText = updatedPerfil.skills;

            editModal.hide();
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    });

    // Cargar datos del perfil al cargar la página
    await fetchProfileData();
});
