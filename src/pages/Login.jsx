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
        <form className="card w-50 d-block mx-auto mt-5" onSubmit={LoginProcess}>
            <div className="card-header text-center fw-bold fs-3">Login</div>
            {
                Object.keys(error).length > 0 ? (
                    <ol className="alert alert-danger">
                        {
                            Object.entries(error.data).length > 0 ?
                            Object.entries(error.data).map(([key,value]) => (
                                <li>{value}</li>
                            )) : error.message
                        }
                    </ol>
                ) : ''
            }
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="username"
                        placeholder="Masukan Username"
                        value={login.username}
                        onChange={(e) => setLogin({...login, username: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password"
                        placeholder="Masukan Password"
                        value={login.password}
                        onChange={(e) => setLogin({...login, password: e.target.value })}
                    />
                </div>
                <div className="d-grid">
                    <button className="btn btn-primary" type="submit">Login</button>
                </div>
            </div>
        </form>
    );
}