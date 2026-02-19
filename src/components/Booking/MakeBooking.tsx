"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReviewBookingStep from "./ReviewBookingStep";
import { CheckoutCountdown } from "./CheckoutCountdown";
import { useGetTourBookingFirstStepMutation } from "@/redux/api/destinationApi";

type SummaryRowProps = {
  label: string;
  price: string;
  qty?: number;
  total?: string;
  negative?: boolean;
};

const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  price,
  qty,
  total,
  negative,
}) => {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-gray-600">{label}</span>
      <span className={negative ? "text-red-500" : "text-gray-800"}>
        {price}
        {qty && ` × ${qty}`} {total && ` ${total}`}
      </span>
    </div>
  );
};

type StepKey = 0 | 1 | 2;

const steps = [
  { key: 0 as StepKey, label: "TOUR OVERVIEW" },
  { key: 1 as StepKey, label: "PASSENGER DETAILS" },
  { key: 2 as StepKey, label: "REVIEW & PAYMENT" },
];

//passenger details

const StepHeader = ({ currentStep }: { currentStep: StepKey }) => {
  return (
    <div className="max-w-3xl mx-auto mb-8 rounded-xl bg-gray-200 px-18 pt-3 pb-8">
      <div className="flex items-center">
        {steps.map((s, idx) => {
          const isDone = s.key <= currentStep;
          const isActive = s.key === currentStep;

          const circleClass =
            isDone || isActive ? "bg-orange-500" : "bg-gray-400";
          const labelClass = isActive ? "text-orange-500" : "text-gray-500";

          const connectorClass =
            s.key <= currentStep ? "bg-[#0D8B9E]" : "bg-gray-400";

          return (
            <React.Fragment key={s.key}>
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center gap-2 relative">
                <span
                  className={`w-8 h-8 rounded-full  ${circleClass} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                >
                  {isDone ? "✓" : idx + 1}
                </span>
                <span
                  className={`text-xs font-medium absolute top-9 w-40 flex items-center justify-center ${labelClass}`}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector should touch circles (no padding, flex-1 fills space) */}
              {idx !== steps.length - 1 && (
                <div className="flex-1">
                  <div className={`h-0.75 w-full ${connectorClass}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

const travellerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    mobile: z.string().regex(phoneRegex, "Invalid mobile number"),
    nationality: z.string().min(2, "Nationality is required"),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    passportNo: z
      .string()
      .min(6, "Passport No. must be at least 6 characters")
      .max(20, "Passport No. too long"),
    expiryDate: z.string().min(1, "Expiry Date is required"),
  })
  .superRefine((data, ctx) => {
    const dob = new Date(data.dateOfBirth);
    const exp = new Date(data.expiryDate);
    if (Number.isNaN(dob.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["dateOfBirth"],
        message: "Invalid date",
      });
    }
    if (Number.isNaN(exp.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Invalid date",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    exp.setHours(0, 0, 0, 0);
    if (!Number.isNaN(exp.getTime()) && exp <= today) {
      ctx.addIssue({
        code: "custom",
        path: ["expiryDate"],
        message: "Expiry date must be in the future",
      });
    }
  });

const formSchema = z.object({
  primaryContact: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    mobile: z.string().regex(phoneRegex, "Invalid mobile number"),
    address: z.string().min(5, "Address is required"),
  }),

  travellers: z
    .array(travellerSchema)
    .min(1, "At least one traveller is required"),

  // Optional fields
  discountCode: z.string().optional(),
  referredSalesStaffName: z.string().optional(),

  // ✅ Checkbox validation (fixed)
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),

  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function SectionTitle({ title, color }: { title: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h3
        className={`text-xs font-semibold tracking-wide ${color ?? "text-slate-700"}`}
      >
        {title}
      </h3>
    </div>
  );
}

export default function MakeBooking() {
  const router = useRouter();
  const [step, setStep] = useState<StepKey>(0);
  const [dropdowns, setDropdowns] = useState([{ value: "", label: "" }]); // Start with one dropdown
  const [dropdownData, setDropdownData] = useState([]); // Store the data from the API

  const searchParams = useSearchParams();
  const adultFare = Number(searchParams.get("adult_fare")) || 0;
  const childFare = Number(searchParams.get("child_fare")) || 0;
  const singleBedFare = Number(searchParams.get("single_bed_price")) || 0;
  const twinBedFare = Number(searchParams.get("twin_bed_price")) || 0;
  const tripleBedFare = Number(searchParams.get("triple_bed_price")) || 0;
  const taxFare = Number(searchParams.get("tax_fare")) || 0;
  const booking = searchParams.get("booking");
  console.log("booking id sdfsaidfhsdf", booking);

  // Flight Details
  const departureDate = searchParams.get("going_date") || "N/A";
  const returnDate = searchParams.get("coming_date") || "N/A";

  const tourDetails = {
    destination_id: searchParams.get("destination_id"),
    tour_id: searchParams.get("tour_id"),
    going_flight: searchParams.get("going_flight"),
    coming_flight: searchParams.get("coming_flight"),
    going_date: searchParams.get("going_date"),
    going_start_schedule: searchParams.get("going_start_schedule"),
    going_end_schedule: searchParams.get("going_end_schedule"),
    coming_start_schedule: searchParams.get("coming_start_schedule"),
    coming_end_schedule: searchParams.get("coming_end_schedule"),
    // booking: searchParams.get(booking),
  };
  console.log(tourDetails, "tour details");

  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [singleBedCount, setSingleBedCount] = useState(0);
  const [twinBedCount, setTwinBedCount] = useState(0);
  const [tripleBedCount, setTripleBedCount] = useState(0);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [step0Error, setStep0Error] = useState<string>("");

  const totalPax = adultCount + childCount;
  const subTotal =
    adultCount * adultFare +
    childCount * childFare +
    singleBedCount * singleBedFare +
    twinBedCount * twinBedFare +
    tripleBedCount * tripleBedFare;

  const totalTax = totalPax * taxFare;
  const totalPrice = subTotal + totalTax;

  const [
    getTourBookingFirstStep,
    { data: tourBookingFirstStepData, isLoading },
  ] = useGetTourBookingFirstStepMutation();

  const handleNext = async () => {
    if (step === 0) {
      // ✅ Step 0 Validation: adultCount must be at least 1
      if (adultCount < 1) {
        setStep0Error("You must select at least one adult.");
        return;
      }
      setStep0Error("");

      // Sync travellers array size with totalPax
      const currentTravellers = form.getValues("travellers");
      if (currentTravellers.length !== totalPax) {
        const newTravellers = [...currentTravellers];

        if (newTravellers.length < totalPax) {
          for (let i = newTravellers.length; i < totalPax; i++) {
            newTravellers.push({
              name: "",
              email: "",
              mobile: "",
              nationality: "",
              dateOfBirth: "",
              passportNo: "",
              expiryDate: "",
            });
          }
        } else if (newTravellers.length > totalPax) {
          newTravellers.length = totalPax;
        }

        form.setValue("travellers", newTravellers);
      }
      return setStep(1);
    }

    if (step === 1) {
      // ✅ Step 1 Validation: validate primaryContact + all travellers fields
      const travellerFields = fields.flatMap((_, idx) => [
        `travellers.${idx}.name` as const,
        `travellers.${idx}.email` as const,
        `travellers.${idx}.mobile` as const,
        `travellers.${idx}.nationality` as const,
        `travellers.${idx}.dateOfBirth` as const,
        `travellers.${idx}.passportNo` as const,
        `travellers.${idx}.expiryDate` as const,
      ]);

      const isValid = await form.trigger([
        "primaryContact.name",
        "primaryContact.email",
        "primaryContact.mobile",
        "primaryContact.address",
        ...travellerFields,
      ]);

      if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector(".text-red-600");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return; // Stay on Step 1, errors will be shown inline
      }

      return setStep(2);
    }

    if (step === 2) {
      // On the review step, submit the form
      const formValues = form.getValues();
      await onSubmit(formValues);
    }
  };

  const nextLabel = useMemo(() => {
    if (step < 2) return "NEXT";
    return "CHECKOUT";
  }, [step]);

  // passenger details start===========
  // ==================================
  const [expiresAt, setExpiresAt] = React.useState<string>("");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      primaryContact: { name: "", email: "", mobile: "", address: "" },
      travellers: [
        {
          name: "",
          email: "",
          mobile: "",
          nationality: "",
          dateOfBirth: "",
          passportNo: "",
          expiryDate: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "travellers",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = async (values: FormValues) => {
    console.log("submited");
    const bookingData = {
      destination_id: tourDetails.destination_id,
      booking: booking,
      single_bed_price: singleBedFare,
      twin_bed_price: twinBedFare,
      triple_bed_price: tripleBedFare,
      tour: tourDetails.tour_id,
      adult_number: adultCount,
      child_number: childCount,
      adult_price: adultFare,
      child_price: childFare,
      single_bed_count: singleBedCount,
      twin_bed_count: twinBedCount,
      triple_bed_count: tripleBedCount,
      tax_price: taxFare,
      booking_total_price: totalPrice,
      travellers: values.travellers,
      primary_name: values.primaryContact.name,
      primary_email: values.primaryContact.email,
      primary_mobile: values.primaryContact.mobile,
      primary_address: values.primaryContact.address,

      // Discount/Staff
      discount_code: values.discountCode || null,
      staff_name: values.referredSalesStaffName || null,

      is_accept: values.termsAccepted,
      is_agree: values.privacyAccepted,
    };
    console.log(bookingData, "booking data last step");

    try {
      const res = await getTourBookingFirstStep(bookingData).unwrap();
      console.log(res, "booking response");
      if (res?.status === "success") {
        setBookingResponse(res.data);
        // Navigate to checkout with booking ID
        router.push(
          `/checkout?booking_id=${tourDetails.destination_id}&destination_id=${tourDetails.destination_id}`,
        );
      }
    } catch (err) {
      console.error("Booking Error:", err);
      // Handle error message
    }
  };

  const inputClass =
    "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400";
  const cardClass = "rounded-lg bg-white";

  return (
    <div>
      {/* --- DESTINATIONS HERO BANNER --- */}
      <div className="relative h-[40vh] md:h-[50vh] bg-brand-navy overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="Discover the World"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Discover the World
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm md:text-base font-medium">
              <span>Home</span>
              <span className="w-1 h-1 rounded-full bg-brand-green"></span>
              <span className="text-brand-green">Booking</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mt-6">
        {/* Steps header */}
        <StepHeader currentStep={step} />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Section */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {step === 0 && (
              <>
                {/* ✅ TOUR OVERVIEW content*/}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* Tour Details */}
                  {/* Tour Details */}
                  <div className="border border-brand-sand rounded-xl">
                    <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                      TOUR DETAILS
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-black">
                        Your Flight Details
                      </h3>

                      <div className="grid grid-cols-1 gap-4 text-gray-600 pt-3">
                        {/* Going Flight */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-teal-800">
                              DEPARTURE
                            </span>
                            <span className="text-xs text-gray-500">
                              {tourDetails.going_date}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>{tourDetails.going_flight}</span>
                            <span className="font-semibold">
                              {tourDetails.going_start_schedule} ✈{" "}
                              {tourDetails.going_end_schedule}
                            </span>
                          </div>
                        </div>

                        {/* Coming Flight */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-teal-800">
                              RETURN
                            </span>
                            {/* <span className="text-xs text-gray-500">{tourDetails.coming_date}</span> */}
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>{tourDetails.coming_flight}</span>
                            <span className="font-semibold">
                              {tourDetails.coming_start_schedule} ✈{" "}
                              {tourDetails.coming_end_schedule}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room 1 */}
                  <div className="border border-brand-sand rounded-xl">
                    <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                      ROOM Booking
                    </div>

                    <div className="px-4 pt-4 pb-6 grid grid-cols-1 md:grid-cols-5 gap-4 font-semibold">
                      <div>
                        <label className="text-sm text-gray-900">Adult</label>
                        <select
                          className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm"
                          value={adultCount}
                          onChange={(e) =>
                            setAdultCount(Number(e.target.value))
                          }
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          x ${adultFare} = $
                          {(adultCount * adultFare).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">Child</label>
                        <select
                          className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm"
                          value={childCount}
                          onChange={(e) =>
                            setChildCount(Number(e.target.value))
                          }
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          x ${childFare} = $
                          {(childCount * childFare).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">
                          Single Bed Count
                        </label>
                        <select
                          className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm"
                          value={singleBedCount}
                          onChange={(e) =>
                            setSingleBedCount(Number(e.target.value))
                          }
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          x ${singleBedFare} = $
                          {(singleBedCount * singleBedFare).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">
                          Twin Bed Count
                        </label>
                        <select
                          className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm"
                          value={twinBedCount}
                          onChange={(e) =>
                            setTwinBedCount(Number(e.target.value))
                          }
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          x ${twinBedFare} = $
                          {(twinBedCount * twinBedFare).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">
                          Tripple Bed Count
                        </label>
                        <select
                          className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm"
                          value={tripleBedCount}
                          onChange={(e) =>
                            setTripleBedCount(Number(e.target.value))
                          }
                        >
                          {[...Array(6)].map((_, i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          x ${tripleBedFare} = $
                          {(tripleBedCount * tripleBedFare).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Total Price Display */}
                    <div className="bg-brand-green/10 border-t border-brand-sand p-4 flex justify-between items-center">
                      <span className="font-bold text-teal-800">
                        TOTAL ESTIMATED PRICE
                      </span>
                      <span className="text-2xl font-bold text-teal-900">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* ✅ Step 0 Validation Error */}
                    {step0Error && (
                      <div className="mx-4 mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <span className="text-red-500 text-lg">⚠️</span>
                        <p className="text-sm font-medium text-red-600">
                          {step0Error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                {/* ✅ PASSENGER DETAILS content*/}
                <div className="col-span-12 lg:col-span-8 space-y-6 ">
                  {/* Tour Details */}
                  <div className="border border-brand-sand rounded-xl shadow-lg">
                    <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                      TOUR DETAILS
                    </div>

                    <div className="p-4 space-y-2">
                      {/* <h3 className="font-bold text-black">
                        {tourDetails.title}
                      </h3> */}

                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-teal-800">
                            DEPARTURE
                          </span>
                          <span className="text-xs text-gray-500">
                            {tourDetails.going_date}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>{tourDetails.going_flight}</span>
                          <span className="font-semibold">
                            {tourDetails.going_start_schedule} ✈{" "}
                            {tourDetails.going_end_schedule}
                          </span>
                        </div>
                      </div>

                      {/* Coming Flight */}
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-teal-800">
                            RETURN
                          </span>
                          {/* <span className="text-xs text-gray-500">{tourDetails.coming_date}</span> */}
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>{tourDetails.coming_flight}</span>
                          <span className="font-semibold">
                            {tourDetails.coming_start_schedule} ✈{" "}
                            {tourDetails.coming_end_schedule}
                          </span>
                        </div>
                      </div>
                    </div>

                    <hr className="my-2 mx-8 text-brand-sand" />

                    {/* react hook form start */}

                    <form
                      id="bookingForm"
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* PRIMARY CONTACT */}
                      <div className={cardClass}>
                        <div className="px-5 pt-5">
                          <p className="text-brand-coral font-bold tracking-wide text-lg">
                            Primary Contact
                          </p>
                        </div>

                        <div className="p-5">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                              label="Name"
                              error={errors.primaryContact?.name?.message}
                            >
                              <input
                                className={inputClass}
                                placeholder="Enter name"
                                {...register("primaryContact.name")}
                              />
                            </Field>

                            <Field
                              label="Email"
                              error={errors.primaryContact?.email?.message}
                            >
                              <input
                                className={inputClass}
                                type="email"
                                placeholder="name@email.com"
                                {...register("primaryContact.email")}
                              />
                            </Field>

                            <Field
                              label="Mobile"
                              error={errors.primaryContact?.mobile?.message}
                            >
                              <input
                                className={inputClass}
                                placeholder="+8801XXXXXXXXX"
                                {...register("primaryContact.mobile")}
                              />
                              <p className="text-[11px] text-slate-500">
                                Digits, +, -, space, () allowed
                              </p>
                            </Field>

                            <Field
                              label="Address"
                              error={errors.primaryContact?.address?.message}
                            >
                              <input
                                className={inputClass}
                                placeholder="Full address"
                                {...register("primaryContact.address")}
                              />
                            </Field>
                          </div>
                        </div>
                      </div>
                      <hr className="my-2 mx-8 text-brand-sand" />

                      {/* TRAVELLERS */}
                      {fields.map((t, idx) => {
                        const e = errors.travellers?.[idx];
                        return (
                          <div key={t.id} className={cardClass}>
                            <div className="px-5 pt-5">
                              <SectionTitle
                                title={`TRAVELLER ${idx + 1} - ${idx < adultCount ? "ADULT" : "CHILD"}`}
                                color="text-teal-700"
                              />
                            </div>

                            <div className="p-5">
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Field label="Name" error={e?.name?.message}>
                                  <input
                                    className={inputClass}
                                    {...register(`travellers.${idx}.name`)}
                                  />
                                </Field>

                                <Field label="Email" error={e?.email?.message}>
                                  <input
                                    className={inputClass}
                                    type="email"
                                    {...register(`travellers.${idx}.email`)}
                                  />
                                </Field>

                                <Field
                                  label="Mobile"
                                  error={e?.mobile?.message}
                                >
                                  <input
                                    className={inputClass}
                                    {...register(`travellers.${idx}.mobile`)}
                                  />
                                </Field>

                                <Field
                                  label="Nationality"
                                  error={e?.nationality?.message}
                                >
                                  <input
                                    className={inputClass}
                                    {...register(
                                      `travellers.${idx}.nationality`,
                                    )}
                                  />
                                </Field>

                                <Field
                                  label="Date of Birth"
                                  error={e?.dateOfBirth?.message}
                                >
                                  <input
                                    className={inputClass}
                                    type="date"
                                    {...register(
                                      `travellers.${idx}.dateOfBirth`,
                                    )}
                                  />
                                </Field>

                                <Field
                                  label="Passport No."
                                  error={e?.passportNo?.message}
                                >
                                  <input
                                    className={inputClass}
                                    {...register(
                                      `travellers.${idx}.passportNo`,
                                    )}
                                  />
                                </Field>

                                <div className="">
                                  <Field
                                    label="Expiry Date"
                                    error={e?.expiryDate?.message}
                                  >
                                    <input
                                      className={inputClass}
                                      type="date"
                                      {...register(
                                        `travellers.${idx}.expiryDate`,
                                      )}
                                    />
                                  </Field>
                                </div>
                              </div>

                              {idx === 0 ? (
                                <hr className="my-5 border-slate-200" />
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </form>
                  </div>
                  <div>
                    {/* DISCOUNT + REFERRED STAFF */}
                    <div className="rounded-lg border border-slate-200 bg-white shadow-lg">
                      <div className="p-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_140px] md:items-end">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">
                              Discount Code (if any)
                            </label>
                            <input
                              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                              placeholder="Enter discount code"
                              {...register("discountCode")}
                            />
                            {errors.discountCode?.message ? (
                              <p className="text-xs text-red-600">
                                {String(errors.discountCode.message)}
                              </p>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            className="h-10 rounded-md bg-brand-coral/90 px-5 text-sm font-bold tracking-wider text-md text-white hover:bg-brand-coral duration-300"
                            onClick={() => {
                              const code = form
                                .getValues("discountCode")
                                ?.trim();
                              console.log("APPLY COUPON:", code);
                            }}
                          >
                            APPLY
                          </button>
                        </div>

                        <div className="mt-4 space-y-1">
                          <label className="text-sm font-medium text-slate-700">
                            Referred Sales Staff Name
                          </label>
                          <input
                            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                            placeholder="Enter staff name"
                            {...register("referredSalesStaffName")}
                          />
                          {errors.referredSalesStaffName?.message ? (
                            <p className="text-xs text-red-600">
                              {String(errors.referredSalesStaffName.message)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* IMPORTANT NOTE */}
                    <div className="rounded-lg border border-sky-200 bg-sky-50 mt-5">
                      <div className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-sky-600 text-white">
                            i
                          </div>
                          <div className="w-full">
                            <h4 className="font-semibold text-slate-800">
                              Important Note
                            </h4>

                            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                              <li>
                                All travellers are expected to be at the correct
                                travel on return date of the tour.
                              </li>
                              <li>
                                Traveller names should be entered exactly as how
                                they appear on passports.
                              </li>
                              <li>
                                All passports must be valid for another 6 months
                                before tour departure.
                              </li>
                              <li>
                                All tours are subject to confirmation, based on
                                minimum group size to depart, usually 2 to 3
                                weeks before departure.
                              </li>
                              <li>
                                Tour itinerary and fuel surcharges are subject
                                to changes till all tickets are issued.
                              </li>
                              <li>
                                Tour prices do not include travel charges.
                                Travellers must ensure they hold a valid travel
                                visa to enter their destination country(ies).
                              </li>
                              <li>
                                Tour prices include gratuities for tour leader
                                or manager, onewere guide and driver, if any.
                              </li>
                              <li>
                                Administrative fee may be chargeable for any
                                special request or additional service.
                              </li>
                            </ul>

                            <div className="mt-5 space-y-3">
                              <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  className="mt-1 h-4 w-4 rounded border-slate-300"
                                  {...register("termsAccepted")}
                                />
                                <span>
                                  I understand and accept{" "}
                                  <a
                                    className="text-rose-600 hover:underline"
                                    href="/terms"
                                    target="_blank"
                                  >
                                    CTC's terms and conditions
                                  </a>
                                </span>
                              </label>
                              {errors.termsAccepted?.message ? (
                                <p className="text-xs text-red-600">
                                  {String(errors.termsAccepted.message)}
                                </p>
                              ) : null}

                              <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  className="mt-1 h-4 w-4 rounded border-slate-300"
                                  {...register("privacyAccepted")}
                                />
                                <span>
                                  By submitting, I agree to{" "}
                                  <a
                                    className="text-rose-600 hover:underline"
                                    href="/privacy"
                                    target="_blank"
                                  >
                                    CTC's privacy policy
                                  </a>
                                </span>
                              </label>
                              {errors.privacyAccepted?.message ? (
                                <p className="text-xs text-red-600">
                                  {String(errors.privacyAccepted.message)}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* ✅ REVIEW & PAYMENT content */}
                <div className="space-y-6">
                  {/* Reuse ReviewBookingStep or simple display */}
                  {bookingResponse ? (
                    <div className="bg-white border border-brand-sand rounded-xl p-6 shadow-md">
                      <h3 className="text-xl font-bold text-teal-800 mb-4">
                        Booking Review
                      </h3>
                      <p>
                        <strong>Booking ID:</strong> {bookingResponse.id}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {bookingResponse.booking_status}
                      </p>
                      <hr className="my-4" />
                      <p>
                        <strong>Primary Contact:</strong>{" "}
                        {bookingResponse.primary_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {bookingResponse.primary_email}
                      </p>
                      <p>
                        <strong>Mobile:</strong>{" "}
                        {bookingResponse.primary_mobile}
                      </p>

                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700">
                          Price Breakdown
                        </h4>
                        <p>Total: ${bookingResponse.booking_total_price}</p>
                      </div>
                    </div>
                  ) : (
                    <ReviewBookingStep
                      form={form}
                      adultCount={adultCount}
                      onEdit={() => setStep(1)}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Summary */}
          <div className="col-span-12 lg:col-span-4">
            <div className="border border-brand-sand rounded-xl">
              <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                BOOKING SUMMARY
              </div>

              <div className="p-4 space-y-2">
                <SummaryRow
                  label="Adult"
                  price={`$${adultFare}`}
                  qty={adultCount}
                  total={`$${(adultCount * adultFare).toFixed(2)}`}
                />

                {childCount > 0 && (
                  <SummaryRow
                    label="Child"
                    price={`$${childFare}`}
                    qty={childCount}
                    total={`$${(childCount * childFare).toFixed(2)}`}
                  />
                )}

                {singleBedCount > 0 && (
                  <SummaryRow
                    label="Single Bed"
                    price={`$${singleBedFare}`}
                    qty={singleBedCount}
                    total={`$${(singleBedCount * singleBedFare).toFixed(2)}`}
                  />
                )}

                {twinBedCount > 0 && (
                  <SummaryRow
                    label="Twin Bed"
                    price={`$${twinBedFare}`}
                    qty={twinBedCount}
                    total={`$${(twinBedCount * twinBedFare).toFixed(2)}`}
                  />
                )}

                {tripleBedCount > 0 && (
                  <SummaryRow
                    label="Triple Bed"
                    price={`$${tripleBedFare}`}
                    qty={tripleBedCount}
                    total={`$${(tripleBedCount * tripleBedFare).toFixed(2)}`}
                  />
                )}

                <div className="border-t border-brand-sand my-2" />

                <SummaryRow
                  label="Taxes"
                  price={`$${taxFare}`}
                  qty={totalPax}
                  total={`$${totalTax.toFixed(2)}`}
                />

                <div className="border-t border-brand-sand my-2" />

                <div className="flex justify-between font-semibold">
                  <span className="text-black font-bold">Total SGD</span>
                  <span className="text-teal-700">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                {step === 1 && (
                  <>
                    <CheckoutCountdown
                      expiresAt={Date.now() + 35 * 60 * 1000}
                      onExpire={() => console.log("Expired")}
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    <CheckoutCountdown
                      expiresAt={Date.now() + 35 * 60 * 1000}
                      onExpire={() => console.log("Expired")}
                    />
                  </>
                )}

                <button
                  onClick={handleNext}
                  className="w-full mt-4 bg-brand-coral/90 hover:bg-brand-coral cursor-pointer text-white py-2 rounded-md duration-300 font-bold tracking-wide"
                >
                  {nextLabel}
                </button>

                {/* Optional: Back button */}
                {step > 0 && (
                  <button
                    onClick={() =>
                      setStep((prev) => (prev === 2 ? 1 : 0) as StepKey)
                    }
                    className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded duration-300 font-bold tracking-wide"
                  >
                    BACK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
