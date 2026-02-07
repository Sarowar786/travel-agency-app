'use client'
import { useRouter } from 'next/navigation'
import CruisePackageDetails from '@/components/Cruises/CruisePackageDetails'

export default function PackageDetailsPage() {
  const router = useRouter()

  const handleNavigateBack = () => {
    router.push('/cruises')
  }


  return (
    <CruisePackageDetails 
      onNavigateBack={handleNavigateBack} 
    //   onCruiseClick={handleNavigateCabinBooking} 
    />
  )
}
