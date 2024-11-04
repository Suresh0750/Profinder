"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useGetWorkerListQuery } from "@/lib/features/api/adminApiSlice";
import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import SearchBar from '@/components/admin/SearchBar';
import { Pagination } from "@mui/material";
import Image from "next/image"


function createData(
  No: number,
  RegisterImage: string, // Change to string URL if you want to use img src directly
  Name: string,
  Phone: number,
  categories: string,
  Actions: string
) {
  return { No, RegisterImage, Name, Phone, categories, Actions };
}

const WorkerTableBody = () => {

  const [page,setPage] = useState(1)
  const [showWorkerList, setShowWorkerList] = useState<any[]>([]);
  const [allWorkerList, setAllWorkerList] = useState<any[]>([]);
  const { data } = useGetWorkerListQuery("");


  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  };

  const searchHandle = (value:string)=>{
  
    if(value){

      let filterData =allWorkerList
      filterData = filterData?.filter((prev:any)=>((prev?.FirstName).toLowerCase())?.includes((value)?.toLowerCase()))
     
      setShowWorkerList(
        filterData?.map((worker: any, i: number) =>
         createData(
              i + 1,
              worker.Profile, // Assuming this is a URL for the image
              worker.FirstName,
              worker.PhoneNumber,
              worker.Category,
              "Action"
            )
        ))
    }else{

      setShowWorkerList(
        allWorkerList?.map((worker: any, i: number) =>
          createData(
              i + 1,
              worker.Profile, // Assuming this is a URL for the image
              worker.FirstName,
              worker.PhoneNumber,
              worker.Category,
              "Action"
            )
        ))
    }
  }

  useEffect(() => {
    if (data) {
      setAllWorkerList(data?.result);
      setShowWorkerList(
        (data?.result).map((worker: any, i: number) =>
            
          createData(
            i + 1,
            worker.Profile, // Assuming this is a URL for the image
            worker.FirstName,
            worker.PhoneNumber,
            worker.Category,
            "Action"
          )
          
        )
      );
    }
  }, [data]);

  return (

    <>

    <div className='w-64 border-2 m-3 rounded border-white ml-3'>
        <SearchBar search={searchHandle}/>
    </div>
    <TableContainer component={Paper} className='ml-3 w-[90%]'>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className='bg-black'>
            <TableRow>
            <TableCell className='text-xl font-bold text-white'>No</TableCell>
            <TableCell className='text-xl font-bold text-white w-5' align="right">Register Image</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Name</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Phone</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Categories</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
        {/* Passing currentPage and rowsPerPage as props to the TBody component */}
        <TableBody>
        {showWorkerList.length > 0 &&
        showWorkerList.slice((page-1), 5).map((worker: any, index: number) => (
            <TableRow key={index}>
            <TableCell component="th" scope="row">
                {((page-1)*5)+index+1}
            </TableCell>
            <TableCell align="center" className="w-11 h-10">
                <Image
                src={worker.RegisterImage}
                alt={worker.Name + " image"}
                className="w-11 h-10 rounded"
                width={250}
                height={250}
                />
            </TableCell>
            <TableCell align="right">{worker.Name}</TableCell>
            <TableCell align="right">{worker.Phone}</TableCell>
            <TableCell align="right">{worker.categories}</TableCell>
            <TableCell align="right">
                <button className="p-2 bg-green-600 rounded">Action</button>
            </TableCell>
            </TableRow>
        ))}
    </TableBody>
        </Table>
    </TableContainer>
    <div className='flex justify-center mt-4'>
    <Pagination
          count={Math.ceil(showWorkerList.length / 5)} // Total number of pages
          page={page} // Current page number
          onChange={handleChangePage} // Handle page change
          variant="outlined"
          color="primary"
        />
    </div>
    </>
  );
};

export default WorkerTableBody;
