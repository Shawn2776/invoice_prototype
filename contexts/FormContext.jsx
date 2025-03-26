"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const FormContext = createContext();

// Define the form steps and their order
const formSteps = {
  "business-type": "/form/business-details",
  "business-details": "/form/contact-info",
  "contact-info": "/form/review",
  review: "/form/submit",
};

export function FormProvider({ children }) {
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = (currentStep) => {
    const nextPath = formSteps[currentStep];
    if (nextPath) {
      router.push(nextPath);
    }
  };

  const prevStep = (currentStep) => {
    const steps = Object.entries(formSteps);
    const currentIndex = steps.findIndex(([step]) => step === currentStep);

    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1][0];
      router.push(`/form/${prevStep}`);
    }
  };

  return (
    <FormContext.Provider
      value={{ formData, updateFormData, nextStep, prevStep }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
