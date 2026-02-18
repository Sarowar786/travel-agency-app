'use client'

import PackageDetails from '@/components/Destinations/PackageDetails'
import { use } from 'react'

export default function PackageDetailsPage({
  params,
}: {
 params: Promise<{ id: string }>
}) {
  const {id} = use(params)


  return (
    <PackageDetails 
      id= {id}
    
    />
  )
}
