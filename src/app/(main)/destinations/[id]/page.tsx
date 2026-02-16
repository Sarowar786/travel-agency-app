'use client'
import PackageDetails from '@/components/Destinations/PackageDetails'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function TripSinglePage() {
     const router = useRouter()
    
      const handleNavigateBack = () => {
        router.push('/destinations')
      }
    
      const handleNavigateBooking = () => {
        router.push('/booking')
      }
  return (
    <div>
      <PackageDetails 
         onNavigateBack={handleNavigateBack} 
      onNavigateBooking={handleNavigateBooking}
      />
    </div>
  )
}
