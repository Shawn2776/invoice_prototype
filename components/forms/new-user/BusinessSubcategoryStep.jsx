"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store";
import { FaChevronRight } from "react-icons/fa";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { Button } from "@/components/ui/button";

const subcategories = {
  "retail-misc": ["Electronics", "Books", "Toys", "Home Decor"],
  "food-hospitality": ["Restaurant", "Cafe", "Catering", "Bar"],
  professional: ["Consulting", "Legal Services", "Finance", "Education"],
  "health-beauty": ["Salon", "Spa", "Gym", "Medical Clinic"],
  services: ["Automotive", "Cleaning", "Repair", "IT Support"],
  clothing: ["Boutique", "Sportswear", "Formal Wear", "Casual"],
  leisure: ["Music Studio", "Cinema", "Gaming Lounge", "Theater"],
  retail: ["Supermarket", "Department Store", "Pet Store", "Furniture"],
  other: ["Freelance", "Handmade Goods", "Custom Services", "Miscellaneous"],
};

export default function BusinessSubcategoryStep() {
  const router = useRouter();
  const { formData, updateFormData, setStep, step } = useFormStore();
  const [selected, setSelected] = useState(formData.businessSubcategory || "");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const category = formData.businessType;

  useEffect(() => {
    if (formData.businessSubcategory) {
      setSelected(formData.businessSubcategory);
    }
  }, [formData.businessSubcategory]);

  const handleSelect = (subcategory) => {
    setSelected(subcategory);
    updateFormData({ businessSubcategory: subcategory });
    setTimeout(() => {
      setStep(step + 1);
      router.push(`/new-user/${step + 1}`);
    }, 300);
  };

  const handleCustomInput = (event) => {
    setCustomSubcategory(event.target.value);
    updateFormData({ businessSubcategory: event.target.value });
  };

  const handleNext = () => {
    if (selected || customSubcategory.trim()) {
      setStep(step + 1);
      router.push(`/new-user/${step + 1}`);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    router.push(`/new-user/${step - 1}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      <div className="max-w-md bg-white rounded-md shadow-lg mt-4 w-full">
        <h2 className="text-left w-full text-2xl font-bold text-white bg-primary px-4 pt-4 rounded-t-md">
          Business Subcategory
        </h2>
        <p className="text-gray-300 text-left w-full bg-primary px-4 border-b pb-8">
          Choose the subcategory that best fits your business
        </p>
        <div className="grid grid-cols-1 w-full rounded-b-md">
          {subcategories[category]?.map((sub) => (
            <button
              key={sub}
              className={`p-6 flex justify-between items-center border-b transition-all duration-200 ${
                selected === sub
                  ? "bg-primary text-white"
                  : "bg-card text-card-foreground"
              } hover:bg-primary/50 hover:text-black hover:cursor-pointer`}
              onClick={() => handleSelect(sub)}
            >
              <span className="text-left">{sub}</span>
              <FaChevronRight />
            </button>
          ))}
          <div className="p-6 flex flex-col border-t">
            <input
              type="text"
              placeholder="Other (please specify)"
              value={customSubcategory}
              onChange={handleCustomInput}
              className="p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <div className="flex w-full">
          <Button
            variant=""
            onClick={handleBack}
            className="p-4 w-1/2 flex items-center gap-2 hover:cursor-pointer rounded-none"
          >
            <MdOutlineKeyboardReturn /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="p-4 w-1/2 bg-primary text-white rounded-none"
            disabled={!selected && !customSubcategory.trim()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
