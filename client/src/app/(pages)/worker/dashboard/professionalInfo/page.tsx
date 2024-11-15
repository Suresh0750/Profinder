
import DashboardProfessionalInfo from '@/components/Worker/Dashboard/PprofessionalInfo';

const ProfessionalInfo = () => {
   
    return (
        <div className="w-[80%] max-w-2xl bg-slate-500 m-7 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Professional Information</h2>
             <DashboardProfessionalInfo />
        </div>
    );
};

export default ProfessionalInfo;
