'use client'
import { useRouter } from 'next/navigation'
import MakeBooking from '@/components/Bookig/MakeBooking'

export default function MakeBookingPage() {
  const router = useRouter()

  const handleNavigateMakeBooking = () => {
    router.push('/package-details')
  }

  return (
    <MakeBooking onNavigateMakeBooking={handleNavigateMakeBooking} />
  )
}
