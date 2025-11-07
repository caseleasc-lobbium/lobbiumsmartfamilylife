export default function StatCard({ title, value, color }) {
  return (
    <div className={`${color} p-6 rounded-2xl shadow hover:shadow-lg transition`}>
      <h3 className="text-gray-700 text-sm font-medium mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}