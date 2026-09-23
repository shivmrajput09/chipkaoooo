import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#4f46e5', color: 'white' }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
        PasteApp
      </div>
      
      <div style={{ display: 'flex', gap: '30px', fontSize: '18px' }}>
        <NavLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </NavLink>

        <NavLink to="/pastes" style={{ color: 'white', textDecoration: 'none' }}>
          Pastes
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;