import { z } from "zod";

export const FormSchema = z.object({
    CategoryName: z.string().min(2, {
      message: "Category name must be at least 2 characters.",
    }),
    Description: z.string().min(10, {
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
            FirstName: z.string().min(1, {
              message: "First name is required.",
            }),
            LastName: z.string().min(1, {
              message: "Last name is required.",
            }),
            PhoneNumber: z.string().length(10, {
              message: "Phone number should be exactly 10 digits long.",
            }),
            EmailAddress: z.string().email({
              message: "Please enter a valid email address.",
            }),
            Password: z.string()
              .min(6, { message: "Password must be at least 6 characters long" })
              .regex(/[A-Za-z]/, { message: "Password must contain at least one letter" })
              .regex(/\d/, { message: "Password must contain at least one number" })
              .regex(/[@$!%*?&]/, {
                message: "Password must contain at least one special character",
              }),
            ConfirmPass: z.string().nonempty({
              message: "Confirm password cannot be empty",
            }),
            
          }).refine((data) => data.Password === data.ConfirmPass, {
            message: "Passwords don't match",
            path: ["ConfirmPass"],
          });



// * worker professionalInfo schema

// * Form validation schema using Zod

export const professionalInfoFormSchema = z.object({
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
  PostalCode: z.string().min(5, { message: "Postal code is required." }),
})




// * User

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