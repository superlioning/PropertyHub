import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Property from './pages/Property';
import Agent from './pages/Agent';
import AgentView from './pages/AgentView';
import PropertyAdd from './pages/PropertyAdd';
import AgentAdd from './pages/AgentAdd';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container mt-3 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property" element={<Property />} />
            <Route path="/property/add" element={<PropertyAdd />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/agent/add" element={<AgentAdd />} />
            <Route path="/agent/:registrationNumber" element={<AgentView />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;