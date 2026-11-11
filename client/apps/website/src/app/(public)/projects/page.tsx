import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import HandsOnProjects from '@/components/sections/HandsOnProjects'
import EnquiryCTA from '@/components/sections/EnquiryCTA'

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <HandsOnProjects />
        <EnquiryCTA />
      </main>
      <Footer />
      <FloatingEnrollButton />
    </>
  )
}
