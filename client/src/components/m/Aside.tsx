"use client"

import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ReportIcon from '@mui/icons-material/Report';
import CategoryIcon from '@mui/icons-material/Category';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ApprovalIcon from '../../../public/images/Admin/Dashboard/icons/Approval worker.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Tooltip from '@mui/material/Tooltip';

export default function Aside(){

    const navigation = useRouter();

    // * Navigation functions
    const handleNavigation =(url:string)=>{
        navigation.push(url)
    }
    return (
        <aside className="w-[75px] h-[91vh] sticky bg-gray-900 shadow-lg">
            <section className="text-white pt-[3em] w-full">
                <ul className="flex flex-col justify-evenly items-center gap-6 text-white">
                    {/* Dashboard Icon */}
                    <li onClick={()=>handleNavigation('/admin/dashboard')} className="hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
                        <Tooltip title="Dashboard" placement="right">
                            <DashboardIcon sx={{ width: '38px', height: '38px' }} />
                        </Tooltip>
                    </li>
                    {/* Approval Icon */}
                    <li onClick={()=>handleNavigation('/admin/workerApproval')} className="hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
                        <Tooltip title="Approval" placement="right">
                            <Image src={ApprovalIcon} alt="Approval Icon" width={38} height={38} />
                        </Tooltip>
                    </li>
                    {/* People Icon */}
                    <li onClick={()=>handleNavigation('/admin/userlist')} className="hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
                        <Tooltip title="user list" placement="right">
                            <PeopleOutlineIcon sx={{ width: '48px', height: '48px' }} />
                        </Tooltip>
                    </li>
                    {/* Worker List Icon */}
                    <li onClick={()=>handleNavigation('/admin/workerlist')} className="hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
                        <Tooltip title="Worker List" placement="right">
                            <EngineeringIcon sx={{ width: '48px', height: '48px' }} />
                        </Tooltip>
                    </li>
                    {/* Report Icon */}
                    <li onClick={()=>handleNavigation('/admin/sales-report')} className="hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
                        <Tooltip title="Reports" placement="right">
                            <ReportIcon sx={{ width: '48px', height: '48px' }} />
                        </Tooltip>
                    </li>
                    {/* Category Icon */}
                    <li onClick={()=>handleNavigation('/admin/category')} className="hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
                        <Tooltip title="Category" placement="right">
                            <CategoryIcon sx={{ width: '48px', height: '48px' }} />
                        </Tooltip>
                    </li>
                    {/* Admin Panel Icon */}
                    {/* <li className="hover:text-blue-400 transition-all duration-300 ease-in-out cursor-pointer">
                        <Tooltip title="Admin Panel" placement="right">
                            <AdminPanelSettingsIcon sx={{ width: '48px', height: '48px' }} />
                        </Tooltip>
                    </li> */}
                </ul>
            </section>
        </aside>
    );
}
