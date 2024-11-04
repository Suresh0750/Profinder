"use client";

import { useState } from "react";
import { useSelector } from 'react-redux';
import { Modal, Box, Button, Typography } from '@mui/material';
import Image from "next/image"


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const ViewIdentity = ({ open, handleClose, Identity }: { open: boolean; handleClose: () => void; Identity: string; }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className="rounded"
        >
            <Box sx={style}>
                <Typography id="simple-modal-title" className="text-center" variant="h6" component="h2">
                    Identity
                </Typography>
                <Image src={Identity} alt='Worker Identity' style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

const DashboardPersonalInfo = () => {
    const workerData = useSelector((state: any) => state?.WorkerSignupData?.getWorkerData);
    console.log(workerData);
    
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    return (
        <div className="text-white w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Work</h2>
                <h2 className="text-lg">{workerData.Category || 'N/A'}</h2>
            </div>
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Country</h2>
                <h2 className="text-lg">{workerData.Country || 'N/A'}</h2>
            </div>
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">State / Province</h2>
                <h2 className="text-lg">{workerData.State || 'N/A'}</h2>
            </div>
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">ZIP / Postal Code</h2>
                <h2 className="text-lg">{workerData.PostalCode || 'N/A'}</h2>
            </div>
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">City</h2>
                <h2 className="text-lg">{workerData.City || 'N/A'}</h2>
            </div>
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Street Address</h2>
                <h2 className="text-lg">{workerData.StreetAddress || 'N/A'}</h2>
            </div>
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Apt Suite</h2>
                <h2 className="text-lg">{workerData.Apt || 'N/A'}</h2>
            </div>
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                <h2 className="text-lg font-semibold">Identity</h2>
                {/* Button to view identity */}
                <button 
                    onClick={handleOpen} 
                    className='p-2 bg-yellow-400 rounded text-xl'
                >
                    View Identity
                </button>
            </div>

            {/* Modal for viewing identity */}
            <ViewIdentity open={open} handleClose={handleClose} Identity={workerData.Identity || ""} />
        </div>
    );
}

export default DashboardPersonalInfo;