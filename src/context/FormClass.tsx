"use client";

import React, { createContext, useContext, useState } from "react";

type FormClassContextType = {
  activeClass: string | null;
  setActiveClass: (value: string) => void;
};

const FormClassContext = createContext<FormClassContextType | null>(null);

export function FormClassProvider({
  children,
  init,
}: {
  children: React.ReactNode;
  init: string | null;
}) {
  const [activeClass, setActiveClass] = useState<string | null>(init);

  return (
    <FormClassContext.Provider
      value={{
        activeClass,
        setActiveClass,
      }}
    >
      {children}
    </FormClassContext.Provider>
  );
}

export function useFormClass() {
  const context = useContext(FormClassContext);
  if (!context) {
    throw new Error("useFormClass must be used within FormClassProvider");
  }
  return context;
}
