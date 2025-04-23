import React from 'react'
import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'

export default function Template() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex-grow-1 bg-gray-100 w-100 p-4">
                <Outlet />
            </div>
            <footer className="bg-gray-800 text-white py-4 shadow-lg">
                <div className="container mx-auto px-4 text-center">
                    <small className="text-black-300">&copy; 2025 Inventaris System. All rights reserved.</small>
                </div>
            </footer>
        </>
    )
}