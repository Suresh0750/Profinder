import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-black text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span>📞 888-123-4567</span>
          <span>✉️ info@example.com</span>
        </div>
        <nav className="space-x-4">
          <a href="#about" className="hover:text-yellow-500">About Us</a>
          <a href="#services" className="hover:text-yellow-500">Services</a>
          <a href="#projects" className="hover:text-yellow-500">Projects</a>
          <a href="#contact" className="hover:text-yellow-500">Contact Us</a>
        </nav>
        <button className="bg-yellow-500 text-black px-4 py-2 rounded">Get Started</button>
      </div>
    </header>
  );
};

export default Header;
