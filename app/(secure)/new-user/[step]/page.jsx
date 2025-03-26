"use client";

import BusinessCategoryStep from "@/components/forms/new-user/BusinessCategoryStep";
import BusinessTypeStep from "@/components/forms/new-user/BusinessTypeStep";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewUserStep() {
  const { step } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step if the URL is invalid
    if (!["1", "2", "3"].includes(step)) {
      router.push("/new-user/1");
    }
  }, [step, router]);

  return (
    <div>
      {step === "1" && <BusinessTypeStep />}
      {step === "2" && <BusinessCategoryStep />}
      {/* Future steps will be added here */}
    </div>
  );
}
