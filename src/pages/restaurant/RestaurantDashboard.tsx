export function RestaurantDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Orders', value: '—' },
          { label: 'Products', value: '—' },
          { label: 'Categories', value: '—' },
        ].map((stat) => (
          <div key={stat.label} className="card p-6">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-gray-400 text-sm">Step 2 will wire up live data.</p>
    </div>
  )
}
