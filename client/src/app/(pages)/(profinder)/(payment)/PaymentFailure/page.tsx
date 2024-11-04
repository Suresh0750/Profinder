"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertCircle, ArrowRight, RefreshCw, HelpCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PaymentFailurePage() {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = () => {
    setIsRetrying(true)
    // Simulate a retry delay
    setTimeout(() => {
      setIsRetrying(false)
      // Here you would typically redirect to the payment page or retry the payment process
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl overflow-hidden">
          <CardHeader className="bg-red-500 text-white text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-20 h-20 bg-white rounded-full flex items-center justify-center"
            >
              <AlertCircle className="h-12 w-12 text-red-500" />
            </motion.div>
            <CardTitle className="text-3xl font-bold mb-2">Payment Failed</CardTitle>
            <p className="text-red-100">We were unable to process your payment</p>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-red-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-xl text-red-800 mb-2">What happened?</h3>
                <p className="text-red-600">
                  Your payment was not successful. This could be due to insufficient funds, 
                  an expired card, or other issues with your payment method.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="troubleshooting">
                  <AccordionTrigger>Troubleshooting Steps</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Check that your card details are correct</li>
                      <li>Ensure you have sufficient funds in your account</li>
                      <li>Try using a different payment method</li>
                      <li>Check with your bank if there are any restrictions on your card</li>
                      <li>Clear your browser cache and cookies, then try again</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-4 px-6 py-6 bg-gray-50">
            <Button onClick={handleRetry} disabled={isRetrying} className="flex items-center">
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Payment
                </>
              )}
            </Button>
            <Button asChild variant="outline">
              <Link href="/support" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
            <Button asChild variant="link" className="w-full mt-2">
              <Link href="/homePage" className="flex items-center justify-center">
                Return to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}