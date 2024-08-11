import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BhagChitGenerator from './components/BhagChitGenerator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Bhag Chit Generator</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<BhagChitGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
