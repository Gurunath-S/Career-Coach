import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import EnquiryCTA from '@/components/sections/EnquiryCTA'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <EnquiryCTA />
      </main>
      <Footer />
      <FloatingEnrollButton />
    </>
  )
}
