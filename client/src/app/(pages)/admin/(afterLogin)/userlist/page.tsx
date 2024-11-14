

import * as React from 'react';

import UserListTable from '@/components/m/userSide/UserListTable';


export default function BasicTable() {
 
  const rowsPerPage = 5; // Number of rows per page

 
  return (
    <div className='w-full p-4'>
      <h2 className='text-2xl font-bold text-white opacity-60 ml-3'>User Management</h2>
      <UserListTable />
    </div>
  );
}
