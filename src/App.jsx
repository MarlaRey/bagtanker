import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import ProductList from './Pages/ProductList/ProductList';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import News from './Pages/News/News';
import Contact from './Pages/Contact/Contact';
import BurgerMenu from './components/BurgerMenu/BurgerMenu';
import NewsDetail from './Pages/News/NewsDetail';
import Layout from './components/PageLayout/Layout';
import Login from './Pages/Login/Login';
import { AuthProvider } from './context/AuthContext';
import MinSide from './Pages/MinSide/MinSide';

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <AuthProvider>
      <Router>
        <BurgerMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produkter" element={<Layout onCategoryChange={handleCategoryChange}>
            <ProductList selectedCategory={selectedCategory} />
          </Layout>} />
          <Route path="/produkt/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="/nyheder" element={<Layout><News /></Layout>} />
          <Route path="/kontakt" element={<Layout><Contact /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/nyheder/:id" element={<Layout><NewsDetail /></Layout>} />
          <Route path="/minside" element={<Layout><MinSide /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
