"use client"
import { useState, useEffect } from 'react';
import './Identity.module.css'
import { useIsWorkerApprovalMutation } from '@/lib/features/api/adminApiSlice';
import {toast, Toaster} from 'sonner'
import {useRouter} from 'next/navigation'
import Image from "next/image"

const IdentityModal = ({ isOpen, onClose, image, workerId}: { isOpen: boolean, onClose: any, image: string, workerId: string}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isWorkerApproval] =  useIsWorkerApprovalMutation();
    const Router = useRouter()
  

    useEffect(() => {
        setImageUrl(image);
    }, [image]);

    const handleApiCall = async (id:string) => {
        try {
            const result =await isWorkerApproval(id).unwrap()
            console.log(result)
            if(result?.success){
                toast.success(result.message)
                onClose() 
                setTimeout(()=>{
                    Router.push(`/admin/workerApproval`)
                })
                // refetch()
            }
        } catch (error:any) {
            console.error('Error fetching data:', error);
            toast.error(error.message)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay absolute top-0 left-0 flex justify-center items-center w-full h-screen">
            <div className="modal-content w-[25em] h-[25em]">
                <span className="close" onClick={onClose}>&times;</span>
                {imageUrl && <Image src={imageUrl} alt="Dynamic" className="w-full h-auto rounded-md"  width={500} height={500}/>}
                <div className="mt-4">
                    <button onClick={() => handleApiCall(workerId)} className="px-4 py-2 bg-blue-500 text-white rounded-md">Verify</button>
                    <button onClick={onClose} className="ml-4 px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
                </div>
            </div>
            <Toaster richColors position="top-center" />
        </div>
    );
};

export default IdentityModal;
