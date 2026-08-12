document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA PARA EL FORMULARIO DE CONTACTO (contacto.html)
    const formContacto = document.querySelector('form');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const mensaje = document.getElementById('mensaje').value;

            const mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];

            const nuevoMensaje = {
                id: Date.now(),
                fecha: new Date().toLocaleDateString(),
                nombre: nombre,
                correo: correo,
                mensaje: mensaje,
                estado: 'pendiente' // Usamos minúsculas para coordinar con CSS (.badge.pendiente)
            };

            mensajesGuardados.push(nuevoMensaje);
            localStorage.setItem('mensajesContacto', JSON.stringify(mensajesGuardados));

            alert('¡Mensaje enviado con éxito!');
            formContacto.reset();
        });
    }

    // 2. LÓGICA PARA EL PANEL ADMIN (admin-mensajes.html)
    const tablaMensajes = document.getElementById('lista-mensajes');
    if (tablaMensajes) {
        renderizarTabla();
    }
});

// Función global para re-renderizar la tabla dinámicamente
function renderizarTabla() {
    const tablaMensajes = document.getElementById('lista-mensajes');
    if (!tablaMensajes) return;

    const mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];

    if (mensajesGuardados.length === 0) {
        tablaMensajes.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">No hay mensajes registrados aún.</td>
            </tr>
        `;
        return;
    }

    tablaMensajes.innerHTML = ''; 

    mensajesGuardados.forEach((msg) => {
        const fila = document.createElement('tr');
        
        // Determinar clase dinámica para el Badge (pendiente vs leido)
        const claseBadge = msg.estado.toLowerCase() === 'leido' ? 'badge leido' : 'badge pendiente';
        const textoEstado = msg.estado.charAt(0).toUpperCase() + msg.estado.slice(1);

        fila.innerHTML = `
            <td>${msg.fecha}</td>
            <td>${msg.nombre}</td>
            <td>${msg.correo}</td>
            <td>${msg.mensaje}</td>
            <td><span class="${claseBadge}">${textoEstado}</span></td>
            <td>
                ${msg.estado !== 'leido' ? `<button class="btn-accion" onclick="cambiarEstado(${msg.id})">Marcar Leído</button>` : ''}
                <button class="btn-accion btn-eliminar" onclick="eliminarMensaje(${msg.id})">Borrar</button>
            </td>
        `;
        tablaMensajes.appendChild(fila);
    });
}

// Cambiar estado a "Leído"
function cambiarEstado(id) {
    let mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];
    mensajesGuardados = mensajesGuardados.map(msg => {
        if (msg.id === id) {
            return { ...msg, estado: 'leido' };
        }
        return msg;
    });
    
    localStorage.setItem('mensajesContacto', JSON.stringify(mensajesGuardados));
    renderizarTabla(); // Actualizar interfaz sin refrescar la página
}

// Borrar mensaje
function eliminarMensaje(id) {
    let mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];
    mensajesGuardados = mensajesGuardados.filter(msg => msg.id !== id);
    
    localStorage.setItem('mensajesContacto', JSON.stringify(mensajesGuardados));
    renderizarTabla(); // Actualizar interfaz sin refrescar la página
}