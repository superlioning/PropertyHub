import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
// Property
import Property from './pages/Property';
import PropertyView from './pages/PropertyView';
import PropertyAdd from './pages/PropertyAdd';
import PropertyUpdate from './pages/PropertyUpdate';
// Agent
import Agent from './pages/Agent';
import AgentView from './pages/AgentView';
import AgentAdd from './pages/AgentAdd';
import AgentUpdate from './pages/AgentUpdate';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container mt-3 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/property" element={<Property />} />
            <Route path="/property/:mls" element={<PropertyView />} />
            <Route path="/property/add" element={<PropertyAdd />} />
            <Route path="/property/update/:mls" element={<PropertyUpdate />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/agent/:registrationNumber" element={<AgentView />} />
            <Route path="/agent/add" element={<AgentAdd />} />
            <Route path="/agent/update/:registrationNumber" element={<AgentUpdate />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;