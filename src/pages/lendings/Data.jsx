import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import { API_URL } from '../../constant';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver'

const useAuth = () => {
    const navigate = useNavigate();
    const handleUnauthorized = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };
    return { handleUnauthorized };
};

function Data() {
    const [lendings, setLendings] = useState([]);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        lending_id: '',
        total_good_stuff: 0,
        total_defec_stuff: 0,
    });
    const [detailLending, setDetailLending] = useState({ name: '', total_stuff: 0 });

    const { handleUnauthorized } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        const token = localStorage.getItem('access_token');
        axios.get(`${API_URL}/lendings`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setLendings(res.data.data))
            .catch((err) => {
                if (err.response?.status === 401) return handleUnauthorized();
                setError({ message: 'Failed to fetch data.' });
            });
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setError(null);
        const token = localStorage.getItem('access_token');

        try {
            await axios.post(`${API_URL}/restorations`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            resetForm();
            setAlert('Successfully created restoration.');
            fetchData();
        } catch (err) {
            const { response } = err;
            if (response?.status === 401) return handleUnauthorized();
            if (response?.status === 422) {
                setError({ type: 'validation', data: response.data.errors });
            } else {
                setError({ type: 'general', message: response?.data?.message || 'Failed to submit restoration.' });
            }
        }
    };

    const resetForm = () => {
        setFormData({
            lending_id: '',
            total_good_stuff: 0,
            total_defec_stuff: 0,
        });
        setDetailLending({ name: '', total_stuff: 0 });
    };

    const handleBtnDetail = (lending) => {
        setDetailLending(lending);
        setFormData({
            lending_id: lending.id,
            total_good_stuff: lending.restoration?.total_good_stuff || 0,
            total_defec_stuff: lending.restoration?.total_defec_stuff || 0,
            date: lending.restoration?.created_at
                ? new Date(lending.restoration.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })
                : ''
        });
        setIsDetailModalOpen(true);
    };

    const openModal = (lending) => {
        setDetailLending({
            name: lending.stuff.name,
            total_stuff: lending.total_stuff,
        });
        setFormData({
            lending_id: lending.id,
            total_good_stuff: 0,
            total_defec_stuff: 0,
        });
        setError(null);
        setIsModalOpen(true);
    };

    function exportExcel() {
        const formattedData = lendings.map((item, index) => ({
            No: index + 1,
            Name: item.name,
            StuffName: item.stuff.name,
            TotalStuff: item.total_stuff,
            DateOfLending : new Date(item.created_at).toLocaleDateString('id', { dateStyle: "long" }),
            RestorationStatus: item.restoration? 'Restored' : '-',
            RestorationTotalGoodStuff: item.restoration?.total_good_stuff || 0,
            RestorationTotalDefectiveStuff: item.restoration?.total_defec_stuff || 0,
            DateOfRestoration: item.restoration?.created_at
               ? new Date(item.restoration.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })
                : ''
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        saveAs(file, "data_lending.xlsx");
    }

    return (
        <div className="container mt-4">
            {alert && <div className="alert alert-success">{alert}</div>}
            <div className="d-flex justify-content-end mb-4">
                <button className='btn btn-success me-3' onClick={exportExcel}>
                    Export Excel
                </button>
            </div>
            <h2 className="mb-4">Lendings Data</h2>

            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Stuff</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {lendings.map((lending, index) => (
                        <tr
                            key={lending.id || index}
                            style={{
                                backgroundColor: lending.restoration ? 'lightgreen' : 'inherit',
                            }}
                        >
                            <td>{index + 1}</td>
                            <td>{lending.name}</td>
                            <td>{lending.stuff.name}</td>
                            <td>{new Date(lending.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</td>
                            <td>
                                {lending.restoration ? (
                                    <button className="btn btn-secondary" onClick={() => handleBtnDetail(lending)}>
                                        Detail
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => openModal(lending)}>
                                        Create Restoration
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <form className="p-3" onSubmit={handleSubmitForm}>
                        <div className="alert alert-info">
                            Lending <b>{detailLending.name}</b> with total stuff <b>{detailLending.total_stuff}</b>
                        </div>

                        {error && (
                            <div className="alert alert-danger">
                                {error.type === 'validation' ? (
                                    <ul className="mb-0">
                                        {Object.entries(error.data).map(([key, messages]) =>
                                            messages.map((msg, idx) => (
                                                <li key={`${key}-${idx}`}>{msg}</li>
                                            ))
                                        )}
                                    </ul>
                                ) : (
                                    <p>{error.message}</p>
                                )}
                            </div>
                        )}

                        <div className="form-group mt-3">
                            <label htmlFor="total_good_stuff">Total Good Stuff</label>
                            <input
                                type="number"
                                className="form-control"
                                id="total_good_stuff"
                                name="total_good_stuff"
                                value={formData.total_good_stuff}
                                onChange={(e) =>
                                    setFormData({ ...formData, total_good_stuff: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="total_defec_stuff">Total Defec Stuff</label>
                            <input
                                type="number"
                                className="form-control"
                                id="total_defec_stuff"
                                name="total_defec_stuff"
                                value={formData.total_defec_stuff}
                                onChange={(e) =>
                                    setFormData({ ...formData, total_defec_stuff: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>

                        <button className="btn btn-primary mt-3" type="submit">
                            Create
                        </button>
                    </form>
                </Modal>
            )}

            {isDetailModalOpen && (
                <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
                    <div className="p-3">
                        <h4>Restoration Details</h4>
                        <div className="alert alert-info">
                            <p>Date: {formData.date}</p>
                            <p>Total Item of Lending: {formData.total_good_stuff + formData.total_defec_stuff}</p>
                            <p>Total Good Stuff: {formData.total_good_stuff}</p>
                            <p>Total Defective Stuff: {formData.total_defec_stuff}</p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default Data;
