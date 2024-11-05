import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center px-6 py-3">
          <h1 className="text-3xl font-bold text-gray-900">VentureLink</h1>
          <Button asChild size="lg" variant="default" className='ml-auto'>
            <Link href="/login?role=investor">Log In</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-4xl font-extrabold text-gray-900">Connect Startups with the Right Investors</h2>
            <p className="mb-8 text-xl text-gray-600">Find your perfect match and accelerate your growth</p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg" variant="default">
                <Link href="/signin?role=founder">Sign in as Founder</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signin?role=investor">Sign in as Investor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>1. Create Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Sign up and build a comprehensive profile showcasing your startup or investment preferences.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>2. Explore Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Use our advanced filters to find the perfect investors or promising startups that align with your goals.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>3. Connect and Grow</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Submit pitches, review proposals, and start meaningful conversations to drive your success.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Why Choose StartupMatch?</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Targeted Matching</h3>
                  <p className="mt-2 text-gray-600">Our algorithm ensures you connect with the most relevant partners for your specific needs and goals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Streamlined Communication</h3>
                  <p className="mt-2 text-gray-600">Efficiently manage pitches, proposals, and conversations all in one place.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Data-Driven Insights</h3>
                  <p className="mt-2 text-gray-600">Access valuable market trends and analytics to make informed decisions.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Secure and Confidential</h3>
                  <p className="mt-2 text-gray-600">Your data and communications are protected with state-of-the-art security measures.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-100 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Ready to Find Your Perfect Match?</h2>
            <p className="mb-8 text-xl text-gray-600">Join Venturelink today and take the first step towards your next big opportunity.</p>
            <Button asChild size="lg">
              <Link href="/auth/signup">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Venturelink All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
