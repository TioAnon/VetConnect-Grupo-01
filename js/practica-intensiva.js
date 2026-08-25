/**
 * VetConnect — Práctica Intensiva JavaScript (Semana 4)
 * Métodos implementados: forEach, filter, find, some, sort, localStorage.
 * Desafíos autónomos: Cálculo de edad promedio y botón de restauración de semilla.
 */

// 1. Datos Semilla Iniciales (Desafío 1)
const semillas = [
  { id: 1, nombre: "Firulais", especie: "Perro", edad: 5, activo: true },
  { id: 2, nombre: "Michi", especie: "Gato", edad: 3, activo: true },
  { id: 3, nombre: "Rocky", especie: "Perro", edad: 8, activo: false }
];

// Extensión Investigada: LocalStorage (Persistencia)
const cargarMascotas = () => {
  const data = localStorage.getItem("vet_practica_mascotas");
  return data ? JSON.parse(data) : [...semillas];
};

const guardarEnStorage = () => {
  localStorage.setItem("vet_practica_mascotas", JSON.stringify(mascotas));
};

let mascotas = cargarMascotas();

// Referencias al DOM
const tablaMascotas = document.querySelector("#tablaMascotas");
const totalMascotasEl = document.querySelector("#totalMascotas");
const totalPerrosEl = document.querySelector("#totalPerros");
const totalGatosEl = document.querySelector("#totalGatos");
const promedioEdadEl = document.querySelector("#promedioEdad");
const formulario = document.querySelector("#formMascota");
const mensaje = document.querySelector("#mensaje");
const inputBuscar = document.querySelector("#buscar");
const selectFiltro = document.querySelector("#filtroEspecie");
const btnOrdenar = document.querySelector("#ordenar");
const btnRestaurar = document.querySelector("#btnRestaurar");

// Desafío 2: Renderizar la Tabla
function mostrarMascotas(lista) {
  if (!tablaMascotas) return;
  tablaMascotas.innerHTML = "";

  if (lista.length === 0) {
    tablaMascotas.innerHTML = '<tr><td colspan="5" class="text-center py-3 text-muted">No se encontraron mascotas.</td></tr>';
    return;
  }

  lista.forEach((mascota) => {
    const fila = document.createElement("tr");
    const estadoBadge = mascota.activo 
      ? '<span class="badge bg-success">Activo</span>' 
      : '<span class="badge bg-secondary">Inactivo</span>';

    fila.innerHTML = `
      <td class="fw-semibold">${mascota.nombre}</td>
      <td>${mascota.especie}</td>
      <td>${mascota.edad} años</td>
      <td>${estadoBadge}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="cambiarEstado(${mascota.id})">Cambiar estado</button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarMascota(${mascota.id})">Eliminar</button>
      </td>
    `;
    tablaMascotas.appendChild(fila);
  });
}

// Desafío 3 y Desafío Autónomo 1: Indicadores y Promedio de Edad
function actualizarIndicadores() {
  if (totalMascotasEl) totalMascotasEl.textContent = mascotas.length;
  if (totalPerrosEl) totalPerrosEl.textContent = mascotas.filter(m => m.especie === "Perro").length;
  if (totalGatosEl) totalGatosEl.textContent = mascotas.filter(m => m.especie === "Gato").length;

  // Desafío Autónomo: Calcular promedio de edad
  if (promedioEdadEl) {
    if (mascotas.length === 0) {
      promedioEdadEl.textContent = "0";
    } else {
      const sumaEdades = mascotas.reduce((acc, m) => acc + Number(m.edad), 0);
      promedioEdadEl.textContent = (sumaEdades / mascotas.length).toFixed(1);
    }
  }
}

// Desafío 10: Refactorizar / Actualizar Vista Global
function actualizarInterfaz() {
  guardarEnStorage();
  mostrarMascotas(mascotas);
  actualizarIndicadores();
}

// Desafío 4: Registrar y Validar con some()
if (formulario) {
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = document.querySelector("#nombre").value.trim();
    const especie = document.querySelector("#especie").value;
    const edadVal = document.querySelector("#edad").value;
    const edad = Number(edadVal);

    if (nombre.length < 2 || especie === "" || edadVal === "" || edad < 0 || edad > 30) {
      mensaje.innerHTML = '<div class="alert alert-danger py-2 small">Revisa los datos: nombre (mín 2 letras), especie obligatoria y edad entre 0 y 30.</div>';
      return;
    }

    const existe = mascotas.some(m => m.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
      mensaje.innerHTML = '<div class="alert alert-warning py-2 small">La mascota ya se encuentra registrada.</div>';
      return;
    }

    mascotas.push({ id: Date.now(), nombre, especie, edad, activo: true });
    actualizarInterfaz();
    mensaje.innerHTML = `<div class="alert alert-success py-2 small">${nombre} fue registrado correctamente.</div>`;
    formulario.reset();
  });
}

// Desafío 5: Búsqueda en Tiempo Real
if (inputBuscar) {
  inputBuscar.addEventListener("input", (event) => {
    const texto = event.target.value.toLowerCase();
    const filtradas = mascotas.filter(m => m.nombre.toLowerCase().includes(texto));
    mostrarMascotas(filtradas);
  });
}

// Desafío 6: Filtro por Especie
if (selectFiltro) {
  selectFiltro.addEventListener("change", (event) => {
    const esp = event.target.value;
    mostrarMascotas(esp === "Todas" ? mascotas : mascotas.filter(m => m.especie === esp));
  });
}

// Desafío 7: Cambiar Estado con find()
window.cambiarEstado = function(id) {
  const mascota = mascotas.find(m => m.id === id);
  if (mascota) mascota.activo = !mascota.activo;
  actualizarInterfaz();
};

// Desafío 8: Eliminar con filter()
window.eliminarMascota = function(id) {
  if (!confirm("¿Deseas eliminar esta mascota?")) return;
  mascotas = mascotas.filter(m => m.id !== id);
  actualizarInterfaz();
};

// Desafío 9: Ordenar A-Z con sort() y localeCompare()
if (btnOrdenar) {
  btnOrdenar.addEventListener("click", () => {
    mascotas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    actualizarInterfaz();
  });
}

// Desafío Autónomo 2: Restaurar Datos Semilla
if (btnRestaurar) {
  btnRestaurar.addEventListener("click", () => {
    if (!confirm("¿Restaurar los datos originales de prueba?")) return;
    mascotas = [...semillas];
    actualizarInterfaz();
    if (mensaje) mensaje.innerHTML = '<div class="alert alert-info py-2 small">Datos restaurados a los valores semilla.</div>';
  });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  console.log("VetConnect JavaScript iniciado");
  actualizarInterfaz();
});