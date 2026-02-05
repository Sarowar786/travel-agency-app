'use client'
import { useRouter } from 'next/navigation'
import Booking from '@/components/Bookig/Booking'

export default function BookingPage() {
  const router = useRouter()

  const handleNavigateMakeBooking = () => {
    router.push('/make-booking')
  }

  return (
    <Booking onNavigateMakeBooking={handleNavigateMakeBooking} />
  )
}
