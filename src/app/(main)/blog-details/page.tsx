'use client'
import { useRouter } from 'next/navigation'
import BlogDetails from '@/components/Blog/BlogDetails'

export default function BlogDEtails() {
  const router = useRouter()

  const handleNavigateMakeBooking = () => {
    router.push('/package-details')
  }
  const handleNavigateBack = ()=>{
    router.push("/blogs")
  }

  return (
    <BlogDetails 
    blogId=""
    onBlogClick={handleNavigateMakeBooking}
    onNavigateBack={handleNavigateBack}
    
    />
  )
}
