import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../constant'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const StatCard = ({ title, value, bgClass = "bg-primary", textClass = "text-white" }) => (
  <div className="col-md-4">
    <div className={`card text-center ${bgClass} ${textClass}`}>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="display-6">{value}</p>
      </div>
    </div>
  </div>
)

function Dashboard() {
  const [stuffs, setStuffs] = useState([])
  const [inbounds, setInbounds] = useState([])
  const [lendings, setLendings] = useState([])
  const [state, setState] = useState({ isLoaded: false, isError: false, error: null })

  const handleUnauthorized = () => {
    console.warn('Unauthorized. Redirecting to login...')
  }

  const fetchData = async () => {
    try {
      const stuffsRes = await axios.get(`${API_URL}/stuffs`)
      const inboundsRes = await axios.get(`${API_URL}/inbound-stuffs`) 
      const lendingsRes = await axios.get(`${API_URL}/lendings`)

      setStuffs(stuffsRes.data.data)
      setInbounds(inboundsRes.data.data)
      setLendings(lendingsRes.data.data)
      
      setState({
        isLoaded: true,
        isError: false,
        error: null
      })

    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      // Handle other errors
      setState({
        isLoaded: false,
        isError: true,
        error: err.response?.data || { message: "Failed to fetch data." }
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalItems = stuffs.length
  const lowStock = stuffs.filter(s => s.stuff_stock?.total_available < 5).length
  const outOfStock = stuffs.filter(s => s.stuff_stock?.total_available === 0).length

  const typeDistribution = stuffs.reduce((acc, stuff) => {
    const type = stuff.type || 'Uncategorized'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const pieChartData = {
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        data: Object.values(typeDistribution),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
      }
    ]
  }

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ''
            const value = context.raw || 0
            const total = Object.values(typeDistribution).reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: '2-digit', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  if (state.error) return (
    <div className="alert alert-danger text-center m-4" role="alert">
      {state.error.message}
    </div>
  )
  
  if (!state.isLoaded) return (
    <div className="d-flex justify-content-center m-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  return (
    <div className="container py-4">
      <header className="text-center mb-5">
        <h1 className="display-4">Inventory Management Dashboard</h1>
        <p className="lead">Real-time inventory monitoring system</p>
      </header>

      <div className="row mb-4">
        <StatCard title="Total Items" value={totalItems} />
        <StatCard title="Low Stock Items" value={lowStock} bgClass="bg-warning" textClass="text-dark" />
        <StatCard title="Out of Stock" value={outOfStock} bgClass="bg-danger" />
      </div>

      <div className="container-fluid mb-4">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center bg-light">
                <h2 className="h4 mb-0 text-primary">Item Type Distribution</h2>
                <h2 className="h4 mb-0 text-secondary">Type Breakdown</h2>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div style={{ height: '400px', position: 'relative' }}>
                      {Object.keys(typeDistribution).length > 0 ? (
                        <Pie data={pieChartData} options={{ ...pieOptions, maintainAspectRatio: false }} />
                      ) : (
                        <div className="alert alert-info">No data available to display.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="list-group list-group-flush shadow-sm">
                      {Object.entries(typeDistribution).map(([type, count]) => (
                        <div key={type} className="list-group-item d-flex justify-content-between align-items-center py-3 hover-shadow">
                          <p className="h6 mb-0">{type}</p>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-primary rounded-pill px-3 py-2">{count} items</span>
                            <span className="badge bg-info ms-2 rounded-pill px-3 py-2">
                              {((count / totalItems) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="h4 mb-0">Recent Inbound Transactions</h2>
          <button 
            onClick={fetchData} 
            className="btn btn-sm btn-outline-primary"
            disabled={!state.isLoaded}
          >
            Refresh Data
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Proof</th>
                </tr>
              </thead>
              <tbody>
                {inbounds.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">No recent transactions</td>
                  </tr>
                ) : (
                  inbounds.map(transaction => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="fw-bold">{transaction.stuff?.name || 'Unknown Item'}</div>
                        <small className="text-muted">Type: {transaction.stuff?.type || 'Uncategorized'}</small>
                      </td>
                      <td><span className="badge bg-success">{transaction.total}</span></td>
                      <td>{formatDate(transaction.date_time)}</td>
                      <td>
                        {transaction.proof_file ? (
                          <a 
                            href={transaction.proof_file} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View Proof
                          </a>
                        ) : (
                          <span className="text-muted">No proof available</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
