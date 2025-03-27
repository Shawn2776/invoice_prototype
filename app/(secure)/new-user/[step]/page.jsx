"use client";

import BusinessCategoryStep from "@/components/forms/new-user/BusinessCategoryStep";
import BusinessDetailsStep from "@/components/forms/new-user/BusinessDetailsStep";
import BusinessSubcategoryStep from "@/components/forms/new-user/BusinessSubcategoryStep";
import BusinessTypeStep from "@/components/forms/new-user/BusinessTypeStep";
import { useFormStore } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewUserStep() {
  const { step } = useParams();
  const router = useRouter();
  const { setStep } = useFormStore();

  useEffect(() => {
    // Redirect to the first step if the URL is invalid
    if (!["1", "2", "3", "4", "5", "6"].includes(step)) {
      setStep(1);
      router.push("/new-user/1");
    }
  }, [step, router]);

  return (
    <div>
      {step === "1" && <BusinessTypeStep />}
      {step === "2" && <BusinessCategoryStep />}
      {step === "3" && <BusinessSubcategoryStep />}
      {step === "4" && <BusinessDetailsStep />}
      {/* Future steps will be added here */}
    </div>
  );
}
