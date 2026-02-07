
'use client'
import { useState } from 'react'
import BlogSection from '@/components/UI/BlogSection'
import FeaturedCruises from '@/components/UI/FeaturedCruises'
import FeaturedTrips from '@/components/UI/FeaturedTrips'
import Hero from '@/components/UI/Hero'
import MoodCloud from '@/components/UI/MoodCloud'
import ValueProps from '@/components/UI/ValueProps'
import WaveTransition from '@/components/UI/WaveTransition'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleTripClick = () => {
    router.push('/package-details')
  }
  const handleNavigateBlogClick = () => {
    router.push('/blog-details')
  }

  return (
    <div className='bg-white'>
      <Hero />
      <MoodCloud />
      <FeaturedTrips onTripClick={handleTripClick} />
      <FeaturedCruises />
      <div className="relative  bg-linear-to-b from-brand-teal to-brand-navy">
        <WaveTransition />
        <ValueProps />
        <BlogSection onBlogClick={handleNavigateBlogClick} />
      </div>
    </div>
  )
}
