// 'use client'
// import React, { useState } from 'react'
// import {useForm} from "react-hook-form"
// import * as z from "zod"
// import Link from "next/link"
// import { useDebounceValue } from 'usehooks-ts'
// import { useRouter } from 'next/navigation'
// import { zodResolver } from '@hookform/resolvers/zod'



// const signUpSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// })


// export default function SignUpPage() {
//   const [userName, setUserName] = useState('')
//   const [userNameMessage, setUserNameMessage] = useState('')
//   const [isCheckingUserName, setIsCheckingUserName] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const debouncedUserName = useDebounceValue(userName, 500)
//   const router = useRouter()
  
//   // zod implementation
//     const signUpForm = useForm<z.infer<typeof signUpSchema>>({
//       resolver: zodResolver(signUpSchema),
//     })
//   return (
//     <div>
      
//     </div>
//   )
// }
