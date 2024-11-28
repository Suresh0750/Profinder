import { z } from "zod";
import * as yup from 'yup';

export const FormSchema = z.object({
    CategoryName: z.string().trim().min(2, {
      message: "Category name must be at least 2 characters.",
    }),
    Description: z.string().trim().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    CategoryImage: z
      .any()
      .refine((file) => file instanceof File, {
        message: "Category image is required and must be a valid file.",
      }),
  });



  // * worker signUP shcema for form validation

  export const signUPformSchema = z.object({
            firstName: z.string().min(1, {
              message: "First name is required.",
            }),
            lastName: z.string().min(1, {
              message: "Last name is required.",
            }),
            phoneNumber: z.string().length(10, {
              message: "Phone number should be exactly 10 digits long.",
            }),
            emailAddress: z.string().email({
              message: "Please enter a valid email address.",
            }),
            password: z.string()
              .min(6, { message: "Password must be at least 6 characters long" })
              .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
              .regex(/\d/, { message: "Password must contain at least one number" })
              .regex(/[@$!%*?&]/, {
                message: "Password must contain at least one special character",
              }),
            confirmPass: z.string().nonempty({
              message: "Confirm password cannot be empty",
            }),
            
          }).refine((data) => data.password === data.confirmPass, {
            message: "Passwords don't match",
            path: ["confirmPass"],
          });



// * worker professionalInfo schema

// * Form validation schema using Zod

export const professionalInfoFormSchema = z.object({
  category: z.string().min(1, { message: "Category is required." }),
  country: z.object({
    value: z.string(),
    label: z.string()
  }).nullable(),
  streetAddress: z.string().min(1, { message: "Street address is required." }),
  city: z.object({
    value: z.string(),
    label: z.string()
  }).nullable(),
  identity: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Identity document is required and must be a valid file.",
    }),
  apt: z.string().max(10, { message: "Apt/Suite should be less than 10 characters." }).optional(),
  state: z.object({
    value: z.string(),
    label: z.string()
  }).nullable(),
  postalCode: z.string().min(1, { message: "Postal code is required." }),
})


// * google verification
 // * Validation schema using Yup
 export const WorkerGoogleVerificationschema = yup.object({
  phoneNumber: yup.string().required('Phone number is required'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(/[A-Za-z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),

    category: yup.string().required('Category is required'),
    country: yup.string().required('Country is required'),
    streetAddress: yup.string().required('Street Address is required'),
    state: yup.string().required('State is required'),
    city: yup.string().required('City is required'),
    apt: yup.string(),
    identity: yup.mixed().required('Identity (image) is required'),
    postalCode: yup.number().required('Postal Code is required').positive().integer(),
  }).required();



// * User

// * user login


export const UserSignInFormSchema = z.object({
  emailAddress: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
})



export const userSignupformSchema = z.object({
  username: z.string().min(5, { message: "Username must be at least 5 characters." }),
  phoneNumber: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() === "") return undefined;
    const parsed = parseInt(val as string, 10);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number({
    invalid_type_error: "Phone number must be a number.",
    required_error: "Phone number is required.",
  })
    .int({ message: "Phone number must be an integer." })
    .positive({ message: "Phone number must be positive." })
    .refine((val) => val.toString().length === 10, { message: "Phone number should be exactly 10 digits long." })),
  emailAddress: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters long." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),
  confirmPass: z.string().nonempty({ message: "Confirm password cannot be empty" }),
}).refine((data) => data.password === data.confirmPass, {
  message: "Passwords don't match",
  path: ["confirmPass"],
});


// * worker

export const workerLoginFormSchema = z.object({
  emailAddress: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
})