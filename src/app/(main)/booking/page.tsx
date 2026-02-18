"use client";

import Booking from "@/components/Booking/Booking";
import { useSearchParams } from "next/navigation";

export default function BookingPage() {
  const searchParams = useSearchParams();
  console.log("search params", searchParams);
  const country = searchParams.get("country");
  const tripId = Number( searchParams.get("tripId"));
  console.log("county  ", country);
  console.log("tripid  ", tripId);

  return <Booking country={country?? ''} id={tripId} />;
}
