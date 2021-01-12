const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {
        
        if (!usuario.nombre || !usuario.sala) {
            return callback({ err: true, mensaje: 'Nombre/sala obligatorio' });    
        }

        client.join(usuario.sala);
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));

        callback(usuarios.getPersonasPorSala(usuario.sala));

    });

    client.on('crearMensaje', (data) => {
        
        const persona = usuarios.getPersona(client.id);
        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        
    });

    client.on('disconnect', () => {
        
        const disconnectedUser = usuarios.borrarPersona(client.id);
        client.broadcast.to(disconnectedUser.sala).emit('crearMensaje', crearMensaje('ADMIN', `${disconnectedUser.nombre} ha abandonado el chat.`));
        client.broadcast.to(disconnectedUser.sala).emit('listaPersonas', usuarios.getPersonasPorSala(disconnectedUser.sala));
        
    });

    // Escucha un mensaje privado
    client.on('privateMessage', (data) => {
        
        const persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('privateMessage', crearMensaje(persona.nombre, data.mensaje));

    });

});