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
import { useProfessionalInfoMutation } from '@/lib/features/api/workerApiSlice'
import { useGetCategoryNameQuery } from '@/lib/features/api/customerApiSlice'
import Select, { SingleValue } from 'react-select'
import countryList from 'react-select-country-list'
import { City, State, Country } from 'country-state-city'
import GoogleMapComponent from './GoogleMapComponent'

// import { professionalInfoFormSchema } from '@/lib/formSchema'

const professionalInfoFormSchema = z.object({
  Category: z.string().min(1, { message: "Category is required." }),
  Country: z.object({
    value: z.string(),
    label: z.string()
  }).nullable(),
  StreetAddress: z.string().min(1, { message: "Street address is required." }),
  City: z.object({
    value: z.string(),
    label: z.string()
  }).nullable(),
  Identity: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Identity document is required and must be a valid file.",
    }),
  Apt: z.string().max(10, { message: "Apt/Suite should be less than 10 characters." }).optional(),
  State: z.object({
    value: z.string(),
    label: z.string()
  }).nullable(),
  PostalCode: z.string().min(1, { message: "Postal code is required." }),
})
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

  const workersignupData = useSelector((state: any) => state.WorkerSignupData)
  const [ProfessionalInfo, { isLoading }] = useProfessionalInfoMutation()
  const { data: categoryData } = useGetCategoryNameQuery('')

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

  useEffect(() => {
    if (categoryData) {
      setCategoryOptions(categoryData?.result?.map((category: string) => ({ value: category, label: category })))
    }
  }, [categoryData])

  const form = useForm<FormValues>({
    resolver: zodResolver(professionalInfoFormSchema),
    defaultValues: {
      Category: "",
      Country: null,
      StreetAddress: "",
      City: null,
      Identity: undefined,
      Apt: "",
      State: null,
      PostalCode: "",
    },
  })
  type SelectOption = {
    value: string
    label: string
  }
  
  type FormValues = z.infer<typeof professionalInfoFormSchema>

  const onCategoryChange = (selectedOption: SingleValue<SelectOption>) => {
    if (selectedOption) {
      form.setValue('Category', selectedOption.value)
    } else {
      form.setValue('Category', "")
    }
  }


  const onCountryChange = (selectedOption: SingleValue<SelectOption>) => {
    form.setValue('Country', selectedOption)
    form.setValue('State', null)
    form.setValue('City', null)
    form.setValue('StreetAddress', '')
    form.setValue('PostalCode', '')
    
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
    form.setValue('State', selectedOption)
    form.setValue('City', null)
    form.setValue('StreetAddress', '')
    form.setValue('PostalCode', '')
    
    const countryValue = form.getValues('Country')?.value
    if (countryValue && selectedOption) {
      const cities = City.getCitiesOfState(countryValue, selectedOption.value)
      setCityOptions(cities.map(city => ({ value: city.name, label: city.name })))
    } else {
      setCityOptions([])
    }
    updateAddress()
  }

  const onCityChange = (selectedOption: SingleValue<SelectOption>) => {
    form.setValue('City', selectedOption)
    updateAddress()
  }

  const updateAddress = () => {
    const country = form.getValues('Country')?.label || ''
    const state = form.getValues('State')?.label || ''
    const city = form.getValues('City')?.label || ''
    const street = form.getValues('StreetAddress') || ''
    const postalCode = form.getValues('PostalCode') || ''

    setAddress(`${street}, ${city}, ${state}, ${country}, ${postalCode}`)
  }

  useEffect(() => {
    updateAddress()
  }, [form.watch(['Country', 'State', 'City', 'StreetAddress', 'PostalCode'])])

  
  const onSubmit = async (values: FormValues) => {
    try {
      if (Object.values(getAddress).length <= 0) return toast.error('Please set your location')

      const formData = new FormData()

      if (values.Identity instanceof File) {
        formData.append('Identity', values.Identity)
      }
      formData.append('lat', getCoords?.lat.toString());
      formData.append('lon', getCoords?.lon.toString());      
      formData.append('mapAddress', JSON.stringify(getAddress))
      
      for (const [key, value] of Object.entries(values)) {
        if (key !== "Identity") {
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

      const res = await ProfessionalInfo(formData).unwrap()
      
      if (res.success) {
        toast.success(res.message)
        setTimeout(() => {
          router.push(`/worker/workerOtp/${res.worker}`)
        }, 4000)
      }
    } catch (err) {
      toast.error('Error: Registration failed. Please check your input and try again.')
      console.error(err)
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
                name="Category"
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
                name="Country"
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
                name="State"
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
                      isDisabled={!form.getValues('Country')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Controller
                name="City"
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
                      isDisabled={!form.getValues('State')}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='w-[50%]'>
              <FormField
                control={form.control}
                name="StreetAddress"
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
                name="Apt"
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
                name="PostalCode"
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
                name="Identity"
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


