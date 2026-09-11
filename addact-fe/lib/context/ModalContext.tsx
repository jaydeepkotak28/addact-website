"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ModalType = "contact" | "video" | "quote" | string;

export interface ModalContextValue {
  activeModal: ModalType | null;
  payload: Record<string, unknown> | null;
  isOpen: boolean;
  openModal: (type: ModalType, payload?: Record<string, unknown>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);

  const openModal = useCallback((type: ModalType, modalPayload?: Record<string, unknown>) => {
    setActiveModal(type);
    setPayload(modalPayload || null);
    if (typeof document !== "undefined") {
      document.body.classList.add("modal-open");
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setPayload(null);
    if (typeof document !== "undefined") {
      document.body.classList.remove("modal-open");
    }
  }, []);

  // Listen for legacy "openContactDrawer" custom events
  useEffect(() => {
    const handleContactDrawer = () => openModal("contact");
    window.addEventListener("openContactDrawer", handleContactDrawer);
    return () => {
      window.removeEventListener("openContactDrawer", handleContactDrawer);
    };
  }, [openModal]);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        payload,
        isOpen: activeModal !== null,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    return {
      activeModal: null,
      payload: null,
      isOpen: false,
      openModal: () => {},
      closeModal: () => {},
    };
  }
  return context;
}

export default ModalProvider;
