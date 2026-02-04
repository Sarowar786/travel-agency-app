import Navbar from '@/components/Navbar/page'
import FeaturedTrips from '@/components/UI/FeaturedTrips'
import Hero from '@/components/UI/Hero'
import MoodCloud from '@/components/UI/MoodCloud'
import React from 'react'

export default function HomePage() {
  return (
    <div className='bg-white'>
      <Hero/>
      <MoodCloud/>
      <FeaturedTrips />
    </div>
  )
}
