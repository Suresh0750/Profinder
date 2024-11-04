import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-8 md:mb-0">
          <h3 className="text-2xl font-bold mb-2">ProFinder</h3>
          <p className="text-gray-400">Empowering your business with innovative solutions.</p>
        </div>
        <div className="mb-8 md:mb-0">
          <h3 className="text-xl font-bold mb-4">Useful Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-400 transition duration-300">About</a></li>
            <li><a href="#" className="hover:text-blue-400 transition duration-300">Services</a></li>
            <li><a href="#" className="hover:text-blue-400 transition duration-300">Projects</a></li>
            <li><a href="#" className="hover:text-blue-400 transition duration-300">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-400">Phone: <span className="text-white">(888) 123-4567</span></p>
          <p className="text-gray-400">Email: <span className="text-white">info@example.com</span></p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} ProFinder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;