// app/page.tsx
"use client";

// import { redirect } from 'next/navigation';

// export default function RootPage() {
//   redirect('/login');
// }

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-white">
        <h1 className="text-5xl font-extrabold mb-4">Proptic</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Effortlessly manage your properties, tenants, and payments from one intuitive platform.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/login">
            <Button className="text-lg px-8 py-6 cursor-pointer">Property Manager Login</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="text-lg px-8 py-6 cursor-pointer">
              Tenant Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">Pricing</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Basic */}
          <div className="border rounded-lg p-6 bg-white shadow">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-2xl font-semibold mb-2">Free</p>
              <p className="text-sm text-gray-600">
                For small landlords managing up to 5 properties
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Up to 5 properties</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Basic tenant management</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Rent collection tracking</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Maintenance request portal</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Basic reporting</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Email support</span>
              </div>
            </div>

            <Button variant="outline" className="w-full cursor-pointer">
              Get Started
            </Button>
          </div>

          {/* Pro */}
          <div className="border-2 border-blue-600 rounded-lg p-6 bg-white shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-2xl font-semibold mb-2">$29/mo</p>
              <p className="text-sm text-gray-600">For property managers with up to 50 units</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm font-medium text-gray-800">
                <span className="mr-3">Everything in Basic, plus:</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Up to 50 properties</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Online rent collection</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Automated late fee calculation</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Lease document management</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Financial reporting & analytics</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Tenant screening integration</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Priority support</span>
              </div>
            </div>

            <Button className="w-full cursor-pointer">Start Free Trial</Button>
          </div>

          {/* Enterprise */}
          <div className="border rounded-lg p-6 bg-white shadow">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-2xl font-semibold mb-2">Custom</p>
              <p className="text-sm text-gray-600">For large agencies with complex needs</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm font-medium text-gray-800">
                <span className="mr-3">Everything in Pro, plus:</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Unlimited properties</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Multi-location management</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Custom branding & white-label</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>API access & integrations</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Advanced role-based permissions</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>Dedicated account manager</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500 mr-3">✓</span>
                <span>24/7 phone support</span>
              </div>
            </div>

            <Button variant="outline" className="w-full cursor-pointer">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-8">
        &copy; {new Date().getFullYear()} Proptic. All rights reserved.
      </footer>
    </div>
  );
}
