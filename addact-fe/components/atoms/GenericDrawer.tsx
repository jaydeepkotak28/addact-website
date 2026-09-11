"use client";

import React, { useEffect, useCallback } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export interface GenericDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "right" | "left" | "bottom";
  title?: string;
  children: React.ReactNode;
  width?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

/**
 * GenericDrawer - Universal Slide-in Drawer Atom
 */
export const GenericDrawer: React.FC<GenericDrawerProps> = ({
  isOpen,
  onClose,
  position = "right",
  title,
  children,
  width = "max-w-md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className = "",
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const positionClasses = {
    right: "inset-y-0 right-0",
    left: "inset-y-0 left-0",
    bottom: "inset-x-0 bottom-0 max-h-[85vh]",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Drawer Panel */}
      <div
        className={clsx(
          "fixed z-10 w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out border-slate-200 dark:border-slate-800",
          positionClasses[position],
          position !== "bottom" && width,
          position === "right" && "border-l",
          position === "left" && "border-r",
          position === "bottom" && "border-t rounded-t-2xl",
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            {title ? (
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
            ) : <div />}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default GenericDrawer;
