import React from 'react';
import { FaUser, FaChartBar, FaCalendar, FaClipboardList } from 'react-icons/fa';

export default function Dashboard() {
    return (
        <div className="container-fluid min-vh-100 bg-light py-5">
            <div className="row g-4">
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-primary p-3 me-3">
                                    <FaUser className="text-white fs-4" />
                                </div>
                                <div>
                                    <h6 className="mb-1">Total Users</h6>
                                    <h3 className="mb-0">1,234</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-success p-3 me-3">
                                    <FaChartBar className="text-white fs-4" />
                                </div>
                                <div>
                                    <h6 className="mb-1">Revenue</h6>
                                    <h3 className="mb-0">$45.2K</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-warning p-3 me-3">
                                    <FaCalendar className="text-white fs-4" />
                                </div>
                                <div>
                                    <h6 className="mb-1">Events</h6>
                                    <h3 className="mb-0">28</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-xl-3">
                    <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="rounded-circle bg-danger p-3 me-3">
                                    <FaClipboardList className="text-white fs-4" />
                                </div>
                                <div>
                                    <h6 className="mb-1">Tasks</h6>
                                    <h3 className="mb-0">145</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="card-title mb-4">Welcome to Dashboard</h4>
                            <p className="card-text">
                                Track your business metrics, analyze trends, and make data-driven decisions with our comprehensive dashboard. Monitor key performance indicators and stay updated with real-time statistics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}