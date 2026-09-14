export default function StatCard({ titulo, valor }) {
  return (
    <article className="stat-card">
      <h2>{valor}</h2>
      <p>{titulo}</p>
    </article>
  );
}