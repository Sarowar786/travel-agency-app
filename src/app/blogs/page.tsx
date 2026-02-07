'use client'
import { useRouter } from 'next/navigation'
import Blogs from '@/components/Blog/Blogs'

export default function BlogPage() {
  const router = useRouter()

  const handleNavigateBlogDetails = () => {
    router.push('/blog-details')
  }

  return (
    <Blogs onBlogClick={handleNavigateBlogDetails} />
  )
}
