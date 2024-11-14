import ProfessionalInfoForm from '@/components/Worker/PI(professionalInfo)'
import { useParams } from 'next/navigation'
import {FormValues} from '@/types/workerTypes'

export default function ProfessionalInfo(){

  
    return(
        <>
            <ProfessionalInfoForm />
        </>
    )
}
