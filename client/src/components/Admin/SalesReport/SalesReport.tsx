"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CalendarDays, FileSpreadsheet, FileText } from "lucide-react"
import { format, isAfter, isBefore, startOfDay } from "date-fns"
import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"
import { fetchSalesReport,fetchCategoryList,downloadSalesReport } from '@/lib/features/api/adminApiSlice' 
import { salesReport } from '@/types/adminTypes'

export default function SalesReport() {
  const [filteredBookings, setFilteredBookings] = useState<salesReport[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined)
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(10)
  const [categoryList, setCategoryList] = useState<string[]>(["All"])
  const [stopDownloadAPI, setDownloadAPI] = useState(true)
  const [salesReport, setSalesReport] = useState<salesReport[]>([])
  const [download, setDownload] = useState('')
  const [salesDownloadDatas,setSalseDownloadDatas] = useState([])


  //downloadSalesReport
  const handleSalesReport = async ()=>{
      try{
        const res = await downloadSalesReport({
          categoryFilter,
          startDateFilter: startDateFilter ? startDateFilter.toISOString().split('T')[0] : '',
          endDateFilter: endDateFilter ? endDateFilter.toISOString().split('T')[0] : '',
          currentPage,
          itemsPerPage
        })
        if(res?.success){
          setSalseDownloadDatas(res?.result)
        }
      }catch(error:any){
        console.log(error)
      }
  }



 

  
  // fetch category list
  useEffect(() => {
  const handleFetchCategoryList = async ()=>{
    try{
      const res = await fetchCategoryList()
      if(res?.success){
        setCategoryList(["All", ...res?.result])
      }

    }catch(error:any){
      console.log(error)
    }
  }
    handleFetchCategoryList()
    
  }, [])

  
 

  useEffect(() => {
     // fetch sales data
  const fetchSalesData = async ()=>{
    try{
      const res = await fetchSalesReport({
        categoryFilter,
        startDateFilter: startDateFilter ? startDateFilter.toISOString().split('T')[0] : '',
        endDateFilter: endDateFilter ? endDateFilter.toISOString().split('T')[0] : '',
        currentPage,
        itemsPerPage
      })
      if(res?.result?.salesDatas){
        setSalesReport(res?.result?.salesDatas)
      }
    }catch(error:any){
      console.log(error)
    }
  }
  fetchSalesData()
  }, [])

  

  useEffect(() => {
    if (salesDownloadDatas && download == 'PDF') {
      const doc = new jsPDF()
      doc.text("Sales Report", 20, 10)
      ;(doc as any).autoTable({
        head: [["#", "User Name", "Date", "Worker", "Amount", "Status"]],
        body: (salesDownloadDatas)?.map((booking: any, index: number) => [
          index + 1,
          booking?.user,
          booking?.preferredDate,
          booking.worker,
          `$${booking?.payment}`,
          booking?.isAccept,
        ]),
      })
      doc.save("booking_report.pdf")
      setDownload('')
    }
  }, [salesDownloadDatas,download])

  useEffect(() => {
    
    if (salesDownloadDatas && download == 'XLSX') {
      const worksheet = XLSX.utils.json_to_sheet(
        (salesDownloadDatas)?.map((booking: any, index: number) => ({
          "#": index + 1,
          Username: booking?.user,
          Date: booking?.preferredDate,
          "Booked Worker": booking.worker,
          Amount: `$${booking?.payment}`,
          Status: booking?.isAccept,
        }))
      )
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings")
      XLSX.writeFile(workbook, "booking_report.xlsx")
      setDownload('')
    }
  }, [download,salesDownloadDatas])

  const applyFilters = () => {
    // fetchSalesData()
  }

  const resetFilters = () => {
    setCategoryFilter("All")
    setStartDateFilter(undefined)
    setEndDateFilter(undefined)
    setFilteredBookings([])
    setCurrentPage(1)
  }

  const downloadPDF = () => {
    console.log("Downloading PDF...")
    setDownloadAPI(false)
    setDownload('PDF')
  }

  const downloadExcel = () => {
    console.log("Downloading Excel...")
    setDownloadAPI(false)
    setDownload('XLSX')
  }

  const today = startOfDay(new Date())

  const isStartDateDisabled = (date: Date) => isAfter(date, today)
  const isEndDateDisabled = (date: Date): boolean => {
    if (isAfter(date, today)) {
      return true
    }
    if (startDateFilter && isBefore(date, startDateFilter)) {
      return true
    }
    return false
  }

  const totalItems = salesReport.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = salesReport.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {startDateFilter ? format(startDateFilter, "PPP") : "Pick a start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDateFilter}
                    onSelect={(date) => {
                      setStartDateFilter(date)
                      if (endDateFilter && date && isAfter(date, endDateFilter)) {
                        setEndDateFilter(undefined)
                      }
                    }}
                    disabled={isStartDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {endDateFilter ? format(endDateFilter, "PPP") : "Pick an end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDateFilter}
                    onSelect={setEndDateFilter}
                    disabled={isEndDateDisabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking Information</CardTitle>
          <div className="space-x-2">
            <Button onClick={downloadPDF} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={downloadExcel} variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Worker Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.user}</TableCell>
                  <TableCell>{booking.preferredDate}</TableCell>
                  <TableCell>{booking.worker}</TableCell>
                  <TableCell>${booking.payment}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.isAccept === 'Completed' ? 'bg-green-100 text-green-800' :
                      booking.isAccept === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.isAccept}
                    </span>
                  </TableCell>
                  <TableCell>{booking.service}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(number => Math.abs(currentPage - number) <= 2 || number === 1 || number === totalPages)
                .map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </Button>
                ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}