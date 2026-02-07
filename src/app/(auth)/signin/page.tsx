'use client'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import  Link  from "next/link"
import Image from "next/image"
import logo from "../../../../public/images/logonav.png"

// ---------------- schemas ----------------
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// ---------------- component ----------------
export default function SigninPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin")

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  })

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })

  const onSignIn = (data: z.infer<typeof signInSchema>) => {
    // API will call here for signin
    console.log("Sign In:", data)
  }
  
  const onSignUp = (data: z.infer<typeof signUpSchema>) => {
    // API will call here for signin
    console.log("Sign Up:", data)
  }

  return (
    <div>
      <div className="container mx-auto px-4 md:px-8 h-14 flex items-center">

      <Link href="/" className="flex items-center">
          {/* <img src={logo} alt="Long Vacation Logo" /> */}
          <Image src={logo} alt="long vacation logo" width={150} height={50} />
        </Link>
      </div>
      <div className="flex h-screen items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        
        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setTab("signin")}
            className={`rounded-md py-2 text-sm font-medium transition
              ${tab === "signin" ? "bg-white shadow" : "text-slate-600"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`rounded-md py-2 text-sm font-medium transition
              ${tab === "signup" ? "bg-white shadow" : "text-slate-600"}`}
          >
            Sign Up
          </button>
        </div>

        {/* ---------- Sign In ---------- */}
        {tab === "signin" && (
          <form
            onSubmit={signInForm.handleSubmit(onSignIn)}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...signInForm.register("email")}
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {signInForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {signInForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                {...signInForm.register("password")}
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {signInForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <Link href="/forget-password">
              <p className="text-brand-teal mb-2">Forget password?</p>
            </Link>

            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 py-2 text-white hover:bg-slate-800"
            >
              Sign In
            </button>
          </form>
        )}

        {/* ---------- Sign Up ---------- */}
        {tab === "signup" && (
          <form
            onSubmit={signUpForm.handleSubmit(onSignUp)}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                {...signUpForm.register("name")}
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {signUpForm.formState.errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {signUpForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...signUpForm.register("email")}
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {signUpForm.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {signUpForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                {...signUpForm.register("password")}
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {signUpForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {signUpForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                {...signUpForm.register("confirmPassword")}
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {signUpForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 py-2 text-white hover:bg-slate-800"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
  )
}
