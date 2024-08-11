import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggle }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="btn btn-primary toggle-btn" onClick={toggle}>
                {isOpen ? 'Collapse' : 'Expand'}
            </button>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link to="/">Bhag Chit Generator</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/bhag-scheduling">Bhag Scheduling</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
