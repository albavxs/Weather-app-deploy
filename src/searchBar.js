import React, { useState } from "react";
import "./App.css"; // Se houver estilos específicos para o SearchBar

const SearchBar = ({ className, onChange, onSearch }) => {
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch(location); // Chama a função onSearch com o valor atual de location
    setLocation(""); // Limpa o campo de entrada
  };

  return (
    <div className={`search-bar ${className}`}>
      {/* Use className corretamente */}
      <input
        type="text"
        placeholder="Enter city"
        onChange={(e) => {
          setLocation(e.target.value); // Atualiza o estado local de location
          onChange(e); // Chama a função onChange recebida como prop
        }}
        value={location} // O valor do input é o estado local de location
      />
      <button onClick={handleSearch}>Search</button>
      {/* Chama handleSearch ao clicar */}
    </div>
  );
};

export default SearchBar;
