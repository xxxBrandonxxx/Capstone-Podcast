import React, { useState } from 'react';

const Header = ({ handleFilterChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleDropdownChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
    handleFilterChange(option);
  };

  return (
    <header className='custom-header'>
      <h1>filtering</h1>
      <label htmlFor="filter">Filter:</label>
      <select id="filter" value={selectedOption} onChange={handleDropdownChange}>
        <option value="">Select an option</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
        <option value="recent">Most Recent</option>
      </select>
    </header>
  );
};

export default Header;
