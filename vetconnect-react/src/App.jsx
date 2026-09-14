import { useState } from "react";
import "./App.css";
import Header from "./Header";
import StatCard from "./StatCard";
import MascotaCard from "./MascotaCard";

export default function App() {
  const [mascotas, setMascotas] = useState([
    {
      id: 1,
      nombre: "Firulais",
      especie: "Perro",
      edad: 5,
      vacunada: true
    },
    {
      id: 2,
      nombre: "Michi",
      especie: "Gato",
      edad: 3,
      vacunada: false
    },
    {
      id: 3,
      nombre: "Luna",
      especie: "Gato",
      edad: 4,
      vacunada: true
    }
  ]);

  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [edad, setEdad] = useState("");

  const totalPerros = mascotas.filter(
    (mascota) => mascota.especie === "Perro"
  ).length;

  const totalGatos = mascotas.filter(
    (mascota) => mascota.especie === "Gato"
  ).length;

  function registrarMascota(event) {
    event.preventDefault();

    if (nombre.trim() === "" || edad === "") {
      alert("Completa todos los campos");
      return;
    }

    const nuevaMascota = {
      id: Date.now(),
      nombre: nombre.trim(),
      especie: especie,
      edad: Number(edad),
      vacunada: false
    };

    setMascotas([...mascotas, nuevaMascota]);
    setNombre("");
    setEspecie("Perro");
    setEdad("");
  }

  return (
    <div className="app">
      <Header />

      <main className="contenedor">
        <section className="grid-estadisticas">
          <StatCard
            titulo="Mascotas registradas"
            valor={mascotas.length}
          />
          <StatCard
            titulo="Perros"
            valor={totalPerros}
          />
          <StatCard
            titulo="Gatos"
            valor={totalGatos}
          />
        </section>

        <form className="formulario" onSubmit={registrarMascota}>
          <h2>Registrar mascota</h2>
          <div className="formulario-grid">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
            <select
              value={especie}
              onChange={(event) => setEspecie(event.target.value)}
            >
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
            </select>
            <input
              type="number"
              min="0"
              placeholder="Edad"
              value={edad}
              onChange={(event) => setEdad(event.target.value)}
            />
            <button type="submit">Registrar</button>
          </div>
        </form>

        <section>
          <h2>Mascotas</h2>
          <div className="grid-mascotas">
            {mascotas.map((mascota) => (
              <MascotaCard
                key={mascota.id}
                nombre={mascota.nombre}
                especie={mascota.especie}
                edad={mascota.edad}
                vacunada={mascota.vacunada}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}