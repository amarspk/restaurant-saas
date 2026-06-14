export function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Restaurants', value: '—', color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: '—', color: 'bg-green-50 text-green-700' },
          { label: 'Suspended', value: '—', color: 'bg-red-50 text-red-700' },
        ].map((stat) => (
          <div key={stat.label} className={`card p-6 ${stat.color}`}>
            <p className="text-sm font-medium opacity-75">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-gray-400 text-sm">Step 2 will wire up live data.</p>
    </div>
  )
}
