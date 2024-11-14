"use client";

import { useState ,useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getWorkerData } from '@/lib/features/slices/workerSlice'
import { useForm, Controller } from 'react-hook-form';
import { Modal, Box, Button, Typography, TextField, MenuItem } from '@mui/material';
import Image from "next/image";
import {useAddtionalProffessionalInfoMutation} from '@/lib/features/api/workerApiSlice'
import {toast,Toaster} from 'sonner'
import {useRouter} from 'next/navigation'

// Types for TypeScript validation
interface WorkerData {
    Category?: string;
    Country?: string;
    State?: string;
    PostalCode?: string;
    City?: string;
    StreetAddress?: string;
    Apt?: string;
    Identity?: string;
    experience?: string;
    rate?: number;
    availability?: string;
}

interface DashboardProps {
    open: boolean;
    handleClose: () => void;
    Identity: string;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


export const ViewIdentity = ({ open, handleClose, Identity }: DashboardProps) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Box sx={style}>
                <Typography id="simple-modal-title" variant="h6" component="h2" align="center">
                    Identity
                </Typography>
                <Image src={Identity} alt='Worker Identity' width={350} height={400} style={{ marginTop: '10px' }} />
                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
}

const DashboardProfessionalInfo = () => {


    const dispatch = useDispatch();
    const workerData: WorkerData = useSelector((state: any) => state?.WorkerSignupData?.getWorkerData);
    const [addtionalProffessionalInfo,{isLoading}] = useAddtionalProffessionalInfoMutation()

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const { control, handleSubmit, formState: { errors } } = useForm<WorkerData>({
        defaultValues: {
            experience: workerData.experience || '',
            rate: workerData.rate || 0,
            availability: workerData.availability || '',
        }
    });

   

    const router = useRouter()

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const toggleEditMode = () => setEditMode(!editMode);

    const onSubmit = async (data: WorkerData) => {
   
        dispatch({ type: 'UPDATE_WORKER_DATA', payload: data });

        const customerData = JSON.parse(localStorage.getItem("customerData") || '{_id:null}')
        
        if(customerData?._id){
            alert(customerData?._id)
          
           const workDetails = {
            _id : customerData?._id,
            experience : data?.experience || '',
            availability : data?.availability || '',
            rate : Number(data?.rate) || 500
           }
  
           try{
               const res = await addtionalProffessionalInfo(workDetails).unwrap()
               if(res.success){
                   alert(res.message)
                   toast.success(res.message)
                   dispatch(getWorkerData({...workerData,experience:data?.experience,availability:data?.availability,rate : Number(data?.rate)}))
                //    setTimeout(()=>{
                //     router.push('/worker/dashboard/workerdashboard')
                //    },500)

               }
           }catch(error : any){
                error?.data?.errorMessage ? toast.warning(error?.data?.errorMessage) : toast.warning('somthing wrong try again')
           }
        }
        setEditMode(false);
    };

   

    return (
        <div className="text-white w-full space-y-4 p-4 rounded-md">
            {[
                { label: "Work", value: workerData.Category || 'N/A' },
                { label: "Country", value: workerData.Country || 'N/A' },
                { label: "State / Province", value: workerData.State || 'N/A' },
                { label: "ZIP / Postal Code", value: workerData.PostalCode || 'N/A' },
                { label: "City", value: workerData.City || 'N/A' },
                { label: "Street Address", value: workerData.StreetAddress || 'N/A' },
                { label: "Apt Suite", value: workerData.Apt || 'N/A' },
            ].map((field, index) => (
                <div key={index} className="flex justify-between items-center border-b border-slate-400 pb-2">
                    <Typography variant="body1" className="font-semibold">{field.label}</Typography>
                    <Typography variant="body1">{field.value}</Typography>
                </div>
            ))}
            <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                            <Typography variant="body1" className="font-semibold">Identity</Typography>
                            <Button variant="contained" color="secondary" onClick={handleOpen} className="text-sm">
                                View Identity
                            </Button>
            </div>
            {
                 workerData?.experience? 
                   ( <>
                    {
                         [
                            { label: "experience", value: workerData.experience || 'N/A' },
                            { label: "availability", value: workerData.availability || 'N/A' },
                            { label: "rate", value: workerData.rate || 'N/A' },
                        ].map((field, index) => (
                            <div key={index} className="flex justify-between items-center border-b border-slate-400 pb-2">
                                <Typography variant="body1" className="font-semibold">{field.label}</Typography>
                                <Typography variant="body1">{field.value}</Typography>
                            </div>
                        ))
                    }
                    </>)
                    :   
                   ( <>
                    
                    </>)
            }
            {
                !workerData?.experience && (
                    <form onSubmit={handleSubmit(onSubmit)}>
               
                        <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                            <Typography variant="body1" className="font-semibold">Experience</Typography>
                            <Controller
                                name="experience"
                                control={control}
                                rules={{ required: "Experience is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        variant="outlined"
                                        size="small"
                                        error={!!errors.experience}
                                        helperText={errors.experience ? errors.experience.message : ''}
                                        className="bg-white rounded"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                            <Typography variant="body1" className="font-semibold">Rate</Typography>
                            <Controller
                                name="rate"
                                control={control}
                                rules={{
                                    required: "Rate is required",
                                    min: { value: 500, message: "Rate must be at least 500" }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        error={!!errors.rate}
                                        helperText={errors.rate ? errors.rate.message : ''}
                                        className="bg-white rounded"
                                    />
                                )}
                            />
                        </div>      

                        <div className="flex justify-between items-center border-b border-slate-400 pb-2">
                            <Typography variant="body1" className="font-semibold">Availability</Typography>
                            <Controller
                                name="availability"
                                control={control}
                                rules={{ required: "Please select availability" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        variant="outlined"
                                        size="small"
                                        error={!!errors.availability}
                                        helperText={errors.availability ? errors.availability.message : ''}
                                        className="bg-white rounded"
                                    >
                                        {["Full-time", "Part-time", "On-call"].map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </div>

                       
                        <div className="flex justify-end space-x-2 mt-4">
                            {editMode ? (
                                <>
                                    <Button variant="outlined" color="primary" onClick={toggleEditMode}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary" >
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button variant="contained" color="primary" onClick={toggleEditMode}>
                                    Edit Info
                                </Button>
                            )}
                        </div>
                    </form>
                )
            }

           
          

            {/* Identity Modal */}
            <ViewIdentity open={open} handleClose={handleClose} Identity={workerData.Identity || ""} />
        </div>
    );
}

export default DashboardProfessionalInfo;
