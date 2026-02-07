'use client'
import { useRouter } from 'next/navigation'
import PackageDetails from '@/components/Destinations/PackageDetails'

export default function PackageDetailsPage() {
  const router = useRouter()

  const handleNavigateBack = () => {
    router.push('/destinations')
  }

  const handleNavigateBooking = () => {
    router.push('/booking')
  }

  return (
    <PackageDetails 
      onNavigateBack={handleNavigateBack} 
      onNavigateBooking={handleNavigateBooking} 
    />
  )
}
