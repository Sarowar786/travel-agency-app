"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReviewBookingStep from "./ReviewBookingStep";
import { CheckoutCountdown } from "./CheckoutCountdown";


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

// const StepHeader = ({ currentStep }: { currentStep: StepKey }) => {
//   return (
//     <div className="flex items-center justify-center mb-8 max-w-2xl mx-auto p-5 bg-gray-200 rounded-xl">
//       <div className="flex items-center justify-between space-x-8">
//         {steps.map((s, idx) => {
//           const isDone = s.key < currentStep;
//           const isActive = s.key === currentStep;

//           const circleClass = isDone
//             ? "bg-orange-500"
//             : isActive
//               ? "bg-orange-500"
//               : "bg-gray-400";

//           const textClass = isDone
//             ? "text-gray-500"
//             : isActive
//               ? "text-orange-500"
//               : "text-gray-500";

//           return (
//             <div >
//               <div key={s.key} className={`flex flex-col gap-1 items-center space-x-2  ${textClass}`}>
//                 <span
//                   className={`w-8 h-8 rounded-full ${circleClass} text-white flex items-center justify-center text-sm`}
//                 >
//                   {isDone ? "✓" : idx + 1}
//                 </span>
//                 <span className="text-sm">{s.label}</span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

//====================
//passenger details

