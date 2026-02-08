'use client'
import Link from "next/link";
import {z} from 'zod'
import leftimage from '../../../../public/images/company-logo.png'
import Image from "next/image";
import logo from '../../../../public/images/logonav.png'
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { log } from "console";

const registerSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword:z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match", 
    path: ["confirmPassword"], 
  });

export default function SignupPage() {

  const {register,handleSubmit,setError, formState:{errors,isSubmitting}, } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues:{
      name:'',
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched", 
  })

  console.log(useForm())

  const onSubmit=async(data:FieldValues)=>{
    console.log( "Register data : ", data)
    await new Promise((r)=> setTimeout(r,800))
    alert("Register successfully")
  }
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Image */}
      <div className="relative hidden lg:block border-r border-r-amber-50">
        <Image
          src={leftimage} // ✅ তুমি public/images এ image রাখো
          alt="Campus"
          fill
          className="object-content"
          priority
        />
        {/* optional overlay blur / tint */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center">
            {/* চাইলে logo image দাও */}
            <div className="w-60 flex items-center justify-center">
              <Image src={logo} alt="logo"/>
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
              Hey! Welcome
            </h1>
            <p className="mt-1 text-sm text-gray-500">Register your account</p>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-4">
            <div>
              <label className="text-sm text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                  ${errors.email ? "border-red-500" : "border-gray-200 focus:border-orange-500"}
                `}
                {...register('name')}
              />
            </div>
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                  ${errors.email ? "border-red-500" : "border-gray-200 focus:border-orange-500"}
                `}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                  ${errors.password ? "border-red-500" : "border-gray-200 focus:border-orange-500"}
                `}
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`mt-1 w-full rounded-lg border px-4 py-3 text-sm outline-none transition
                  ${errors.password ? "border-red-500" : "border-gray-200 focus:border-orange-500"}
                `}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 transition text-white font-semibold py-3 disabled:opacity-60"
            >
              {isSubmitting ? "Register..." : "Register"}
            </button>
            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/signin" className="text-orange-500 font-semibold hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
