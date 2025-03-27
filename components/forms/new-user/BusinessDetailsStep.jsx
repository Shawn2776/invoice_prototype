"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store";
import { MdOutlineKeyboardReturn } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { verifyBusinessAction } from "@/actions/verifyBusinessAction";

// Normalization helper: converts to NFC, lowercases, trims, and removes spaces, hyphens, periods, commas (but keeps ampersands)
const normalizeName = (name) =>
  name
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[\s\u00A0\-.,]+/g, "");

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export default function BusinessDetailsStep() {
  const router = useRouter();
  const { formData, updateFormData, setStep, step } = useFormStore();

  // Form state fields
  const [legalBusinessName, setLegalBusinessName] = useState(
    formData.legalBusinessName || ""
  );
  const [doingBusinessAs, setDoingBusinessAs] = useState(
    formData.doingBusinessAs || ""
  );
  const [ein, setEin] = useState(formData.ein || "");
  const [selectedState, setSelectedState] = useState(
    formData.businessState || ""
  );
  const [onlineStatus, setOnlineStatus] = useState(
    formData.onlineStatus || "notOnline"
  );
  const [onlineLink, setOnlineLink] = useState(formData.onlineLink || "");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");

  // Updated verifyBusiness returns a boolean indicating success.
  const verifyBusiness = async () => {
    if (!legalBusinessName.trim() || !selectedState) {
      setMessage("Please enter a business name and select a state.");
      return false;
    }
    setIsVerifying(true);
    setMessage("");
    console.log(`Verifying "${legalBusinessName}" in ${selectedState}`);

    let verified = false;
    try {
      if (selectedState === "Alabama") {
        // Note: We now pass place as "ALL" to match the manual form.
        const results = await verifyBusinessAction({
          search: legalBusinessName,
          type: "ALL",
          place: "ALL",
          city: "",
          stat: "ALL",
        });
        console.log("Parsed Results:", results);

        // Normalize input
        const normalizedInput = normalizeName(legalBusinessName);
        console.log("Normalized input:", normalizedInput);

        // Check for an exact match
        const exactMatch = results.find(
          (result) => normalizeName(result.entityName) === normalizedInput
        );

        if (exactMatch) {
          verified = true;
          setMessage("Results verified");
        } else {
          verified = false;
          setMessage("No exact match found.");
        }
      } else {
        // For non-Alabama states, bypass verification (or add additional logic)
        verified = true;
        setMessage("Verified (no check for non-Alabama).");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      verified = false;
      setMessage("An error occurred during verification. Please try again.");
    }
    setIsVerifying(false);
    setIsVerified(verified);
    return verified;
  };

  const handleNext = async () => {
    if (onlineStatus === "online" && !onlineLink.trim()) {
      return;
    }
    let verified = isVerified;
    if (!verified) {
      verified = await verifyBusiness();
    }
    if (verified) {
      updateFormData({
        legalBusinessName,
        doingBusinessAs,
        ein,
        businessState: selectedState,
        onlineStatus,
        onlineLink,
      });
      const newStep = step + 1;
      setStep(newStep);
      // Delay 500ms to flash the "Results verified" message
      setTimeout(() => {
        router.push(`/new-user/${newStep}`);
      }, 500);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    router.push(`/new-user/${step - 1}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">
      <div className="max-w-md bg-white rounded-md shadow-lg mt-4 w-full">
        {/* Title and Description */}
        <h2 className="text-left w-full text-2xl font-bold text-white bg-primary px-4 pt-4 rounded-t-md">
          Business Details
        </h2>
        <p className="text-gray-300 text-left w-full bg-primary px-4 border-b pb-8">
          We need this info to verify your business
        </p>

        <div className="p-6">
          {/* Legal Business Name */}
          <label className="block text-sm font-medium text-gray-700">
            Legal Business Name
          </label>
          <input
            type="text"
            placeholder="Registered name of company"
            value={legalBusinessName}
            onChange={(e) => setLegalBusinessName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          <p className="text-xs text-gray-400">Registered name of company</p>
          {message && (
            <p
              className={`text-xs mt-1 ${
                message === "Results verified" || message.includes("verified")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Doing Business As */}
          <label className="block mt-4 text-sm font-medium text-gray-700">
            Doing business as (optional)
          </label>
          <input
            type="text"
            placeholder="Name to appear on receipts"
            value={doingBusinessAs}
            onChange={(e) => setDoingBusinessAs(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          <p className="text-xs text-gray-400">Name to appear on receipts</p>

          {/* Employer Identification Number */}
          <label className="block mt-4 text-sm font-medium text-gray-700">
            Employer Identification Number
          </label>
          <input
            type="text"
            placeholder="Use format 123456789 or 12-3456789"
            value={ein}
            onChange={(e) => setEin(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          <p className="text-xs text-gray-400">
            Use format 123456789 or 12-3456789
          </p>

          {/* Business State */}
          <label className="block mt-4 text-sm font-medium text-gray-700">
            Business State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400">
            Select the state your company is licensed in
          </p>

          {/* Online Presence Section */}
          <h3 className="mt-6 text-lg font-medium text-gray-700">
            Where to find your business online
          </h3>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="online"
                checked={onlineStatus === "online"}
                onChange={() => setOnlineStatus("online")}
                className="form-radio"
              />
              <span className="ml-2">Social Media or website link</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                value="notOnline"
                checked={onlineStatus === "notOnline"}
                onChange={() => setOnlineStatus("notOnline")}
                className="form-radio"
              />
              <span className="ml-2">Not online</span>
            </label>
          </div>
          {onlineStatus === "online" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Online Link
              </label>
              <input
                type="text"
                placeholder="Enter your business link"
                value={onlineLink}
                onChange={(e) => setOnlineLink(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex w-full">
          <Button
            onClick={handleBack}
            className="p-4 w-1/2 flex items-center gap-2 hover:cursor-pointer rounded-none"
          >
            <MdOutlineKeyboardReturn /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="p-4 w-1/2 bg-primary text-white rounded-none"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
