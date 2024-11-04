"use client"


import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Search, ArrowLeft,HardHat, Wrench } from 'lucide-react'

export default function ErrorPage({ statusCode = 404 }) {
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    switch (statusCode) {
      case 404:
        setErrorMessage("Oops! The page you're looking for is on a coffee break.")
        break
      case 500:
        setErrorMessage("Our servers are working overtime. Please try again later.")
        break
      default:
        setErrorMessage("Something went wrong. Our team is on it!")
    }
  }, [statusCode])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            {/* <Tool className="h-16 w-16 text-blue-500 animate-bounce" /> */}
            <HardHat className="h-16 w-16 text-yellow-500 animate-bounce delay-100" />
            <Wrench className="h-16 w-16 text-red-500 animate-bounce delay-200" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Error {statusCode}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/homePage" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <Link href="/search" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
            <Search className="mr-2 h-5 w-5" />
            Find a Worker
          </Link>
        </div>

        <div className="mt-8">
          <button onClick={() => window.history.back()} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back to previous page
          </button>
        </div>

        <div className="mt-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-100 text-sm text-gray-500">
                Need assistance?
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Our support team is always ready to lend a hand.{' '}
            <a href="/contact" className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}