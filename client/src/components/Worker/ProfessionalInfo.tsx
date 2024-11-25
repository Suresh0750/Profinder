'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { Toaster, toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PulseLoader } from 'react-spinners'
import { useSelector } from 'react-redux'
import { useEffect, useState, useMemo } from 'react'
import { professionalInfo } from '@/lib/features/api/workerApiSlice'
import {fetchCategoryName} from '@/lib/features/api/customerApiSlice'
import Select, { SingleValue } from 'react-select'
import countryList from 'react-select-country-list'
import { City, State, Country } from 'country-state-city'
import GoogleMapComponent from './GoogleMapComponent'
import { professionalInfoFormSchema } from "@/lib/formSchema"

// import { professionalInfoFormSchema } from '@/lib/formSchema'


type SelectOption = {
  value: string
  label: string
}

type FormValues = z.infer<typeof professionalInfoFormSchema>

export default function ProfessionalInfoForm() {
  const [workerSignupDetails, setWorkerSignupDetails] = useState<Record<string, any>>({})
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([])
  const [countryOptions, setCountryOptions] = useState<SelectOption[]>([])
  const [stateOptions, setStateOptions] = useState<SelectOption[]>([])
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([])
  const [address, setAddress] = useState('')
  const [coords, setCoords] = useState({ latitude: 0, longitude: 0 })
  const [getCoords, setGetCoords] = useState({ lat: 0, lon: 0 })
  const [getAddress, setGetAddress] = useState({})
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading,setIsLoading] = useState<boolean>(false)

  const workersignupData = useSelector((state: any) => state.WorkerSignupData)



  // handle fetch category data
  useEffect(() => {
    const fetchCategory = async ()=>{
      try{
        const res = await fetchCategoryName()
        if(res?.success){
          setCategoryOptions(res?.result?.map((category: string) => ({ value: category, label: category })))
        }
      }catch(error:any){
        console.log(error)
      }
    }
    fetchCategory()
  }, [])

  const router = useRouter()

  const countries = useMemo(() => countryList().getData(), [])

  useEffect(() => {
    const userLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        const { latitude, longitude } = position.coords
        setCoords({ latitude, longitude })
      } catch (error) {
        console.error('Error getting user location:', error)
        setCoords({ latitude: 0, longitude: 0 })
      }
    }
    userLocation()
  }, [])

  useEffect(() => {
    setCountryOptions(countries)
    setWorkerSignupDetails(workersignupData)
  }, [countries, workersignupData])



  const form = useForm<FormValues>({
    resolver: zodResolver(professionalInfoFormSchema),
    defaultValues: {
      category: "",
      country: null,
      streetAddress: "",
      city: null,
      identity: undefined,
      apt: "",
      state: null,
      postalCode: "",
    },
  })
  type SelectOption = {
    value: string
    label: string
  }
  
  type FormValues = z.infer<typeof professionalInfoFormSchema>

  const onCategoryChange = (selectedOption: SingleValue<SelectOption>) => {
    if (selectedOption) {
      form.setValue('category', selectedOption.value)
    } else {
      form.setValue('category', "")
    }
  }


  const onCountryChange = (selectedOption: SingleValue<SelectOption>) => {
    form.setValue('country', selectedOption)
    form.setValue('state', null)
    form.setValue('city', null)
    form.setValue('streetAddress', '')
    form.setValue('postalCode', '')
    
    if (selectedOption) {
      const states = State.getStatesOfCountry(selectedOption.value)
      setStateOptions(states.map(state => ({ value: state.isoCode, label: state.name })))
    } else {
      setStateOptions([])
    }
    setCityOptions([])
    updateAddress()
  }

  const onStateChange = (selectedOption: SingleValue<SelectOption>) => {
    form.setValue('state', selectedOption)
    form.setValue('city', null)
    form.setValue('streetAddress', '')
    form.setValue('postalCode', '')
    
    const countryValue = form.getValues('country')?.value
    if (countryValue && selectedOption) {
      const cities = City.getCitiesOfState(countryValue, selectedOption.value)
      setCityOptions(cities.map(city => ({ value: city.name, label: city.name })))
    } else {
      setCityOptions([])
    }
    updateAddress()
  }

  const onCityChange = (selectedOption: SingleValue<SelectOption>) => {
    form.setValue('city', selectedOption)
    updateAddress()
  }

  const updateAddress = () => {
    const country = form.getValues('country')?.label || ''
    const state = form.getValues('state')?.label || ''
    const city = form.getValues('city')?.label || ''
    const street = form.getValues('streetAddress') || ''
    const postalCode = form.getValues('postalCode') || ''

    setAddress(`${street}, ${city}, ${state}, ${country}, ${postalCode}`)
  }

  useEffect(() => {
    updateAddress()
  }, [form.watch(['country', 'state', 'city', 'streetAddress', 'postalCode'])])

  
  const onSubmit = async (values: FormValues) => {
    try {
      if (Object.values(getAddress).length <= 0) return toast.error('Please set your location')

      if(isLoading) return // * handle multiple click
      setIsLoading(true)

      const formData = new FormData()

      if (values.identity instanceof File) {
        formData.append('identity', values.identity)
      }
      formData.append('latitude', getCoords?.lat.toString());
      formData.append('longitude', getCoords?.lon.toString());      
      formData.append('mapAddress', JSON.stringify(getAddress))
      
      for (const [key, value] of Object.entries(values)) {
        if (key !== "identity") {
          if (value && typeof value === 'object' && 'value' in value) {
            formData.append(key, value.value)
          } else if (value) {
            formData.append(key, value.toString())
          }
        }
      }

      const signupData: Record<string, any> = workerSignupDetails.signUpData || {}

      for (const [key, value] of Object.entries(signupData)) {
        formData.append(key, value)
      }

      const res = await professionalInfo(formData)
      
      if (res.success) {
        toast.success(res.message)
        setTimeout(() => {
          router.push(`/worker/workerOtp/${res.worker}`)
        }, 600)
      }
    } catch (error:any) {
    toast.error(error?.message)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-[71rem] mx-auto bg-white shadow-lg rounded-lg p-6 mb-8 mt-[8em]">
      <h2 className="text-2xl font-bold text-center mb-6">Professional Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col gap-6 max-w-[100%]">
          <div className='flex gap-4'>
            <div className='w-[50%]'>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select category</FormLabel>
                    <Select<SelectOption>
                      options={categoryOptions}
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select category"
                      isClearable
                      onChange={onCategoryChange}
                      value={categoryOptions.find(option => option.value === field.value) || null}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Controller
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select country</FormLabel>
                    <Select<SelectOption>
                      options={countryOptions}
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select country"
                      onChange={onCountryChange}
                      value={field.value}
                      isClearable
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Controller
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State / Province</FormLabel>
                    <Select<SelectOption>
                      options={stateOptions}
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select state"
                      onChange={onStateChange}
                      value={field.value}
                      isClearable
                      isDisabled={!form.getValues('country')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Controller
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select<SelectOption>
                      options={cityOptions}
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select city"
                      onChange={onCityChange}
                      value={field.value}
                      isClearable
                      isDisabled={!form.getValues('state')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='w-[50%]'>
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your street address"
                        {...field}
                        className="p-2 rounded w-full border border-gray-300"
                        onChange={(e) => {
                          field.onChange(e)
                          updateAddress()
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apt / Suite</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your Apt / Suite"
                        {...field}
                        className="p-2 rounded w-full border border-gray-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Postal Code"
                        {...field}
                        className="p-2 rounded w-full border border-gray-300"
                        onChange={(e) => {
                          field.onChange(e)
                          updateAddress()
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Identity</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            field.onChange(file)
                          }
                        }}
                        className="w-full mt-2 p-2 border border-gray-300 rounded"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full">
            <Button onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}>
              Set Location
            </Button>
            {isOpen && ( 
              <GoogleMapComponent 
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API || ''} 
                onLocationConfirm={() => {}}
                handleCoords={coords}
                addressHandle={setGetAddress} 
                Handlecoords={setGetCoords} 
                closeModal={() => setIsOpen(false)}
              />
            )}
          </div>
          <Button type="submit" className="w-full mt-4 cursor-pointer">
            {isLoading ? <PulseLoader size={6} color="#ffffff" /> : "Submit"}
          </Button>
        </form>
        <Toaster richColors position="top-center" />
      </Form>
     
    </div>
  )
}


