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

const StuffIndex = () => {
    const [stuffs, setStuffs] = useState([])
    const [formData, setFormData] = useState({ name: '', type: '' })
    const [state, setState] = useState({
        error: null,
        isLoaded: false,
        isOpen: false,
        isEdit: false,
        isDelete: false,
        currentId: null,
        alert: '',
    })
    const { handleUnauthorized } = useAuth()

    const [formInbound, setFormInbound] = useState({
        stuff_id: '',
        total: 0,
        proof_file: null,
    })
    const [isModalInboundOpen, setModalInboundOpen] = useState(false)
    const [inboundError, setInboundError] = useState(null)

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

    useEffect(() => {
        fetchStuffs()
    })

    const closeModal = () => {
        setFormData({ name: '', type: '' })
        setState(prev => ({ ...prev, error: null, isOpen: false, isEdit: false, isDelete: false, currentId: null }))
    }

    const handleAction = (type, data = null) => {
        if (type === 'add') return setState(prev => ({ ...prev, isOpen: true }))
        if (type === 'edit') {
            setFormData({ name: data.name, type: data.type })
            setState(prev => ({ ...prev, currentId: data.id, isEdit: true, isOpen: true }))
        }
        if (type === 'delete') {
            setFormData({ name: data.name, type: data.type })
            setState(prev => ({ ...prev, currentId: data.id, isDelete: true, isOpen: true }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const { isEdit, isDelete, currentId } = state

        const request = isDelete
            ? axios.delete(`${API_URL}/stuffs/${currentId}`)
            : isEdit
                ? axios.patch(`${API_URL}/stuffs/${currentId}`, formData)
                : axios.post(`${API_URL}/stuffs`, formData)

        request.then(res => {
            const updatedData = res?.data?.data
            setStuffs(prev => {
                if (isDelete) return prev.filter(item => item.id !== currentId)
                if (isEdit) return prev.map(item => item.id === currentId ? updatedData : item)
                return [...prev, updatedData]
            })
            setState(prev => ({
                ...prev,
                alert: isDelete ? "Item deleted successfully" : isEdit ? "Updated successfully" : "Added successfully"
            }))
            closeModal()
        }).catch(err => {
            err.response?.status === 401 ? handleUnauthorized() :
                setState(prev => ({ ...prev, error: err.response?.data || { message: "Action failed." } }))
        })
    }

    const handleInboundBtn = (stuffId) => {
        setFormInbound({ ...formInbound, stuff_id: stuffId })
        setModalInboundOpen(true)
        setInboundError(null)
    }

    const handleInboundSubmit = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('stuff_id', formInbound.stuff_id)
        data.append('total', formInbound.total)
        data.append('proof_file', formInbound.proof_file)

        axios.post(`${API_URL}/inbound-stuffs`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                setModalInboundOpen(false)
                setFormInbound({ stuff_id: '', total: 0, proof_file: null })
                setState(prev => ({ ...prev, alert: "Successfully added data inbound stock" }))
                fetchStuffs()
            })
            .catch(err => {
                err.response?.status === 401 ? handleUnauthorized() :
                    setInboundError(err.response?.data || { message: "Action failed." })
            })
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

            <div className="container mt-4">
                <div className="d-flex justify-content-end mb-4">
                    <button className="btn btn-primary" onClick={() => handleAction('add')}>
                        <i className="bi bi-plus-circle me-2"></i>Add New Category
                    </button>
                </div>

                <div className="card">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th rowSpan={2}>No</th>
                                    <th rowSpan={2}>Name</th>
                                    <th rowSpan={2}>Type</th>
                                    <th colSpan={2} className="text-center">Stock</th>
                                    <th rowSpan={2}>Action</th>
                                </tr>
                                <tr>
                                    <th className="text-center">Available</th>
                                    <th className="text-center">Defect</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stuffs.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center">No categories found</td></tr>
                                ) : stuffs.map((stuff, index) => (
                                    <tr key={stuff.id}>
                                        <td>{index + 1}</td>
                                        <td>{stuff.name}</td>
                                        <td>{stuff.type}</td>
                                        <td className="text-center">{stuff.stuff_stock?.total_available || 0}</td>
                                        <td className="text-center">
                                            <span className={stuff.stuff_stock?.total_defec < 3 ? 'text-danger' : ''}>
                                                {stuff.stuff_stock?.total_defec || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <button className='btn btn-sm btn-primary me-2' onClick={() => handleInboundBtn(stuff.id)}>Add Stock</button>
                                            <button className='btn btn-sm btn-info me-2' onClick={() => handleAction('edit', stuff)}>Edit</button>
                                            <button className='btn btn-sm btn-danger' onClick={() => handleAction('delete', stuff)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Stuff */}
            <Modal isOpen={state.isOpen} onClose={closeModal} title={state.isDelete ? "Delete Category" : state.isEdit ? "Edit Category" : "Add New Category"}
            >
                <form onSubmit={handleSubmit}>
                    {state.error && (
                        <ol className="alert alert-danger">
                            {state.error.data
                                ? Object.entries(state.error.data).map(([k, v]) => <li key={k}>{v}</li>)
                                : <li>{state.error.message}</li>
                            }
                        </ol>
                    )}
                    {state.isDelete ? (
                        <div className="text-center">
                            <p>Are you sure you want to delete <strong>{formData.name}</strong>?</p>
                            <button type="submit" className="btn btn-danger me-2">Yes, Delete</button>
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <label>Type</label>
                                <select
                                    className="form-select"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="" disabled>-- Select Type --</option>
                                    <option value="HTL/KLN">HTL/KLN</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Sarpras">Sarpras</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">
                                {state.isEdit ? "Update" : "Add"}
                            </button>
                        </>
                    )}
                </form>
            </Modal>

            {/* Modal Inbound */}
            <Modal isOpen={isModalInboundOpen} onClose={() => setModalInboundOpen(false)} title={"Add Stock"}>
                <form onSubmit={handleInboundSubmit}>
                    {inboundError && (
                        <ol className="alert alert-danger m-2 p-2">
                            {inboundError.data
                                ? Object.entries(inboundError.data).map(([key, value]) => <li key={key}>{value}</li>)
                                : <li>{inboundError.message}</li>}
                        </ol>
                    )}
                    <div className='mb-3 d-flex flex-column justify-content-start'>
                        <label className='form-label'>Total Item <span className='text-danger'>*</span></label>
                        <input
                            className='form-control'
                            type="number"
                            value={formInbound.total}
                            onChange={(e) => setFormInbound({ ...formInbound, total: e.target.value })}
                        />
                    </div>
                    <div className='mb-3 d-flex flex-column justify-content-start'>
                        <label className='form-label'>Proof Image<span className='text-danger'>*</span></label>
                        <input
                            className='form-control'
                            type="file"
                            onChange={(e) => setFormInbound({ ...formInbound, proof_file: e.target.files[0] })}
                        />
                    </div>
                    <button type='submit' className='btn btn-primary'>Add Stock</button>
                </form>
            </Modal>
        </>
    )
}

export default StuffIndex