const StepHeader = ({ currentStep }: { currentStep: StepKey }) => {
  return (
    <div className="max-w-3xl mx-auto mb-8 rounded-xl bg-gray-200 px-6 py-3">
      <div className="flex items-center">
        {steps.map((s, idx) => {
          const isDone = s.key < currentStep;
          const isActive = s.key === currentStep;

          const circleClass = isDone || isActive ? "bg-orange-500" : "bg-gray-400";
          const labelClass = isActive ? "text-orange-500" : "text-gray-500";

          // connector: left step done হলে orange, না হলে gray
          const connectorClass = s.key < currentStep ? "bg-orange-500" : "bg-gray-400";

          return (
            <React.Fragment key={s.key}>
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`w-8 h-8 rounded-full ${circleClass} text-white flex items-center justify-center text-sm font-bold shrink-0`}
                >
                  {isDone ? "✓" : idx + 1}
                </span>
                <span className={`text-xs font-medium ${labelClass}`}>
                  {s.label}
                </span>
              </div>

              {/* Connector should touch circles (no padding, flex-1 fills space) */}
              {idx !== steps.length - 1 && (
                <div className="flex-1 -mt-6">
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
      ctx.addIssue({ code: "custom", path: ["dateOfBirth"], message: "Invalid date" });
    }
    if (Number.isNaN(exp.getTime())) {
      ctx.addIssue({ code: "custom", path: ["expiryDate"], message: "Invalid date" });
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

  travellers: z.array(travellerSchema).length(2, "Exactly 2 travellers are required"),

  // Optional fields
  discountCode: z.string().optional(),
  referredSalesStaffName: z.string().optional(),

  // ✅ Checkbox validation (fixed)
  termsAccepted: z
    .boolean()
    .refine(val => val === true, { message: "You must accept the terms and conditions" }),

  privacyAccepted: z
    .boolean()
    .refine(val => val === true, { message: "You must accept the privacy policy" }),
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
      <h3 className={`text-xs font-semibold tracking-wide ${color ?? "text-slate-700"}`}>
        {title}
      </h3>
    </div>
  );
}


export default function MakeBooking() {
  const router = useRouter();
  const [step, setStep] = useState<StepKey>(0);

  const handleNext = () => {
    if (step === 0) return setStep(1);
    if (step === 1) return setStep(2);
    // last step -> checkout/confirmation
    router.push("/checkout"); // or "/checkout"
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

  const onSubmit = (values: FormValues) => {
    console.log("SUBMIT:", values);
    // TODO: API call
    // Move to next step after validation passes
    setStep(2);
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
                {/* ✅ TOUR OVERVIEW content: তুমি এখানে যেগুলো দেখাতে চাও বসাবে */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* Tour Details */}
                  <div className="border border-brand-sand rounded-xl">
                    <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                      TOUR DETAILS
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-black">
                        7D NEW MT. LU/MT. DAJUE + WUYUAN
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-gray-600 pt-3">
                        <div>
                          <p className="font-medium text-sm text-gray-500">DEPARTURE DATE</p>
                          <p className="font-semibold text-black">
                            Wed, 18 Feb 2026 ✈
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-sm text-gray-500">RETURN DATE</p>
                          <p className="font-semibold text-black">
                            Tue, 24 Feb 2026
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-sm text-gray-500 pt-3">TOUR CODE</p>
                          <p className="font-semibold text-black">
                            02CKH1D 18/26MU
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Number of Rooms */}
                  <div className="border border-brand-sand rounded-xl">
                    <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                      NUMBER OF ROOMS
                    </div>

                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm text-gray-800 font-semibold mb-1">
                          Select number of rooms, total 8 pax allowed per booking
                        </label>
                        <input
                          type="number"
                          className="w-50 border border-gray-300 bg-gray-100 rounded px-3 py-1.5 mt-1 shadow text-sm"
                        />
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-xs font-semibold text-gray-900">
                        <strong>NOTE:</strong> As a licensing condition of the Singapore
                        Tourism Board, Commonwealth Travel Service Corporation Pte Ltd
                        are required to inform you, the Client, to consider purchasing
                        travel insurance.
                        <br />
                        <br />
                        Get a comprehensive travel insurance policy to protect against
                        unforeseen circumstances, such as baggage loss, flight delays,
                        travel agent insolvency and medical emergencies.
                      </div>
                    </div>
                  </div>

                  {/* Room 1 */}
                  <div className="border border-brand-sand rounded-xl">
                    <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                      ROOM 1
                    </div>

                    <div className="px-4 pt-4 pb-6 grid grid-cols-1 md:grid-cols-5 gap-4 font-semibold">
                      <div>
                        <label className="text-sm text-gray-900">Adult</label>
                        <select className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                          <option>0</option>
                          <option>1</option>
                          <option>2</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">Child w/ Bed</label>
                        <select className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                          <option>0</option>
                          <option>1</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">Child w/o Bed</label>
                        <select className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                          <option>0</option>
                          <option>1</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">Infants</label>
                        <select className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                          <option>0</option>
                          <option>1</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-900">Room Type</label>
                        <select className="w-full border border-brand-sand rounded-lg bg-gray-100  px-2 py-2 shadow text-sm">
                          <option>Twin Bed</option>
                          <option>Double Bed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                {/* ✅ PASSENGER DETAILS content: তুমি এখানে বসাবে */}
                <div className="col-span-12 lg:col-span-8 space-y-6 ">
                  {/* Tour Details */}
                  <div className="border border-brand-sand rounded-xl shadow-lg">
                    <div className="bg-teal-800 text-white px-4 py-2 font-semibold rounded-t-xl">
                      TOUR DETAILS
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-black">
                        7D NEW MT. LU/MT. DAJUE + WUYUAN
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-gray-600 pt-3">
                        <div>
                          <p className="font-medium text-sm text-gray-500">DEPARTURE DATE</p>
                          <p className="font-semibold text-black">
                            Wed, 18 Feb 2026 ✈
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-sm text-gray-500">RETURN DATE</p>
                          <p className="font-semibold text-black">
                            Tue, 24 Feb 2026
                          </p>
                        </div>

                        <div>
                          <p className="font-medium text-sm text-gray-500 pt-3">TOUR CODE</p>
                          <p className="font-semibold text-black">
                            02CKH1D 18/26MU
                          </p>
                        </div>
                      </div>
                    </div>

                    <hr className='my-2 mx-8 text-brand-sand' />

                    {/* react hook form start */}

                    <form id="bookingForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* PRIMARY CONTACT */}
                      <div className={cardClass}>
                        <div className="px-5 pt-5">
                          <p className='text-brand-coral font-bold tracking-wide text-lg'>Primary Contact</p>
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
                      <hr className='my-2 mx-8 text-brand-sand' />

                      {/* TRAVELLERS */}
                      {fields.map((t, idx) => {
                        const e = errors.travellers?.[idx];
                        return (
                          <div key={t.id} className={cardClass}>
                            <div className="px-5 pt-5">
                              <SectionTitle title={`TRAVELLER ${idx + 1} - ADULT`} color="text-teal-700" />
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

                                <Field label="Mobile" error={e?.mobile?.message}>
                                  <input
                                    className={inputClass}
                                    {...register(`travellers.${idx}.mobile`)}
                                  />
                                </Field>

                                <Field label="Nationality" error={e?.nationality?.message}>
                                  <input
                                    className={inputClass}
                                    {...register(`travellers.${idx}.nationality`)}
                                  />
                                </Field>

                                <Field label="Date of Birth" error={e?.dateOfBirth?.message}>
                                  <input
                                    className={inputClass}
                                    type="date"
                                    {...register(`travellers.${idx}.dateOfBirth`)}
                                  />
                                </Field>

                                <Field label="Passport No." error={e?.passportNo?.message}>
                                  <input
                                    className={inputClass}
                                    {...register(`travellers.${idx}.passportNo`)}
                                  />
                                </Field>

                                <div className="">
                                  <Field label="Expiry Date" error={e?.expiryDate?.message}>
                                    <input
                                      className={inputClass}
                                      type="date"
                                      {...register(`travellers.${idx}.expiryDate`)}
                                    />
                                  </Field>
                                </div>
                              </div>

                              {idx === 0 ? <hr className="my-5 border-slate-200" /> : null}
                            </div>
                          </div>
                        );
                      })}

                      {/* ACTIONS */}
                      {/* <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="h-10 rounded-md border border-slate-200 bg-white px-4 text-sm hover:bg-slate-50"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 rounded-md bg-slate-900 px-5 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Continue
                  </button>
                </div> */}
                    </form>



                  </div>
                  <div>
                    {/* DISCOUNT + REFERRED STAFF */}
                    <div className="rounded-lg border border-slate-200 bg-white shadow-lg">
                      <div className="p-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_140px] md:items-end">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Discount Code (if any)</label>
                            <input
                              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                              placeholder="Enter discount code"
                              {...register("discountCode")}
                            />
                            {errors.discountCode?.message ? (
                              <p className="text-xs text-red-600">{String(errors.discountCode.message)}</p>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            className="h-10 rounded-md bg-brand-coral/90 px-5 text-sm font-bold tracking-wider text-md text-white hover:bg-brand-coral duration-300"
                            onClick={() => {
                              const code = form.getValues("discountCode")?.trim();
                              // ✅ এখানে তোমার apply coupon logic / API call দাও
                              console.log("APPLY COUPON:", code);
                            }}
                          >
                            APPLY
                          </button>
                        </div>

                        <div className="mt-4 space-y-1">
                          <label className="text-sm font-medium text-slate-700">Referred Sales Staff Name</label>
                          <input
                            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-slate-400"
                            placeholder="Enter staff name"
                            {...register("referredSalesStaffName")}
                          />
                          {errors.referredSalesStaffName?.message ? (
                            <p className="text-xs text-red-600">{String(errors.referredSalesStaffName.message)}</p>
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
                            <h4 className="font-semibold text-slate-800">Important Note</h4>

                            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                              <li>All travellers are expected to be at the correct travel on return date of the tour.</li>
                              <li>Traveller names should be entered exactly as how they appear on passports.</li>
                              <li>All passports must be valid for another 6 months before tour departure.</li>
                              <li>
                                All tours are subject to confirmation, based on minimum group size to depart, usually 2 to 3
                                weeks before departure.
                              </li>
                              <li>Tour itinerary and fuel surcharges are subject to changes till all tickets are issued.</li>
                              <li>
                                Tour prices do not include travel charges. Travellers must ensure they hold a valid travel
                                visa to enter their destination country(ies).
                              </li>
                              <li>
                                Tour prices include gratuities for tour leader or manager, onewere guide and driver, if any.
                              </li>
                              <li>
                                Administrative fee may be chargeable for any special request or additional service.
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
                                  <a className="text-rose-600 hover:underline" href="/terms" target="_blank">
                                    CTC's terms and conditions
                                  </a>
                                </span>
                              </label>
                              {errors.termsAccepted?.message ? (
                                <p className="text-xs text-red-600">{String(errors.termsAccepted.message)}</p>
                              ) : null}

                              <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  className="mt-1 h-4 w-4 rounded border-slate-300"
                                  {...register("privacyAccepted")}
                                />
                                <span>
                                  By submitting, I agree to{" "}
                                  <a className="text-rose-600 hover:underline" href="/privacy" target="_blank">
                                    CTC's privacy policy
                                  </a>
                                </span>
                              </label>
                              {errors.privacyAccepted?.message ? (
                                <p className="text-xs text-red-600">{String(errors.privacyAccepted.message)}</p>
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
                {/* ✅ REVIEW & PAYMENT content: তুমি এখানে বসাবে */}
                <ReviewBookingStep
                  form={form}
                  onEdit={() => setStep(1)}
                />
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
                <SummaryRow label="Adult (Twin)" price="$2,568" qty={2} total="$4,236" />

                <div className="border-t border-brand-sand my-2" />

                <SummaryRow label="Taxes" price="$100" qty={2} total="$200" />

                <div className="border-t border-brand-sand my-2" />

                <SummaryRow
                  label="CRKHOLDING 13"
                  price="($820)"
                  qty={2}
                  total="($1,000)"
                  negative
                />

                <div className="border-t border-brand-sand my-2" />

                <div className="flex justify-between font-semibold">
                  <span className="text-black font-bold">Total SGD</span>
                  <span className="text-teal-700">$3,495</span>
                </div>

                {step === 1 && (
                  <>
                    {/* ✅ REVIEW & PAYMENT content: তুমি এখানে বসাবে */}
                    <CheckoutCountdown
                      expiresAt={Date.now() + 35 * 60 * 1000}
                      onExpire={() => console.log("Expired")} 
                    />
                  </>
                )}
                {step === 2 && (
                  <>
                    {/* ✅ REVIEW & PAYMENT content: তুমি এখানে বসাবে */}
                    <CheckoutCountdown
                      expiresAt={Date.now() + 35 * 60 * 1000}
                      onExpire={() => console.log("Expired")} 
                    />
                  </>
                )}
                {/* ✅ One button controls step + last navigates */}
                <button
                  onClick={() => {
                    if (step === 1) {
                      // Submit form for validation on step 1
                      const form = document.getElementById("bookingForm") as HTMLFormElement;
                      if (form) form.requestSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  className="w-full mt-4 bg-brand-coral/90 hover:bg-brand-coral text-white py-2 rounded-md duration-300 font-bold tracking-wide"
                >
                  {nextLabel}
                </button>

                {/* Optional: Back button (if you want) */}
                {/* 
                {step > 0 && (
                  <button
                    onClick={() => setStep((prev) => (prev === 2 ? 1 : 0))}
                    className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded duration-300 font-bold tracking-wide"
                  >
                    BACK
                  </button>
                )} 
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
