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
import supabase from '../supabase'; // Importerer supabase til hentning af kategorier

const App = () => {
  // State til at gemme den valgte kategori
  const [selectedCategory, setSelectedCategory] = useState(null);
  // State til at gemme alle kategorier
  const [categories, setCategories] = useState([]);

  // Håndterer ændring af kategori
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Henter kategorier fra supabase ved opstart eller når selectedCategory ændres
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Henter kategorier fra databasen
        const { data, error } = await supabase.from('categories').select('id');
        if (error) throw error;

        if (data.length > 0) {
          // Sætter første kategori som standard, hvis ingen kategori er valgt
          setCategories(data);
          if (selectedCategory === null) {
            setSelectedCategory(data[0].id);
          }
        }
      } catch (error) {
        console.error('Fejl ved hentning af kategorier', error);
      }
    };

    fetchCategories();
  }, [selectedCategory]);

  return (
    <AuthProvider>
      <Router>
        {/* Viser burger-menuen på alle sider */}
        <BurgerMenu />
        <Routes>
          {/* Rute til forsiden */}
          <Route path="/" element={<Home />} />
          
          {/* Rute til produktliste med layout og valgte kategorier */}
          <Route path="/produkter" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <ProductList selectedCategory={selectedCategory} />
            </Layout>
          } />
          
          {/* Rute til produktdetaljer med layout og valgte kategorier */}
          <Route path="/product/:title" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <ProductDetails />
            </Layout>
          } />
          
          {/* Rute til nyheder med layout og valgte kategorier */}
          <Route path="/nyheder" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <News />
            </Layout>
          } />
          
          {/* Rute til kontakt med layout og valgte kategorier */}
          <Route path="/kontakt" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <Contact />
            </Layout>
          } />
          
          {/* Rute til login med layout og valgte kategorier */}
          <Route path="/login" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <Login />
            </Layout>
          } />
          
          {/* Rute til nyheddetaljer med layout og valgte kategorier */}
          <Route path="/nyheder/:id" element={
            <Layout onCategoryChange={handleCategoryChange} categories={categories}>
              <NewsDetail />
            </Layout>
          } />
          
          {/* Rute til brugerens egen side med layout og valgte kategorier */}
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
