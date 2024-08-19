// //Auth står for authentication og handler om at bekræfte.

// import React, { createContext, useState, useEffect } from 'react';
// import supabase from '../supabase'; // Opdater stien hvis nødvendigt

// //createContext() opretter en AuthContext, som kan bruges til at dele autentificeringsdata på tværs af komponenter.
// export const AuthContext = createContext();

// //AuthProvider: Dette minder om en højere-ordens komponent (HOC), det er en funktion, der tager en komponent som input og returnerer en ny komponent. HOC'er bruges til at tilføje ekstra funktionalitet til eksisterende komponenter uden at ændre dem direkte.
// export const AuthProvider = ({ children }) => {
//   //false angiver at brugeren som udgangspunkt IKKE er logget ind
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   //null angiver at siden brugeren som udgangspunkt ikke er logget ind, så er der som udgangspunkt heller ingen data
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Fetch session and user on component mount
//     const fetchSession = async () => {
//       const { data: sessionData, error } = await supabase.auth.getSession();
//       if (error) {
//         console.error('Error fetching session:', error);
//         return;
//       }

//       if (sessionData.session) {
//         setIsLoggedIn(true);
//         setUser(sessionData.session.user);
//       } else {
//         setIsLoggedIn(false);
//         setUser(null);
//       }
//     };

//     fetchSession();

//     // Listen for authentication state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === 'SIGNED_IN') {
//         setIsLoggedIn(true);
//         setUser(session.user);
//       } else if (event === 'SIGNED_OUT') {
//         setIsLoggedIn(false);
//         setUser(null);
//       }
//     });

//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, []);

//   const logout = async () => {
//     try {
//       await supabase.auth.signOut();
//       setIsLoggedIn(false);
//       setUser(null);
//       // Ryd sessiondata
//       localStorage.removeItem(`myProgram_${user?.id}`);
//       sessionStorage.removeItem('myProgram');
//     } catch (error) {
//       console.error('Logout error:', error.message);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
