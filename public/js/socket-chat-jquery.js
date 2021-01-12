/**
 * Parámetros de URL
 */
// const params = new URLSearchParams(window.location.search);

/**
 * Referencias JQuery
 */
const divUsuarios = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const divChatbox = $('#divChatbox');

/**
 * Función para renderizar usuarios
 * @param personas => [{},{},{}]...
 */
renderizarUsuarios = (personas) => {

    let HTML = `<li>
                    <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')} </span></a>
                </li>`;
    
    personas.forEach((persona) => {
        
        HTML += `<li>
                    <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre} <small class="text-success">online</small></span></a>
                </li>`;
        
    });
    
    divUsuarios.html(HTML);
    
}

/**
 * Función para renderizar mensajes
 */
renderizarMensajes = (mensaje, me) => {

    const fecha = new Date(mensaje.fecha);
    const formatoHora = `${fecha.getHours()}:${fecha.getMinutes()}`;
    const adminClass = (mensaje.nombre === 'ADMIN') ? 'danger' : 'info';
    let HTMLMessage = '';

    if (me) {

        HTMLMessage = `<li class="reverse">
                            <div class="chat-content">
                                <h5>${mensaje.nombre}</h5>
                                <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                            </div>
                            <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>
                            <div class="chat-time">${formatoHora}</div>
                        </li>`;

    } else {

        const img = (mensaje.nombre !== 'ADMIN') ? '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>' : '';

        HTMLMessage = `<li class="animated fadeIn">
                            ${img}
                            <div class="chat-content">
                                <h5>${mensaje.nombre}</h5>
                                <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                            </div>
                            <div class="chat-time">${formatoHora}</div>
                        </li>`;
    }


    divChatbox.append(HTMLMessage);

}


// Listeners
divUsuarios.on('click', 'a', function() {

    const id = $(this).data('id');

    if (id) {
        console.log(`Showing id => ${id}`);
    }

});

formEnviar.on('submit', (event) => {

    event.preventDefault();
    const mensaje = txtMensaje.val();

    if (mensaje.trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', { nombre: params.get('nombre'), mensaje }, (resp) => {
        console.log(`Respuesta server: `, resp);
        txtMensaje.val('').focus();
        renderizarMensajes(resp.mensaje, true);
        scrollBottom();
    });

});

scrollBottom = () => {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}