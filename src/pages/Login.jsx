import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [login, setLogin] = useState({
        username: "",
        password: ""
    });

    // method untuk memannipulasi yang berhubungan dengan routing
    let navigate = useNavigate();

    function LoginProcess(e) {
        e.preventDefault();
        axios.post('http://45.64.100.26:88/API-Lumen/public/login', login)
        .then(res => {
            console.log(res);
            // jika login berhasil simpan data token dan user ke localstorage
            localStorage.setItem('access_token', res.data.data.access_token);
            // gunakan JSON Stringify untuk mengubah object menjadi string, localstorage hanya bisa menyimpan string
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
            // urutan titik setelah res (res.) disesuaikan isi res pada console log
            navigate('/dashboard');
            // mengarahkan ke halaman dashboard
        })
        .catch(err => {
           setError(err.response.data);
        });
    }

    const [error,setError] = useState([])

    return (
        <div className="bg-gradient-dark min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <form className="card shadow-lg border-0" onSubmit={LoginProcess}>
                            <div className="card-header bg-secondary text-white text-center py-4">
                                <h3 className="mb-0">Welcome Back</h3>
                            </div>
                            {
                                Object.keys(error).length > 0 && (
                                    <div className="alert alert-danger m-3">
                                        {
                                            Object.entries(error.data).length > 0 ?
                                            Object.entries(error.data).map(([key,value]) => (
                                                <div key={key}>{value}</div>
                                            )) : error.message
                                        }
                                    </div>
                                )
                            }
                            <div className="card-body p-4">
                                <div className="mb-4">
                                    <label className="form-label text-muted">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="username"
                                            placeholder="Enter your username"
                                            value={login.username}
                                            onChange={(e) => setLogin({...login, username: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light">
                                            <i className="bi bi-lock"></i>
                                        </span>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            id="password"
                                            placeholder="Enter your password"
                                            value={login.password}
                                            onChange={(e) => setLogin({...login, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button className="btn btn-secondary w-100 py-2 mb-3" type="submit">
                                    Sign In
                                </button>
                                <div className="text-center">
                                    <small className="text-muted">
                                        Don't have an account? <a href="#" className="text-secondary">Sign up</a>
                                    </small>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}