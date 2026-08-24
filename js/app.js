/**
 * app.js — Lógica combinada del sitio
 * ---------------------------------------------------------------------
 * Une los dos módulos que antes vivían en archivos separados:
 *
 *   A) Formulario de contacto y panel admin de mensajes
 *      (contacto.html / admin-mensajes.html)
 *   B) VetConnect — dashboard de mascotas y citas
 *
 * Cada función comprueba primero si sus propios elementos existen en el
 * DOM antes de hacer algo, así que este único archivo puede incluirse en
 * TODAS las páginas del sitio sin que un módulo interfiera con el otro.
 * ---------------------------------------------------------------------
 */

// ================================================================
// A1. FORMULARIO DE CONTACTO (contacto.html)
// ================================================================
function inicializarFormularioContacto() {
    const formContacto = document.querySelector('form');

    // Se exige que existan los 3 campos del formulario de contacto y no
    // solo "cualquier <form>", para no engancharse por error a otro
    // formulario de la página (p. ej. el de VetConnect) ahora que este
    // mismo archivo se carga en varias páginas del sitio.
    if (!formContacto || !document.getElementById('nombre') || !document.getElementById('correo') || !document.getElementById('mensaje')) {
        return;
    }

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

// ================================================================
// A2. PANEL ADMIN DE MENSAJES (admin-mensajes.html)
// ================================================================
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

// Cambiar estado a "Leído" (llamado desde el onclick generado arriba)
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

// Borrar mensaje (llamado desde el onclick generado arriba)
function eliminarMensaje(id) {
    let mensajesGuardados = JSON.parse(localStorage.getItem('mensajesContacto')) || [];
    mensajesGuardados = mensajesGuardados.filter(msg => msg.id !== id);

    localStorage.setItem('mensajesContacto', JSON.stringify(mensajesGuardados));
    renderizarTabla(); // Actualizar interfaz sin refrescar la página
}

// ================================================================
// B1. VETCONNECT — Datos iniciales (semilla)
// ================================================================
const mascotasIniciales = [
    {
        id: 1,
        nombre: "Max",
        especie: "Perro Golden Retriever",
        propietario: "Juan Pérez",
        fecha: "20/05/2026",
        avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        nombre: "Lola",
        especie: "Gato Mestizo",
        propietario: "Ana Soto",
        fecha: "20/05/2026",
        avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&auto=format&fit=crop&q=80"
    },
    {
        id: 3,
        nombre: "Bunny",
        especie: "Conejo Enano",
        propietario: "Carlos Gómez",
        fecha: "19/05/2026",
        avatar: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=100&auto=format&fit=crop&q=80"
    }
];

const citasIniciales = [
    { hora: "09:00", mascota: "Firulais", propietario: "Juan Pérez", estado: "Confirmada" },
    { hora: "10:30", mascota: "Michi", propietario: "Ana Soto", estado: "Pendiente" },
    { hora: "11:15", mascota: "Rocky", propietario: "Carlos Gómez", estado: "Confirmada" },
    { hora: "12:00", mascota: "Luna", propietario: "María Torres", estado: "Cancelada" }
];

// ================================================================
// B2. VETCONNECT — Persistencia con LocalStorage
// ================================================================
const obtenerMascotas = () => {
    const guardadas = localStorage.getItem("vet_mascotas");
    if (!guardadas) {
        localStorage.setItem("vet_mascotas", JSON.stringify(mascotasIniciales));
        return mascotasIniciales;
    }
    return JSON.parse(guardadas);
};

const guardarMascotaEnStorage = (nuevaMascota) => {
    const mascotas = obtenerMascotas();
    mascotas.unshift(nuevaMascota); // Agrega al inicio para ser vista primera
    localStorage.setItem("vet_mascotas", JSON.stringify(mascotas));
};

// ================================================================
// B3. VETCONNECT — Renderizado de métricas, citas y mascotas
// ================================================================
const renderizarMetricas = () => {
    const mascotas = obtenerMascotas();
    const elTotalMascotas = document.querySelector("#totalMascotas");
    const elTotalConsultas = document.querySelector("#totalConsultas");
    const elTotalVacunas = document.querySelector("#totalVacunas");

    if (elTotalMascotas) elTotalMascotas.textContent = mascotas.length;
    if (elTotalConsultas) elTotalConsultas.textContent = "8";
    if (elTotalVacunas) elTotalVacunas.textContent = "12";
};

const renderizarTablaCitas = () => {
    const tbody = document.querySelector("#tablaCitasBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    citasIniciales.forEach((cita) => {
        const fila = document.createElement("tr");

        // Lógica para asignar el badge según el estado
        let badgeClass = "badge-confirmada";
        if (cita.estado === "Pendiente") badgeClass = "badge-pendiente";
        if (cita.estado === "Cancelada") badgeClass = "badge-cancelada";

        fila.innerHTML = `
      <td class="fw-semibold">${cita.hora}</td>
      <td class="text-secondary">${cita.mascota}</td>
      <td class="text-secondary">${cita.propietario}</td>
      <td class="text-end"><span class="badge ${badgeClass} px-3 py-2 rounded-3">${cita.estado}</span></td>
    `;
        tbody.appendChild(fila);
    });
};

