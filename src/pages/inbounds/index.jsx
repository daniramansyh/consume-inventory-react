import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constant'
import axios from 'axios'
import Modal from '../../components/Modal'

const useAuth = () => {
    const navigate = useNavigate()

    const handleUnauthorized = () => {
        localStorage.removeItem('access_token')
        navigate('/login')
    }

    return { handleUnauthorized }
}

const InboundIndex = () => {
    const [inbounds, setInbounds] = useState([])
    const [state, setState] = useState({
        alert: '',
        isLoaded: false,
        error: null
    })
    const { handleUnauthorized } = useAuth()
    const [isModalOpen, setModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState('')  
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedInbound, setSelectedInbound] = useState(null)

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
        fetchInbound()
    }, [])

    const handleDelete = (inbound) => {
            axios.delete(`${API_URL}/inbound-stuffs/${inbound.id}`)
            .then(res => {
                setState(prev => ({...prev, alert: 'Successfully deleted inbound', error: null }))
                fetchInbound()
                setDeleteModalOpen(false)
            })
            .catch(err => {
                err.response?.status === 401 ? handleUnauthorized() :
                    setState(prev => ({ ...prev, error: err.response?.data || { message: "Failed to fetch data." } }))
            })
    }

    const openDeleteModal = (inbound) => {
        setSelectedInbound(inbound)
        setDeleteModalOpen(true)
    }

    if (!state.isLoaded) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            {state.alert && <div className="alert alert-success my-3 me-3">{state.alert}</div>}
            {state.error && <div className="alert alert-danger my-3 me-3">{state.error.message}</div>}

            <div className="container mt-4">
                <div className="card">
                    <table className="table table-striped table-hover table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Total</th>
                                <th>Proof file</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!state.isLoaded ? (
                                <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                            ) : inbounds.length === 0 ? (
                                <tr><td colSpan="4" className="text-center">No inbounds found</td></tr>
                            ) : inbounds.map((inbound, index) => (
                                <tr key={inbound.id}>
                                    <td>{index + 1}</td>
                                    <td>{inbound.stuff.name}</td>
                                    <td>{inbound.total}</td>
                                    <td>
                                        <img
                                            src={inbound.proof_file}
                                            alt="Proof file"
                                            style={{ height: '60px', cursor: 'pointer' }}
                                            onClick={() => {
                                                setModalOpen(true)
                                                setSelectedImage(inbound.proof_file)
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className='btn btn-sm btn-danger'
                                            onClick={() => openDeleteModal(inbound)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Inbound" >
                {state.error && (
                    <div className="alert alert-danger">
                        {state.error.message}
                    </div>
                )}
                <div className="text-center">
                    <p>Are you sure you want to delete this inbound ?</p>
                    <button type="button" className="btn btn-danger me-2" onClick={() => handleDelete(selectedInbound)}>
                        Yes, Delete
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>
                        Cancel
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Show Image">
                <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '500px' }} />
            </Modal>
        </>
    )
}

export default InboundIndex