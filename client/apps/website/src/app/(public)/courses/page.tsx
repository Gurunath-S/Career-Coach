import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingEnrollButton from '@/components/common/FloatingEnrollButton'
import PopularCourses from '@/components/sections/PopularCourses'
import CourseCategories from '@/components/sections/CourseCategories'
import EnquiryCTA from '@/components/sections/EnquiryCTA'

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-8">
        <PopularCourses />
        <CourseCategories />
        <EnquiryCTA />
      </main>
      <Footer />
      <FloatingEnrollButton />
    </>
  )
}
