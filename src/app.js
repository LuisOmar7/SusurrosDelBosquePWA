// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/src/service-worker.js')
//   .then(function(registration) {
//     console.log('Service Worker registrado con éxito:', registration);
//   })
//   .catch(function(error) {
//     console.log('Error al registrar el Service Worker:', error);
//   });
// }

// IDs de los elementos de los modales
const modalIds = [1, 2, 3, 4];

modalIds.forEach(id => {
  const toggleModalBtn = document.getElementById(`toggleModalBtn${id}`);
  const closeModalBtn = document.getElementById(`closeModalBtn${id}`);
  const defaultModal = document.getElementById(`defaultModal${id}`);

  // Función para mostrar el modal
  function showModal() {
    defaultModal.classList.remove('hidden');
  }

  // Función para ocultar el modal
  function hideModal() {
    defaultModal.classList.add('hidden');
  }

  // Event Listeners para abrir y cerrar el modal
  toggleModalBtn.addEventListener('click', showModal);
  closeModalBtn.addEventListener('click', hideModal);

  // Cerrar el modal al hacer clic fuera del contenido del modal
  defaultModal.addEventListener('click', (event) => {
    if (event.target === defaultModal) {
      hideModal();
    }
  });
});


// Función fetch para obtener y mostrar los datos
function fetchDatos() {
  fetch('https://utm210012ti-default-rtdb.firebaseio.com/.json')
    .then(response => response.json())
    .then(data => {
      // Aquí puedes trabajar con los datos
      console.log(data);
      mostrarDatos(data);
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}

// JavaScript para mostrar los datos
function mostrarDatos(data) {
  const contenedor = document.getElementById('contenedor-videojuegos');
  if (!contenedor) {
    console.error('Contenedor no encontrado');
    return;
  }

  data.results.forEach(videojuego => {
    const div = document.createElement('div');
    div.className = 'bg-black border-red-600 shadow-lg rounded-lg p-4 flex-none w-60';
    div.innerHTML = `
      <img src="${videojuego.img}" alt="${videojuego.videojuego}" class="w-full min-h-52 object-cover rounded-md mb-2" />
      <h2 class="text-lg text-white font-bold mb-2">${videojuego.videojuego}</h2>
      <p class="text-sm text-gray-600">Lanzamiento: ${videojuego.lanzamiento}</p>
    `;
    contenedor.appendChild(div);
  });
}


// Llamar a la función fetchDatos
fetchDatos();