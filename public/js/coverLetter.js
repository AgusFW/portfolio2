document.addEventListener('DOMContentLoaded', async () => {
    const coverLetter = document.getElementById('coverLetter');
    const editCoverLetterForm = document.getElementById('editCoverLetterForm');
    const saveChangesBtnModalCoverLetter = document.getElementById('saveChangesBtnModalCoverLetter');

    // Función para cargar la cover letter
    async function fetchCoverLetterData() {
        try {
            const response = await fetch(`/coverLetter/1`);
            if (!response.ok) {
                throw new Error('Cover Letter no encontrada');
            }
            const carta = await response.json();
            // Llenar los datos la cover letter en la página
            coverLetter.innerText = carta.carta;
        } catch (error) {
            console.error('Error al cargar la cover letter:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar la cover letter',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    }

    // Evento al abrir el modal de edición
    document.getElementById('editCoverLetterModal').addEventListener('show.bs.modal', async () => {
        try {
            const response = await fetch(`/coverLetter/1`);
            if (!response.ok) {
                throw new Error('Cover Letter no encontrada');
            }
            const carta = await response.json();
            document.getElementById('editCoverLetterCarta').value = carta.carta;
        } catch (error) {
            console.error('Error al cargar la Cover Letter:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al cargar la cover letter',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    });

    // Evento al cerrar el modal de edición
    document.getElementById('editCoverLetterModal').addEventListener('hidden.bs.modal', () => {
        editCoverLetterForm.reset();
    });

    // Función para guardar los cambios de la cover letter
    async function saveCoverLetterChanges() {
        const cartaEditada = document.getElementById('editCoverLetterCarta').value;
        try {
            const response = await fetch(`/coverLetter/1`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ carta: cartaEditada })
            });
            if (!response.ok) {
                throw new Error('Error al guardar los cambios de la Cover Letter');
            }
            const updatedCarta = await response.json();
            coverLetter.innerText = updatedCarta.carta;
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCoverLetterModal'));
            modal.hide();
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar los cambios',
                footer: 'Por favor, intenta nuevamente más tarde'
            });
        }
    }

    // Evento al hacer clic en el botón de guardar cambios
    saveChangesBtnModalCoverLetter.addEventListener('click', saveCoverLetterChanges);

    // Cargar datos de la cover letter al cargar la página
    await fetchCoverLetterData();
});