const renderizarListaMascotas = () => {
    const contenedor = document.querySelector("#listaUltimasMascotas");
    if (!contenedor) return;

    const mascotas = obtenerMascotas().slice(0, 3); // Muestra las últimas 3
    contenedor.innerHTML = "";

    mascotas.forEach((m) => {
        const item = document.createElement("div");
        item.className = "d-flex align-items-center justify-content-between p-2 rounded-3 hover-bg";
        item.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <img src="${m.avatar}" alt="${m.nombre}" class="pet-avatar rounded-circle object-fit-cover">
        <div>
          <h4 class="h6 fw-bold mb-0 text-dark">${m.nombre}</h4>
          <p class="small text-muted mb-0">${m.especie}</p>
          <span class="text-muted text-xs">Registrado: ${m.fecha}</span>
        </div>
      </div>
      <a href="mascotas.html" class="btn btn-outline-primary btn-sm rounded-3 px-3 py-2 fw-semibold">Ver ficha</a>
    `;
        contenedor.appendChild(item);
    });
};

// ================================================================
// B4. VETCONNECT — Formulario de nueva mascota
// ================================================================
const inicializarFormulario = () => {
    const formulario = document.querySelector("#formDashboardMascota");
    const feedback = document.querySelector("#modalFeedback");

    if (!formulario) return;

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = document.querySelector("#dashNombre").value.trim();
        const especie = document.querySelector("#dashEspecie").value.trim();
        const propietario = document.querySelector("#dashPropietario").value.trim();

        // Validación de campos vacíos
        if (nombre === "" || especie === "" || propietario === "") {
            feedback.innerHTML = '<div class="alert alert-danger py-2 small mb-0">Por favor, completa todos los campos requeridos.</div>';
            return;
        }

        // Creación de nuevo objeto
        const nuevaMascota = {
            id: Date.now(),
            nombre: nombre,
            especie: especie,
            propietario: propietario,
            fecha: new Date().toLocaleDateString("es-CL"),
            avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&auto=format&fit=crop&q=80"
        };

        // Guardado y actualización de la vista
        guardarMascotaEnStorage(nuevaMascota);
        renderizarMetricas();
        renderizarListaMascotas();

        // Cierre del Modal y feedback visual
        feedback.innerHTML = "";
        formulario.reset();

        const modalElement = document.getElementById("modalNuevaMascota");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        // Disparar Toast
        const toastEl = document.getElementById("toastRegistro");
        const toastMsg = document.getElementById("toastMensaje");
        if (toastEl && toastMsg) {
            toastMsg.textContent = `¡${nombre} fue registrado correctamente!`;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    });
};

// ================================================================
// B5. VETCONNECT — Mostrar / ocultar métricas
// ================================================================
const inicializarToggleMetricas = () => {
    const btnToggle = document.querySelector("#btnToggleResumen");
    const metricas = document.querySelector("#contenedorMetricas");

    if (btnToggle && metricas) {
        btnToggle.addEventListener("click", () => {
            metricas.classList.toggle("d-none");
            btnToggle.textContent = metricas.classList.contains("d-none") ? "Mostrar Métricas" : "Ocultar Métricas";
        });
    }
};

// ================================================================
// INICIALIZACIÓN GLOBAL — un solo listener para todo el sitio
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // A) Contacto / Admin de mensajes
    inicializarFormularioContacto();
    renderizarTabla();

    // B) VetConnect
    console.log('VetConnect JS — Sistema interactivo inicializado con éxito.');
    renderizarMetricas();
    renderizarTablaCitas();
    renderizarListaMascotas();
    inicializarFormulario();
    inicializarToggleMetricas();
});