"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useGetUserListQuery ,useIsUserBlockMutation} from "@/lib/features/api/adminApiSlice";
import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import SearchBar from '@/components/Admin/SearchBar';
import { Pagination } from "@mui/material";
import {toast,Toaster} from 'sonner'
import {useRouter} from 'next/navigation'


function createData(
  No: number,
  Name: string,
  Phone: number,
  EmailId: string,
  isBlock : boolean,
  _id:string
) {
  return { No, Name, Phone,EmailId,isBlock,_id };
}


const UserTable = () => {


  const [page,setPage] = useState(1)
  const [showUserList, setShowUserList] = useState<any[]>([]);
  const [allUserList, setAllUserList] = useState<any[]>([]);
  const { data,refetch} = useGetUserListQuery("");
  const [isUserBlock] = useIsUserBlockMutation()
  const Router = useRouter()


  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  };

  const searchHandle = (value:string)=>{

    if(value){

      let filterData =allUserList
      filterData = filterData?.filter((prev:any)=>((prev?.username).toLowerCase())?.includes((value)?.toLowerCase()))
      setShowUserList(
        filterData?.map((user: any, i: number) =>
          createData(
            i + 1,
            user?.username, 
            user?.PhoneNumber,
            user?.EmailAddress,
            user?.isBlock,
            user?._id
          )
        ))
    }else{

      setShowUserList(
        allUserList?.map((user: any, i: number) =>
          createData(
            i + 1,
            user?.username, 
            user?.PhoneNumber,
            user?.EmailAddress,
            user?.isBlock,
            user?._id
          )
        ))
    }
  }


  const handleUserBlock =async (isBlock:boolean,_id:string)=>{
    try{
      const result = await isUserBlock({isBlock,_id}).unwrap()
       if(result?.success){
        toast.success(result?.message)
        refetch()
       }
    }catch(error:any){
        console.log(`Error from handleUserBlock`,error)
        toast.success(error?.errorMessage)
    }
  }


  useEffect(() => {
    if (data) {
      setAllUserList(data?.result);
      setShowUserList(
        (data?.result).map((user: any, i: number) =>
           
          createData(
            i + 1,
            user.username, 
            user.PhoneNumber,
            user.EmailAddress,
            user.isBlock,
            user._id
          )
         
        )
      );
    }
  }, [data]);


  return (


    <>


    <div className='w-64 border-2 m-3 rounded border-white ml-3'>
        <SearchBar search={searchHandle} />
    </div>
    <TableContainer component={Paper} className='ml-3 w-[90%]'>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className='bg-black'>
            <TableRow>
            <TableCell className='text-xl font-bold text-white'>No</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Name</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Phone</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Email Id</TableCell>
            <TableCell className='text-xl font-bold text-white' align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
        {/* Passing currentPage and rowsPerPage as props to the TBody component */}
        <TableBody>
        {showUserList.length > 0 &&
        showUserList.slice((page-1), 5).map((worker: any, index: number) => (
            <TableRow key={index}>
            <TableCell component="th" scope="row">
                {((page-1)*5)+index+1}
            </TableCell>
            <TableCell align="right">{worker.Name}</TableCell>
            <TableCell align="right">{worker.Phone}</TableCell>
            <TableCell align="right">{worker.EmailId}</TableCell>
            <TableCell align="right">
                <button onClick={()=>handleUserBlock(worker?.isBlock,worker?._id)} className={`p-2 rounded cursor-pointer ${worker?.isBlock ? 'bg-green-600':'bg-red-600'}`}>
                    {
                        worker?.isBlock ? 'unblock' : 'block'
                    }
                </button>
            </TableCell>
            </TableRow>
        ))}
    </TableBody>
        </Table>
    </TableContainer>
    <div className='flex justify-center mt-4'>
    <Pagination
          count={Math.ceil(showUserList.length / 5)} // Total number of pages
          page={page} // Current page number
          onChange={handleChangePage} // Handle page change
          variant="outlined"
          color="primary"
        />
    </div>
    <Toaster richColors position="top-center" />
    </>
  );
};


export default UserTable;



