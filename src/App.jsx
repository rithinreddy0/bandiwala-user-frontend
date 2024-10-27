import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RestaurantPage from './components/RestaurantPage';
function App() {
  

  return (
    
    <Router >
      
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
      </Routes>
      
    </Router>
    
  );
}

export default App;
