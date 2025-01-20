import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center group transition-all duration-300 hover:scale-105">
      <img 
        src="https://i.imgur.com/wqXTBSz.jpeg" 
        alt="NextWeekend Logo" 
        className="h-10 w-auto object-contain rounded-full transition-all duration-300 group-hover:shadow-lg"
      />
      <span className="ml-3 text-xl font-semibold text-primary-main transition-all duration-300 group-hover:text-primary-accent">
        NextWeekend
      </span>
    </Link>
  );
}