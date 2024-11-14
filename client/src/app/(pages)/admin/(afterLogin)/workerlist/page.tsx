

import * as React from 'react';

import WorkerListTable from '@/components/Admin/workerside/Table';


export default function BasicTable() {
 
  const rowsPerPage = 5; // Number of rows per page

 
  return (
    <div className='w-full p-4'>
      <h2 className='text-2xl font-bold text-white opacity-60 ml-3'>Worker List</h2>
      <WorkerListTable />
    </div>
  );
}
