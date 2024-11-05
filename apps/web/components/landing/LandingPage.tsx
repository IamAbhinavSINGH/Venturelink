import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Users, TrendingUp, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
        {/* <Image
            src={heroBackgroundImage}
            alt="Abstract network background"
            fill
            style={{ objectFit: "cover", filter: "blur(2px)" }} 
            quality={100}
        /> */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-indigo-900/70"></div>
        </div>
        <div className="relative z-10 space-y-8 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
            Connect Startups with Investors
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
            Revolutionize your startup journey or investment strategy with our cutting-edge matching platform.
          </p>
          <Button asChild size="lg" className="text-md rounded-lg px-8 py-6 bg-white text-gray-950 hover:bg-blue-50 hover:ring-2 ring-blue-200 transition-all duration-300">
            <Link href="/auth">
              Get Started <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <FeatureCard
              icon={<Rocket className="w-12 h-12 text-blue-600" />}
              title="Accelerate Growth"
              description="Connect with the right investors to fuel your startup's growth and reach new heights."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-blue-600" />}
              title="Smart Matching"
              description="Our AI-powered algorithm ensures you connect with the most relevant partners for your specific needs."
            />
            <FeatureCard
              icon={<TrendingUp className="w-12 h-12 text-blue-600" />}
              title="Data-Driven Insights"
              description="Access valuable market trends and analytics to make informed decisions and stay ahead of the curve."
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-blue-600" />}
              title="Secure & Confidential"
              description="Your data and communications are protected with state-of-the-art security measures."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10  ">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and build a comprehensive profile showcasing your startup or investment preferences."
            />
            <StepCard
              number="2"
              title="Explore Matches"
              description="Use our advanced filters to find the perfect investors or promising startups that align with your goals."
            />
            <StepCard
              number="3"
              title="Connect and Grow"
              description="Submit pitches, review proposals, and start meaningful conversations to drive your success."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="max-w-4xl mx-auto  text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8 text-gray-900">What Our Users Say</h2>
          <blockquote className="text-2xl italic mb-4 text-gray-700">
            "This platform has been a game-changer for our startup. We found the perfect investor who not only provided funding but also valuable industry insights."
          </blockquote>
          <p className="text-xl font-semibold text-gray-900">- Sarah Johnson, CEO of TechInnovate</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
       
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Ready to Transform Your Journey?</h2>
          <p className="text-xl mb-8 text-gray-700">Join our platform today and take the first step towards unprecedented growth and success.</p>
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-gray-900 hover:bg-blue-50 hover:ring-2 ring-blue-200 transition-all duration-300">
            <Link href="/auth">
              Get Started Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className='font-bold text-gray-100 text-lg'>Venturelink</p>
            <p className="mt-2">&copy; 2024 Venturelink. All rights reserved.</p>
          </div>
          <nav className="flex gap-6 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4 text-blue-600">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl font-bold text-blue-600 mb-4">{number}</div>
      <h3 className="text-2xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}