"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store";
import { FaChevronRight } from "react-icons/fa";
import { MdOutlineKeyboardReturn } from "react-icons/md";

import {
  ShoppingBag,
  Utensils,
  Briefcase,
  HeartPulse,
  Wrench,
  Shirt,
  Music,
  Store,
  Ellipsis,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessCategorySchema } from "@/lib/validation";

const businessCategories = [
  { id: "retail-misc", name: "Retail - Miscellaneous", icon: ShoppingBag },
  {
    id: "food-hospitality",
    name: "Food, Drinks and Hospitality",
    icon: Utensils,
  },
  {
    id: "professional",
    name: "Professional Services and Organizations",
    icon: Briefcase,
  },
  {
    id: "health-beauty",
    name: "Health, Beauty and Wellness",
    icon: HeartPulse,
  },
  { id: "services", name: "Services", icon: Wrench },
  { id: "clothing", name: "Clothing and Apparel", icon: Shirt },
  { id: "leisure", name: "Leisure and Entertainment", icon: Music },
  { id: "retail", name: "Retail", icon: Store },
  { id: "other", name: "Other", icon: Ellipsis },
];

export default function BusinessCategoryStep() {
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { formData, updateFormData, setStep, step } = useFormStore();
  const [selected, setSelected] = useState(formData.businessCategory || "");

  useEffect(() => {
    if (formData.businessCategory) {
      setSelected(formData.businessCategory);
    }
  }, [formData.businessCategory]);

  const handleSelect = async (category) => {
    setErrorMessage("");
    const client = businessCategorySchema.safeParse({
      businessCategory: category.id,
    });
    if (!client.success) {
      setErrorMessage(client.error.format().businessCategory?._errors?.[0]);
      return;
    }

    const res = await fetch("/api/new-user/validate/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessCategory: category.id }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      const bizErr = error?.businessCategory?._errors?.[0];
      setErrorMessage(bizErr || "Server validation failed");
      return;
    }

    setSelected(category.id);
    updateFormData({ businessCategory: category.id });
    setStep(step + 1);
    router.push(`/new-user/${step + 1}`);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1); // Correctly decrements
      router.push(`/new-user/${step - 1}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      <div className="max-w-md bg-white rounded-md shadow-lg mt-4 w-full">
        <h2 className="text-left w-full text-2xl font-bold text-white bg-primary px-4 pt-4 rounded-t-md">
          Business Category
        </h2>
        <p className="text-gray-300 text-left w-full bg-primary px-4 border-b pb-8">
          Choose what best describes your business
        </p>
        {errorMessage && (
          <p className="text-red-600 p-4 pb-4 text-sm">{errorMessage}</p>
        )}
        <div className="grid grid-cols-1 w-full rounded-b-md">
          {businessCategories.map((category) => (
            <button
              key={category.id}
              className={`p-6 flex justify-between items-center border-b transition-all duration-200 ${
                selected === category.id
                  ? "bg-primary text-white"
                  : "bg-card text-card-foreground"
              } hover:bg-primary/50 hover:text-black hover:cursor-pointer ${
                category.id === "other" ? "rounded-b-md" : ""
              }`}
              onClick={() => handleSelect(category)}
            >
              <div className="flex items-center gap-4">
                <category.icon className="w-6 h-6" />
                <span className="text-left">{category.name}</span>
              </div>
              <span>
                <FaChevronRight />
              </span>
            </button>
          ))}
        </div>
        <Button
          variant=""
          onClick={handleBack}
          className="p-4 w-1/2 flex items-center gap-2 hover:cursor-pointer rounded-none"
        >
          <MdOutlineKeyboardReturn /> Back
        </Button>
      </div>
    </div>
  );
}
