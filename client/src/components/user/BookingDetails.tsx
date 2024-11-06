"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import jsPDF from 'jspdf'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Clipboard,
  DollarSign,
  CheckCircle,
  XCircle,
  Receipt,
  MessageSquare,

} from "lucide-react";
{/**/}

import {
  useBookingQuery,
  usePaymentIdQuery,
} from "@/lib/features/api/userApiSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayUComponent from "@/components/PayU"
import ReviewModal from '@/components/ReviewModal'



// * API cal

import {useConversationMutation} from '@/lib/features/api/userApiSlice'
import { useSubmitReviewMutation } from "@/lib/features/api/customerApiSlice";

interface Work {
  _id: string;
  service: string;
  worker: string;
  user: string;
  preferredDate: string;
  preferredTime: string;
  servicelocation: string;
  AdditionalNotes: string;
  userId: string;
  workerId: string;
  isAccept: string;
  payment: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function BookingPage() {
 
  
  const [customerData,setCustomerData] = useState<any>({})
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [skip, setSkip] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("Pending");
  const [skipPaymentAPI, setSkipPaymentAPI] = useState<boolean>(true);
  const [paymentId, setPaymentId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewID,setReviewID] = useState<string[]>([])

  // * API call
  const [submitReview] = useSubmitReviewMutation()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("customerData");
      if (storedData) {
        try {
          setCustomerData(JSON.parse(storedData));
        } catch (error) {
          console.error("Error parsing customerData from localStorage:", error);
          setCustomerData({});
        }
      }
    }
  }, []);
  const handleSubmitReview = async (reviewData: { rating: number, comment: string }) => {
    try {
      
      await submitReview({
        workerId: selectedWork?.workerId,
        userId: customerData?._id,
        ...reviewData,
        requestId : selectedWork?._id
      })
      setIsReviewModalOpen(false)
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const router = useRouter()
  console.log('selectedWork',selectedWork)
  const {
    data: requestData,
    isLoading,
    error,
    refetch,
  } = useBookingQuery(customerData?._id, {
    skip: skip,
  });
  const { data: paymentIdData } = usePaymentIdQuery(selectedWork?._id || '', {
    skip: skipPaymentAPI,
  });

  const [conversation] = useConversationMutation()

  const data = {
    userId:customerData?._id,
    workerId :selectedWork?.workerId,
    lastMessage:''
  }
  const handleConversation =async ()=>{

    const result =await conversation(data).unwrap()
    if(result?.success){
      router.push('/user/message')
    }
  }

  const handleFilter = (status: string) => {
    setFilter(status);
  };

  const handleWorkSelect = (work: Work | null) => {
    setSelectedWork(work);
  };
  useEffect(() => {
    if (selectedWork?._id) {
      setSkipPaymentAPI(false);
    }
  }, [selectedWork]);
  
  useEffect(() => {
    if (paymentIdData?.result) {
      setPaymentId(paymentIdData?.result?.paymentId);
    } else {
      setPaymentId("");
    }
    setSkipPaymentAPI(false);
  }, [paymentIdData]);

  useEffect(() => {
    setSkip(false);
  }, []);

  useEffect(() => {
    if (requestData?.result && requestData.result.length > 0) {
      console.log('select work')
      console.log(JSON.stringify(requestData.result))
      // setSelectedWork(requestData.result);
      setReviewID(requestData?.reviewDetails)
    }
  }, [requestData]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "accepted":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredWorks =
    requestData?.result?.filter(
      (work: Work) => work.isAccept.toLowerCase() === filter.toLowerCase()
    ) || [];



   
const downloadInvoice = async () => {
  setIsGenerating(true)
  try {
    const doc :any = new jsPDF()
    // Header
    doc.setFontSize(24)
    doc.setTextColor(33, 150, 243)
    doc.text("ProFinder", 70, 25)
    doc.setFontSize(16)
    doc.setTextColor(44, 62, 80)
    doc.text("Invoice", 70, 35)

    // Invoice details
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Invoice Date: ${format(new Date(), 'dd/MM/yyyy')}`, 130, 20)
    doc.text(`Invoice #: INV-${Math.floor(Math.random() * 1000000)}`, 130, 28)

    // Separator line
    doc.setDrawColor(200, 200, 200)
    doc.line(10, 45, 200, 45)

    // Worker Details
    doc.setFontSize(14)
    doc.setTextColor(34, 153, 84)
    doc.text("Worker Details", 10, 60)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    if(selectedWork){
      doc.text(`Name: ${selectedWork.worker}`, 15, 70)
      doc.text(`Date: ${selectedWork.preferredDate}`, 15, 77)
      doc.text(`Service: ${selectedWork.service}`, 15, 84)
      doc.text(`Time: ${selectedWork.preferredTime}`, 15, 91)
      doc.text(`Location: ${selectedWork.servicelocation}`, 15, 98)
      
    
    // Work Description
    doc.setFontSize(14)
    doc.setTextColor(34, 153, 84)
    doc.text("Work Description", 10, 115)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const splitNotes = doc.splitTextToSize(selectedWork.AdditionalNotes, 180)
    doc.text(splitNotes, 15, 125)

    // Transaction Details
    doc.setFontSize(14)
    doc.setTextColor(34, 153, 84)
    doc.text("Transaction Details", 10, 155)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text(`Transaction ID: ${paymentId}`, 15, 165)
    doc.text(`Total Amount: INR ${selectedWork.payment.toFixed(2)}`, 15, 172)
    doc.text(`Payment Status: ${selectedWork.isAccept}`, 15, 179)

    // Total Amount (highlighted)
    doc.setFillColor(240, 240, 240)
    doc.rect(130, 160, 70, 20, 'F')
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text("Total Amount:", 135, 170)
    doc.setFontSize(14)
    doc.setTextColor(34, 153, 84)
    doc.text(`INR ${selectedWork?.payment.toFixed(2)}`, 135, 177)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text("For any queries, contact us at: support@profinder.com", 10, 280)
    doc.text("Thank you for choosing ProFinder!", 10, 285)
    if(doc.internal)
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, 195, 285, { align: 'right' })

    // Save the PDF
    doc.save(`ProFinder_Invoice_${selectedWork.worker}_${format(new Date(), 'yyyyMMdd')}.pdf`)
  }
  } catch (error) {
    console.error("Error generating invoice:", error)
  } finally {
    setIsGenerating(false)
  }
}
  

  return (
    <>
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Work List</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Pending">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="Pending"
                onClick={() => handleFilter("Pending")}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="Cancelled"
                onClick={() => handleFilter("Cancelled")}
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger
                value="Accepted"
                onClick={() => handleFilter("Accepted")}
              >
                Accepted
              </TabsTrigger>
              <TabsTrigger
                value="Completed"
                onClick={() => handleFilter("Completed")}
              >
                Completed
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[60vh] mt-2">
              <TabsContent value={filter}>
                {filteredWorks.map((work: Work) => (
                  <Card
                    key={work._id}
                    className={`mb-2 cursor-pointer transition-all ${
                      selectedWork?._id === work._id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleWorkSelect(work)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{work.worker}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {format(parseISO(work.preferredDate), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-2" />
                          {work.preferredTime}
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
          <CardDescription>Information about the selected work</CardDescription>
        </CardHeader>
        <Card className="w-full max-w-2xl mx-auto">
          {selectedWork && selectedWork?.service && (
            <>  
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">
                    {selectedWork?.service} Booking
                  </CardTitle>
                  <Badge
                    className={`${getStatusColor(
                      selectedWork?.isAccept || "pending"
                    )} text-white`}
                  >
                    {selectedWork?.isAccept}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Worker Name: </span> &nbsp;
                  {selectedWork?.worker}
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Date:</span>&nbsp;
                  {selectedWork?.preferredDate}
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Time:</span>&nbsp;
                  {selectedWork?.preferredTime}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Location:</span>&nbsp;
                  {selectedWork?.servicelocation}
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex gap-1">
                  <Clipboard className="w-5 h-5 text-gray-500 mt-1" />
                    <span className="font-semibold mt-1">Additional Notes:</span>&nbsp;
                    <p className="mt-1 text-gray-600">
                      {selectedWork?.AdditionalNotes}
                    </p>
                  </div>
                    <div>
                      {
                        (selectedWork?.isAccept =="Completed" && !reviewID?.includes(selectedWork?._id)) ?  <Button variant="outline" className="mb-6" onClick={() => setIsReviewModalOpen(true)}>
                                                                    Write a Review
                                                                  </Button> : reviewID?.includes(selectedWork?._id) && 'Review succeffully updated'
                      }
                      
                    </div>
                </div>
                <div className="flex items-center justify-between space-x-2">
                <div className="flex gap-1 items-center">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold">Payment :</span>&nbsp;
                  <Badge variant={"default"}>
                    <h2>{selectedWork?.payment}</h2>
                  </Badge>
                </div>
                {
                  paymentId  && <div className="flex cursor-pointer" onClick={handleConversation}><MessageSquare/> Message</div> 
                }
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex gap-1">
                    {
                      paymentId ? <CheckCircle size={25} className="text-green-500" aria-hidden="true" /> : <XCircle size={25} className="text-red-500" aria-hidden="true"/>
                    }
                  
                    <span className="font-semibold">Payment Status:</span>
                    <Badge variant={paymentId ? "default" : "destructive"}>
                      {paymentId ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                  {(selectedWork?.isAccept=="Pending") ?
                    ""
                   :  (!paymentId && customerData && selectedWork?._id)? 
                    <>
                      <PayUComponent
                        currUserData={customerData}
                        requestId={selectedWork?._id}
                        payment={String(selectedWork?.payment) || "500"}
                      />
                    </> : <button onClick={downloadInvoice} disabled={isGenerating}  className="flex p-2 bg-yellow-400 rounded text-white"><Receipt /> {isGenerating ? "Generating Invoice..." : "Download Invoice"}</button>
                  }
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </Card>
      <Toaster richColors position="top-center" />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
// isAccept