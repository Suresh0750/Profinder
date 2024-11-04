'use client';

import { useRequestToWorkerMutation } from '@/lib/features/api/customerApiSlice';
import React, { useState ,useEffect} from 'react';
import { toast, Toaster } from 'sonner';

interface WorkerDetails {
    _id: string;
    Category: string;
    FirstName: string;
}

interface ServiceRequestModalProps {
    workerDetails: WorkerDetails;
    isOpen: boolean;
    onClose: () => void;
    refetch: () => void;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ workerDetails, isOpen, onClose, refetch }) => {
    const [formData, setFormData] = useState({
        workerId: workerDetails?._id,
        service: workerDetails?.Category,
        worker: workerDetails?.FirstName,
        user: '',
        preferredDate: '',
        preferredTime: '',
        servicelocation: '',
        additionalNotes: '',
    });
    const [customerData,setCustomerData] = useState<any>({_id:null})
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [requestToWorker, { isLoading }] = useRequestToWorkerMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.preferredDate) {
            errors.preferredDate = "Preferred date is required.";
        } else if (new Date(formData.preferredDate) < new Date()) {
            errors.preferredDate = "Preferred date cannot be in the past.";
        }

        if (!formData.preferredTime) {
            errors.preferredTime = "Preferred time is required.";
        }

        if (!formData.servicelocation) {
            errors.servicelocation = "Service location is required.";
        }

        if (!formData.additionalNotes) {
            errors.additionalNotes = "Additional notes are required.";
        }

        return errors;
    };

    useEffect(() => {
        // Only access localStorage in the browser
        if (typeof window !== "undefined") {
          const storedData = localStorage.getItem("customerData");
          if (storedData) {
            try {
              setCustomerData(JSON.parse(storedData));
            } catch (error) {
              console.error("Error parsing customerData from localStorage:", error);
              setCustomerData({_id:null});
            }
          }
        }
      }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isLoading) return;

        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setLoading(false);
            return;
        }

        

        try {
            const result = await requestToWorker({
                ...formData,
                user: customerData.customerName,
                userId: customerData._id,
                service: workerDetails?.Category,
                worker: workerDetails?.FirstName,
                workerId: workerDetails?._id,
            }).unwrap();

            if (result?.success) {
                toast.success(result?.message);
                refetch();
                onClose();
            }
            console.log('Form submitted successfully');
        } catch (err: any) {
            setError(err?.data?.message);
            toast.error(err?.data?.errorMessage);
            setTimeout(() => {
                onClose();
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Service Request</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        Service:
                        <input
                            type="text"
                            name="service"
                            value={workerDetails?.Category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                        {validationErrors.service && <p className="text-red-500">{validationErrors.service}</p>}
                    </label>
                    <label className="block mb-2">
                        Worker:
                        <input
                            type="text"
                            name="worker"
                            value={workerDetails?.FirstName}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                        {validationErrors.worker && <p className="text-red-500">{validationErrors.worker}</p>}
                    </label>
                    <label className="block mb-2">
                        Preferred Date:
                        <input
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full border rounded p-2"
                        />
                        {validationErrors.preferredDate && <p className="text-red-500">{validationErrors.preferredDate}</p>}
                    </label>
                    <label className="block mb-2">
                        Preferred Time:
                        <input
                            type="time"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                        {validationErrors.preferredTime && <p className="text-red-500">{validationErrors.preferredTime}</p>}
                    </label>
                    <label className="block mb-2">
                        Service Location:
                        <input
                            type="text"
                            name="servicelocation"
                            value={formData.servicelocation}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        />
                        {validationErrors.servicelocation && <p className="text-red-500">{validationErrors.servicelocation}</p>}
                    </label>
                    <label className="block mb-2">
                        Additional Notes:
                        <textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </label>
                    <button type="submit" disabled={loading} className={`mt-4 w-full p-2 text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} rounded`}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
                <Toaster richColors position='top-center' />
                <button onClick={onClose} className="mt-4 text-blue-500">Close</button>
            </div>
        </div>
    );
};

export default ServiceRequestModal;
