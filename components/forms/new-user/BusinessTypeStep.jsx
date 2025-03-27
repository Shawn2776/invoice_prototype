"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store";
import { businessTypeSchema } from "@/lib/validation";
import { FaChevronRight } from "react-icons/fa";

import {
  Briefcase,
  Users,
  Building2,
  Building,
  UsersRound,
} from "lucide-react";

const businessTypes = [
  {
    id: "sole-proprietorship",
    name: "Sole Proprietorship",
    icon: Briefcase,
  },
  {
    id: "partnership",
    name: "Partnership",
    icon: Users,
  },
  {
    id: "llc",
    name: "Limited Liability Company",
    icon: Building2,
  },
  {
    id: "corporation",
    name: "Corporation",
    icon: Building,
  },
  {
    id: "unincorporated",
    name: "Unincorporated Business Association or Organization",
    icon: UsersRound,
  },
  {
    id: "individual",
    name: "Individual / Sole Trader",
    icon: Briefcase, // or swap for a “person” icon
  },
];

export default function BusinessTypeStep() {
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { formData, updateFormData, setStep, step } = useFormStore();
  const [selected, setSelected] = useState(formData.businessType || "");

  useEffect(() => {
    // Persist selection on refresh
    if (formData.businessType) {
      setSelected(formData.businessType);
    }
  }, [formData.businessType]);

  const handleSelect = async (type) => {
    const clientResult = businessTypeSchema.safeParse({
      businessType: type.id,
    });
    if (!clientResult.success) {
      console.error("Invalid business type", clientResult.error.format());
      return;
    }

    // Server‑side validation only (no save)
    const res = await fetch(`/api/new-user/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessType: type.id }),
    });

    if (!res.ok) {
      const { error } = await res.json();

      const bizError = error?.businessType?._errors?.[0];
      const fallback =
        typeof error === "string" ? error : "Server validation failed";
      setErrorMessage(bizError || fallback);
      return;
    }

    // Both client & server validations passed
    setSelected(type.id);
    updateFormData({ businessType: type.id });

    setStep(step + 1);
    router.push(`/new-user/${step + 1}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="max-w-md bg-white rounded-md shadow-lg">
        <h2 className="text-left w-full text-2xl font-bold text-white bg-primary px-4 pt-4 rounded-t-md">
          Business Type
        </h2>
        <p className="text-gray-300 text-left w-full bg-primary px-4 border-b pb-8">
          Select the legal type of your business
        </p>
        {errorMessage && (
          <p className="text-red-600 p-4 pb-4 text-sm">{errorMessage}</p>
        )}
        <div className="grid grid-cols-1 w-full rounded-b-md">
          {businessTypes.map((type) => (
            <button
              key={type.id}
              className={`h-20 flex p-4 justify-between items-center border-b transition-all duration-200 ${
                selected === type.id
                  ? "bg-primary text-white"
                  : "bg-card text-card-foreground"
              } hover:bg-primary/50 hover:text-black hover:cursor-pointer ${
                type.id === "individual" ? "rounded-b-md" : ""
              }`}
              onClick={() => handleSelect(type)}
            >
              <div className="flex items-center gap-8">
                <type.icon className="w-6 h-6" />
                <span className="text-left">{type.name}</span>
              </div>
              <FaChevronRight />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
