import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import ProductList from './Pages/ProductList/ProductList';
import ProductDetails from './Pages/ProductDetails/ProductDetails';
import News from './Pages/News/News';
import Contact from './Pages/Contact/Contact';
import BurgerMenu from './components/BurgerMenu/BurgerMenu';
import NewsDetail from './Pages/NewsDetail/NewsDetail';
import Layout from './components/PageLayout/Layout';
import Login from './Pages/Login/Login';
import { AuthProvider } from './context/AuthContext';
import MinSide from './Pages/MinSide/MinSide';
import supabase from '../supabase'; // Import supabase for fetching categories

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('id');
        if (error) throw error;

        if (data.length > 0) {
          // Set the first category as default if none is selected
          setCategories(data);
          if (selectedCategory === null) {
            setSelectedCategory(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, [selectedCategory]);

  return (
    <AuthProvider>
      <Router>
        <BurgerMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produkter" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <ProductList selectedCategory={selectedCategory} />
            </Layout>
          } />
          <Route path="/product/:title" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <ProductDetails />
            </Layout>
          } />
          <Route path="/nyheder" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <News />
            </Layout>
          } />
          <Route path="/kontakt" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <Contact />
            </Layout>
          } />
          <Route path="/login" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <Login />
            </Layout>
          } />
          <Route path="/nyheder/:id" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <NewsDetail />
            </Layout>
          } />
          <Route path="/minside" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <MinSide />
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
