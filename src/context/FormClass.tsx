"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type FormClassContextType = {
  activeClass: string | null;
  setActiveClass: (value: string) => void;
  formClasses: string[];
};

const FormClassContext = createContext<FormClassContextType | null>(null);

export function FormClassProvider({ children }: { children: React.ReactNode }) {
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [formClasses, setFormClasses] = useState<string[]>([]);

  useEffect(() => {
    axios.get("/api/formteacher/formClass").then(({ data }) => {
      setFormClasses(data);
      if (data.length > 0) setActiveClass(data[0]);
    });
  }, []);

  return (
    <FormClassContext.Provider
      value={{
        setActiveClass,
        formClasses,
        activeClass,
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
