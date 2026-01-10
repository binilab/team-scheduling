import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold">Time Scheduling App</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:underline">Home</a>
          </li>
          <li>
            <a href="/poll/create" className="hover:underline">Create Poll</a>
          </li>
          <li>
            <a href="/poll" className="hover:underline">View Polls</a>
          </li>
          <li>
            <a href="/result" className="hover:underline">Results</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;