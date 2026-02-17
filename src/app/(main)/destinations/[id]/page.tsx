"use client";
import PackageDetails from "@/components/Destinations/PackageDetails";
import { useRouter } from "next/navigation";
import React, { use } from "react";

export default function TripSinglePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  console.log("trip id ", id);

  const router = useRouter();

  const handleNavigateBack = () => {
    router.push("/destinations");
  };

  const handleNavigateBooking = () => {
    router.push("/booking");
  };
  return (
    <div>
      <PackageDetails
        id={id}
        onNavigateBack={handleNavigateBack}
        onNavigateBooking={handleNavigateBooking}
      />
    </div>
  );
}
