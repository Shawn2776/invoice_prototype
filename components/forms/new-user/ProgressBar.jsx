"use client";

import { useState, useEffect } from "react";
import { useFormStore } from "@/lib/store";

export default function ProgressBar() {
  const { step } = useFormStore();
  const totalSteps = 5; // Adjust based on total steps
  const [progress, setProgress] = useState(0); // Default to 0 to prevent mismatch

  useEffect(() => {
    setProgress((step / totalSteps) * 100); // Set progress after mounting
  }, [step]);

  return (
    <div className="w-full bg-gray-200 h-2 rounded-md overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
