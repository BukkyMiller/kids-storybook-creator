import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          📚 Story Creator
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create Story</Link></li>
            <li><Link to="/stories">My Stories</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 