import { create } from "zustand";

export const useFormStore = create((set) => {
  // Load from localStorage if available
  const storedData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("formData")) || {}
      : {};

  return {
    step: storedData.step || 1,
    formData: storedData.formData || {},

    setStep: (step) => {
      set({ step });
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "formData",
          JSON.stringify({ ...storedData, step })
        );
      }
    },

    updateFormData: (data) => {
      set((state) => {
        const newFormData = { ...state.formData, ...data };
        localStorage.setItem(
          "formData",
          JSON.stringify({ step: state.step, formData: newFormData })
        );
        return { formData: newFormData };
      });
    },
  };
});
