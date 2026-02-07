'use client'
import { useRouter } from 'next/navigation'
import Cruise from '@/components/Cruises/Cruise'

export default function CruisesPage() {
  const router = useRouter()

  const handleNavigateCabinBooking = () => {
    router.push('/cabin-booking')
  }

  return (
    <Cruise onCruiseClick={handleNavigateCabinBooking} />
  )
}
