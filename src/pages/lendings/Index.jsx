import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../constant'
import Modal from '../../components/Modal'

export const Lendings = () => {
    const [stuffs, setStuffs] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedStuff, setSelectedStuff] = useState(null)
    const [formData, setFormData] = useState({ name: '', quantity: 0, note: '' })
    const [alert, setAlert] = useState({ show: false, message: '', type: '' })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${API_URL}/stuffs`)
                setStuffs(res.data.data || [])
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
                setAlert({ show: true, message: 'Failed to fetch data', type: 'danger' })
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedStuff) return

        if (formData.quantity > selectedStuff.stuff_stock.total_available) {
            setAlert({ show: true, message: 'Quantity exceeds stock', type: 'danger' })
            return
        }

        try {
            await axios.post(`${API_URL}/lendings`, {
                stuff_id: selectedStuff.id,
                name: formData.name,
                notes: formData.note,
                total_stuff: formData.quantity,
            })

            await axios.patch(`${API_URL}/stuffs/${selectedStuff.id}`, {
                ...selectedStuff,
                total_available: selectedStuff.stuff_stock.total_available - formData.quantity,
            })

            setFormData({ name: '', quantity: 0, note: '' })
            setModalOpen(false)
            setAlert({ show: true, message: 'Lending added!', type: 'success' })

            const updatedRes = await axios.get(`${API_URL}/stuffs`)
            setStuffs(updatedRes.data.data || [])
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
            setAlert({ show: true, message: 'Failed to add lending', type: 'danger' })
        }
    }

    return (
        <>
            {alert.show && (
                <div className="container mt-3">
                    <div className={`alert alert-${alert.type} alert-dismissible fade show d-flex justify-content-between align-items-center`}>
                        <span>{alert.message}</span>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setAlert({ show: false })}
                        ></button>
                    </div>
                </div>
            )}

            <div className="container my-5">
                <div className="row g-4">
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        stuffs.map((stuff) => (
                            <div key={stuff.id} className="col-md-4">
                                <div className="card h-100 text-center">
                                    <div className="card-body">
                                        <h5>{stuff.name}</h5>
                                        <p>Available: {stuff.stuff_stock?.total_available || 0}</p>
                                        <button
                                            className="btn btn-outline-primary"
                                            disabled={!stuff.stuff_stock?.total_available}
                                            onClick={() => {
                                                setSelectedStuff(stuff)
                                                setModalOpen(true)
                                            }}
                                        >
                                            {stuff.stuff_stock?.total_available ? 'Select' : 'Out of Stock'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    setSelectedStuff(null)
                    setFormData({ name: '', quantity: 0, note: '' })
                }}
                title={`Add Lending - ${selectedStuff?.name || ''}`}
            >
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-control mb-3"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="form-control mb-3"
                        min="1"
                        max={selectedStuff?.stuff_stock?.total_available}
                        required
                    />
                    <textarea
                        placeholder="Note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="form-control mb-3"
                    />
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
