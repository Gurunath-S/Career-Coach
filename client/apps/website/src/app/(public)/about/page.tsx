import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import Introduction from '@/components/sections/Introduction'
import WhyLearnWithUs from '@/components/sections/WhyLearnWithUs'
import TrainersMentors from '@/components/sections/TrainersMentors'
import Testimonials from '@/components/sections/Testimonials'
import EnquiryCTA from '@/components/sections/EnquiryCTA'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <Introduction />
        <WhyLearnWithUs />
        <TrainersMentors />
        <Testimonials />
        <EnquiryCTA />
      </main>
      <Footer />
      <FloatingEnrollButton />
    </>
  )
}
