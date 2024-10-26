import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import RestaurantPage from './components/RestaurantPage';
import AuthModal from './components/AuthModal';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    // <div >
    <Router >
      <Header onOpenModal={setModalOpen}  />
      {/* <div className='mx-20 my-20 flex justify-center items-center'> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
      </Routes>
      {isModalOpen && <AuthModal isLogin={isLogin} onClose={() => setModalOpen(false)} />}
      {/* </div> */}
    </Router>
    // </div>
  );
}

export default App;
