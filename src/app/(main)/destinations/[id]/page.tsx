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

  return (
    <div>
      <PackageDetails
        id={id}
        
      
      />
    </div>
  );
}
