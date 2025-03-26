"use client";

import { useEffect } from "react";
import {
  Briefcase,
  Users,
  Building2,
  Building,
  UsersRound,
} from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFormContext } from "@/contexts/FormContext";

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
];

const PageOne = () => {
  const { formData, updateFormData, nextStep } = useFormContext();

  // When a business type is selected, update form data and advance to next step
  const handleSelection = (value) => {
    updateFormData({ businessType: value });
    // Use a small timeout to allow the UI to update before navigating
    setTimeout(() => {
      nextStep("business-type");
    }, 300);
  };

  // If returning to this page with a previously selected value, restore it
  useEffect(() => {
    // If we already have a business type and are returning to this page,
    // we don't want to auto-advance again
  }, []);

  return (
    <RadioGroup
      value={formData.businessType}
      onValueChange={handleSelection}
      className="space-y-4"
    >
      {businessTypes.map((type) => {
        const Icon = type.icon;
        return (
          <div
            key={type.id}
            className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${
              formData.businessType === type.id
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleSelection(type.id)}
          >
            <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
            <Label
              htmlFor={type.id}
              className="flex flex-1 cursor-pointer items-center gap-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div className="font-medium">{type.name}</div>
            </Label>
            {formData.businessType === type.id && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default PageOne;
