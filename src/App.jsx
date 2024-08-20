// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './Pages/Home/Home';
import ProductList from './Pages/ProductList/ProductList';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import News from './Pages/News/News';
import Contact from './Pages/Contact/Contact';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import BurgerMenu from './components/BurgerMenu/BurgerMenu';
import NewsDetail from './Pages/News/NewsDetail';
import Layout from './components/PageLayout/Layout';


const App = () => {
  return (
    <Router>
      <BurgerMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produkter" element={<Layout><ProductList /></Layout>} />
          <Route path="/produkt/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="/nyheder" element={<Layout><News /></Layout>} />
          <Route path="/kontakt" element={<Layout><Contact /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/nyheder/:id" element={<Layout><NewsDetail /></Layout>} />
        </Routes>
    </Router>
  );
};

export default App;
