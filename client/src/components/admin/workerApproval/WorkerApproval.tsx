"use client";
import React, { useState, useEffect } from "react";
import {
  useGetAllUnApprovalWorkerlistQuery,
  useIsUserBlockMutation,
  useIsWorkerApprovalMutation,
} from "@/lib/features/api/adminApiSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import SearchBar from "@/components/admin/SearchBar";
import { Pagination } from "@mui/material";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image"

import Link from 'next/link'
// * types
import { WorkerDatails } from "@/types/workerTypes";



// * IdentityModal


function createData(
  No: number,
  Profile: File,
  Name: string,
  Phone: number,
  EmailId: string,
  isBlock: boolean,
  Identity : File,
  _id: string
) {
  return { No, Profile, Name, Phone, EmailId, isBlock,Identity, _id };
}

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [showWorkerList, setShowWorkerList] = useState<any[]>([]);
  const [allWorkerList, setAllWorkerList] = useState<any[]>([]);
  const [workerList, setWorkerList] = useState<WorkerDatails[]>([]);

  const { data, refetch } = useGetAllUnApprovalWorkerlistQuery("");
 
  const Router = useRouter();

  
  const searchHandle = (value:string)=>{
    console.log(value)
    if(value){

      let filterData =allWorkerList
      filterData = filterData?.filter((prev:any)=>((prev?.FirstName).toLowerCase())?.includes((value)?.toLowerCase()))
      console.log(filterData)
      setShowWorkerList(
        filterData?.map((worker: any, i: number) =>
          createData(
            i + 1,
            worker.Profile,
            worker.FirstName,
            worker.PhoneNumber,
            worker.EmailAddress,
            worker.isBlock,
            worker.Identity,
            worker._id
          )
        ))
    }else{

      setShowWorkerList(
        allWorkerList?.map((worker: any, i: number) =>
          createData(
            i + 1,
            worker.Profile,
            worker.FirstName,
            worker.PhoneNumber,
            worker.EmailAddress,
            worker.isBlock,
            worker.Identity,
            worker._id
          )
        )
      );
    }
  }

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (data) {
      setAllWorkerList(data?.result);
      setShowWorkerList(
        data?.result.map((worker: any, i: number) =>
          createData(
            i + 1,
            worker.Profile, 
            worker.FirstName, 
            worker.PhoneNumber,
            worker.EmailAddress,
            worker.isBlock,
            worker.Identity,
            worker._id
          )
        )
      );
    }
  }, [data]);

  return (
    <>
      <div className="w-64 border-2 m-3 rounded border-white ml-3">
        <SearchBar search={searchHandle}/>
      </div>
      <TableContainer component={Paper} className="ml-3 w-[90%]">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg-black">
            <TableRow>
              <TableCell className="text-xl font-bold text-white">No</TableCell>
              <TableCell className="text-xl font-bold text-white" align="right">
                Image
              </TableCell>
              <TableCell className="text-xl font-bold text-white" align="right">
                Name
              </TableCell>
              <TableCell className="text-xl font-bold text-white" align="right">
                Phone
              </TableCell>
              <TableCell className="text-xl font-bold text-white" align="right">
                Email Id
              </TableCell>
              <TableCell className="text-xl font-bold text-white" align="right">
                View Details
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showWorkerList.length > 0 &&
              showWorkerList
                .slice((page - 1) * 5, page * 5) // Corrected slicing logic
                .map((worker: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {(page - 1) * 5 + index + 1}
                    </TableCell>
                    <TableCell align="center" className="w-11 h-10">
                      <Image
                        src={worker.Profile}
                        alt={worker.Name + " image"}
                        className="w-11 h-10 rounded"
                        width={250}
                        height = {250}
                      />
                    </TableCell>
                    <TableCell align="right">{worker.Name}</TableCell>
                    <TableCell align="right">{worker.Phone}</TableCell>
                    <TableCell align="right">{worker.EmailId}</TableCell>
                    <TableCell align="right">
                      <Link href={`/admin/worker-details/${worker?._id}`}>
                        <button
                          
                          className="p-2 bg-yellow-300 rounded cursor-pointer"
                        >
                          View Details
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(showWorkerList.length / 5)} // Total number of pages
          page={page} // Current page number
          onChange={handleChangePage} // Handle page change
          variant="outlined"
          color="primary"
        />
      </div>
      <Toaster richColors position="top-center" />
      {/* <IdentityModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        image={imageUrl}
        workerId={workerId}
        refetch={refetch}
      /> */}
    </>
  );
};

export default UserTable;
