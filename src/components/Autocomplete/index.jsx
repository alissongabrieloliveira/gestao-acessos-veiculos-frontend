import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

export default function Autocomplete({
  label,
  items = [],
  selectedItem,
  onChange,
  displayKey = "nome", // Qual campo do objeto mostrar (ex: 'nome', 'placa')
  placeholder = "Digite para buscar...",
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Sincroniza o input com o item selecionado externamente (ex: ao limpar o form)
  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem[displayKey]);
    } else {
      setQuery("");
    }
  }, [selectedItem, displayKey]);

  // Filtra os itens baseado no que foi digitado
  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          const itemValue = String(item[displayKey]).toLowerCase();
          return itemValue.includes(query.toLowerCase());
        });

  function handleSelect(item) {
    onChange(item); // Avisa o pai quem foi selecionado
    setQuery(item[displayKey]);
    setIsOpen(false);
  }

  function handleClear() {
    onChange(null);
    setQuery("");
    setIsOpen(false);
  }

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Se o usuário digitou algo mas não selecionou nada, reseta para o item anterior ou vazio
        if (!selectedItem) setQuery("");
        else setQuery(selectedItem[displayKey]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedItem, displayKey]);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (selectedItem) onChange(null); // Limpa seleção se começar a digitar de novo
          }}
          onFocus={() => setIsOpen(true)}
        />

        {/* Botão de Limpar ou Seta */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400">
          {selectedItem || query ? (
            <FaTimes onClick={handleClear} className="hover:text-red-500" />
          ) : (
            <FaChevronDown onClick={() => setIsOpen(!isOpen)} />
          )}
        </div>
      </div>

      {/* Lista Suspensa (Dropdown) */}
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm mt-1">
          {filteredItems.length === 0 ? (
            <li className="text-gray-500 cursor-default select-none relative py-2 pl-3 pr-9">
              Nenhum resultado encontrado.
            </li>
          ) : (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 transition-colors"
                onClick={() => handleSelect(item)}
              >
                <span className="block truncate font-medium">
                  {item[displayKey]}
                </span>
                {/* Mostra um detalhe extra se existir (ex: CPF ou Placa) */}
                {item.documento && (
                  <span className="block truncate text-xs text-gray-500">
                    CPF: {item.documento}
                  </span>
                )}
                {item.modelo && displayKey === "placa" && (
                  <span className="block truncate text-xs text-gray-500">
                    {item.modelo}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
