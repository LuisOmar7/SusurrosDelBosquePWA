// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/src/service-worker.js')
//   .then(function(registration) {
//     console.log('Service Worker registrado con éxito:', registration);
//   })
//   .catch(function(error) {
//     console.log('Error al registrar el Service Worker:', error);
//   });
// }


// Obtener los elementos del DOM
const toggleModalBtn = document.getElementById('toggleModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const defaultModal = document.getElementById('defaultModal');

// Función para mostrar el modal
function showModal() {
  defaultModal.classList.remove('hidden');
}

// Función para ocultar el modal
function hideModal() {
  defaultModal.classList.add('hidden');
}

// Event Listeners
toggleModalBtn.addEventListener('click', showModal);
closeModalBtn.addEventListener('click', hideModal);


// Cerrar el modal al hacer clic fuera del contenido del modal
defaultModal.addEventListener('click', (event) => {
  if (event.target === defaultModal) {
    hideModal();
  }
});
