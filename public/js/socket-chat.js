const socket = io();
const params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error(`Nombre y sala obligatorios.`);
}

const usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

// Se conectó un usuario
socket.on('connect', () => {

    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, (data) => console.log(data));

});

// Se desconectó un usuario
socket.on('disconnect', () => console.log('Perdimos conexión con el servidor'));

// Escucha creación de un mensaje
socket.on('crearMensaje', (data) => console.log(data));

// Emite la creación de un mensaje
socket.emit('crearMensaje', { mensaje: 'Probando mensaje' });

// Muestra la lista de personas conectadas en el chat
socket.on('listaPersonas', (data) => console.log(data));

// Escucha un mensaje privado
socket.on('privateMessage', (message) => {
    console.log(`Mensaje privado =>`, message);
});