
"use client"
import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"
import "./globals.css"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-extrabold text-indigo-600 animate-bounce">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-2 text-sm text-gray-600">
            Oops! The page you&lsquo;re looking for doesn&lsquo;t exist or has been moved.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/homePage" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <Link href="/search" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
            <Search className="mr-2 h-5 w-5" />
            Search our site
          </Link>
        </div>

        <div className="mt-8">
          <button onClick={() => window.history.back()} className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
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
            If you believe this is an error, please{""}
            <a href="/contact" className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
              contact our support team
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}