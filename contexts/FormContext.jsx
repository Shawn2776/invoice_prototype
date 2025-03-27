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
    if (!formSteps[currentStep]) return; // Prevent errors on invalid steps
    router.push(formSteps[currentStep]);
  };

  const prevStep = (currentStep) => {
    const steps = Object.keys(formSteps);
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      const prevStepKey = steps[currentIndex - 1];
      router.push(formSteps[prevStepKey]); // Ensure it uses the defined route
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
