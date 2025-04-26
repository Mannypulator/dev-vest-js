// 1. Create our "Magic Cookie Jar" (Modal Context)
// components/modal-context.jsx
"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext({
  activeModal: null,
  modalData: null,
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalData,
        openModal: (type, data) => {
          setActiveModal(type);
          setModalData(data);
        },
        closeModal: () => {
          setActiveModal(null);
          setModalData(null);
        },
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
