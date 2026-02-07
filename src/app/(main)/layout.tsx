import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
