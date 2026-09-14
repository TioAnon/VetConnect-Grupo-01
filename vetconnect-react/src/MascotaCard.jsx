export default function MascotaCard({
  nombre,
  especie,
  edad,
  vacunada
}) {
  return (
    <article className="mascota-card">
      <h3>{nombre}</h3>
      <p><strong>Especie:</strong> {especie}</p>
      <p><strong>Edad:</strong> {edad} años</p>
      <span className={`estado ${vacunada ? "activa" : "pendiente"}`}>
        {vacunada ? "Vacunación al día" : "Vacunación pendiente"}
      </span>
    </article>
  );
}