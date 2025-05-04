import { useState, useEffect } from 'react'

function Dashboard() {
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    recentTransactions: []
  })

  const fetchStuffs = () => {
    axios.get(`${API_URL}/stuffs`)
      .then(res => {
        setStuffs(res.data.data)
        setState(prev => ({ ...prev, isLoaded: true }))
      })
      .catch(err => {
        err.response?.status === 401 ? handleUnauthorized() :
          setState(prev => ({ ...prev, error: err.response?.data || { message: "Failed to fetch data." } }))
      })
  }
  const fetchInbound = () => {
    axios.get(`${API_URL}/inbound-stuffs`)
      .then(res => {
        setInbounds(res.data.data)
        setState(prev => ({ ...prev, isLoaded: true }))
      })
      .catch(err => {
        err.response?.status === 401 ? handleUnauthorized() :
          setState(prev => ({ ...prev, error: err.response?.data || { message: "Failed to fetch data." } }))
      })
  }

  useEffect(() => {
    setInventoryStats({
      totalItems: 156,
      lowStock: 12,
      outOfStock: 3,
      recentTransactions: [
        { id: 1, item: "Laptop", quantity: 5, type: "incoming", date: "2023-12-01" },
        { id: 2, item: "Mouse", quantity: 10, type: "outgoing", date: "2023-12-02" },
        { id: 3, item: "Keyboard", quantity: 8, type: "incoming", date: "2023-12-03" }
      ]
    })
  }, [])

  return (
    <div className="container py-4">
      <header className="text-center mb-5">
        <h1 className="display-4">Inventory Management Dashboard</h1>
        <p className="lead">Real-time inventory monitoring system</p>
      </header>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h3 className="card-title">Total Items</h3>
              <p className="display-6">{inventoryStats.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-warning text-dark">
            <div className="card-body">
              <h3 className="card-title">Low Stock Items</h3>
              <p className="display-6">{inventoryStats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-danger text-white">
            <div className="card-body">
              <h3 className="card-title">Out of Stock</h3>
              <p className="display-6">{inventoryStats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h2 className="h4 mb-0">Recent Transactions</h2>
        </div>
        <div className="card-body">
          <div className="list-group">
            {inventoryStats.recentTransactions.map(transaction => (
              <div key={transaction.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span className="fw-bold">{transaction.item}</span>
                <span className={`badge ${transaction.type === 'incoming' ? 'bg-success' : 'bg-danger'}`}>
                  {transaction.type}
                </span>
                <span>Qty: {transaction.quantity}</span>
                <span className="text-muted">{transaction.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="d-grid gap-2 d-md-flex justify-content-md-center">
        <button className="btn btn-primary">Add New Item</button>
        <button className="btn btn-secondary">Generate Report</button>
        <button className="btn btn-info">View All Items</button>
      </div>
    </div>
  )
}

export default Dashboard
