import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================================================
// AuthContext: Authentication State Management
// ============================================================================
// Ye context pore app me user ki login/signup state ko manage karega.
// Jab aap apna backend ya Firebase/Supabase connect karenge, tab bas login,
// signup, aur logout functions ke andar apna API call lagana hoga.
// ============================================================================

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Local storage se logged in user ka data fetch kar rahe hain taaki page refresh par logout na ho
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('chipkaoooo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // Jab bhi user state change ho, localStorage me update kar do
  useEffect(() => {
    if (user) {
      localStorage.setItem('chipkaoooo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chipkaoooo_user');
    }
  }, [user]);

  // --------------------------------------------------------------------------
  // 1. LOGIN FUNCTION
  // --------------------------------------------------------------------------
  // 👉 YAHAN APNA BACKEND / FIREBASE LOGIN API CALL ADD KAREIN:
  // Example:
  // const res = await axios.post('/api/auth/login', { email, password });
  // setUser(res.data.user);
  // --------------------------------------------------------------------------
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Temporary Mock / Demo User Setup:
      // (Jab backend banayein, toh is mock object ko API response se replace kar lein)
      const mockUser = {
        id: email.replace(/[^a-zA-Z0-9]/g, '_'), // Unique user ID
        name: email.split('@')[0],               // Display name from email
        email: email,
      };

      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // 2. SIGNUP FUNCTION
  // --------------------------------------------------------------------------
  // 👉 YAHAN APNA BACKEND / FIREBASE SIGNUP API CALL ADD KAREIN:
  // Example:
  // const res = await axios.post('/api/auth/signup', { name, email, password });
  // setUser(res.data.user);
  // --------------------------------------------------------------------------
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const newUser = {
        id: 'usr_' + Date.now().toString(36),
        name: name || email.split('@')[0],
        email: email,
      };

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup Error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // 3. LOGOUT FUNCTION
  // --------------------------------------------------------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem('chipkaoooo_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook taaki kisi bhi component me easily use kar sakein:
// const { user, isAuthenticated, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
