import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">PropertyHub</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="propertyDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Property
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="propertyDropdown">
                                <li><Link className="dropdown-item" to="/property">Explore Properties</Link></li>
                                <li><Link className="dropdown-item" to="/property/add">Add Property</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="agentDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Agent
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="agentDropdown">
                                <li><Link className="dropdown-item" to="/agent">Explore Agents</Link></li>
                                <li><Link className="dropdown-item" to="/agent/add">Add Agent</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;