document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA PARA EL FORMULARIO DE CONTACTO (contacto.html)
    const formContacto = document.querySelector('form');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const mensaje = document.getElementById('mensaje').value;

            // Obtener mensajes previos del localStorage o iniciar lista vacía
            const mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];

            // Crear nuevo objeto de mensaje
            const nuevoMensaje = {
                id: Date.now(),
                fecha: new Date().toLocaleDateString(),
                nombre: nombre,
                correo: correo,
                mensaje: mensaje,
                estado: 'Pendiente'
            };

            // Guardar y actualizar localStorage
            mensajesGuardados.push(nuevoMensaje);
            localStorage.setItem('mensajesContacto', JSON.stringify(mensajesGuardados));

            alert('¡Mensaje enviado con éxito!');
            formContacto.reset();
        });
    }

    // 2. LÓGICA PARA EL PANEL ADMIN (admin-mensajes.html)
    const tablaMensajes = document.getElementById('lista-mensajes');
    if (tablaMensajes) {
        const mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];

        if (mensajesGuardados.length === 0) {
            tablaMensajes.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No hay mensajes registrados aún.</td>
                </tr>
            `;
        } else {
            tablaMensajes.innerHTML = ''; // Limpiar filas de ejemplo
            mensajesGuardados.forEach((msg) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${msg.fecha}</td>
                    <td>${msg.nombre}</td>
                    <td>${msg.correo}</td>
                    <td>${msg.mensaje}</td>
                    <td><span class="badge pendiente">${msg.estado}</span></td>
                    <td>
                        <button class="btn-accion btn-eliminar" onclick="eliminarMensaje(${msg.id})">Borrar</button>
                    </td>
                `;
                tablaMensajes.appendChild(fila);
            });
        }
    }
});

// Función global para borrar un mensaje desde la tabla
function eliminarMensaje(id) {
    let mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];
    mensajesGuardados = mensajesGuardados.filter(msg => msg.id !== id);
    localStorage.setItem('mensajesContacto', JSON.stringify(mensajesGuardados));
    location.reload(); // Recargar para actualizar la tabla
}