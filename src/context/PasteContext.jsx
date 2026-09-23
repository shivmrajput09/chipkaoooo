import React, { createContext, useState } from "react";

export const PasteContext = createContext();

export const PasteProvider = ({ children }) => {
  const [pastes, setPastes] = useState([]);

  // Naya paste add karne ka function
  const addPaste = (newPaste) => {
    setPastes([...pastes, newPaste]);
  };

  // Existing paste ko update karne ka function (Ye missing tha!)
  const updatePastes = (updatedPaste) => {
    setPastes(
      pastes.map((paste) =>
        (paste._id || paste.id) === (updatedPaste._id || updatedPaste.id)
          ? updatedPaste
          : paste
      )
    );
  };

  // Paste remove karne ka function
  const removepaste = (id) => {
    setPastes(pastes.filter((paste) => (paste._id || paste.id) !== id));
  };

  return (
    <PasteContext.Provider value={{ pastes, addPaste, updatePastes, removepaste }}>
      {children}
    </PasteContext.Provider>
  );
};