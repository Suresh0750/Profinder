
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema } from "@/lib/formSchema";
import { useAddCategoryFormMutation,addCategory } from "../../../lib/features/api/adminApiSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, Input, Tooltip } from "@mui/material";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import {useState} from 'react'



const AddCategoryForm = () => {
  const router = useRouter();

  const [isLoading,setIsLoading] = useState<boolean>(false)

  // * Admin RTK api
  // const [AddCategoryForm, { isError, isLoading }] = useAddCategoryFormMutation();
  const [page,setPage]= useState(1)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      CategoryName: "",
      Description: "",
      CategoryImage: undefined,
      
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const formData: FormData = new FormData();

      if(isLoading) return // * prevent the multiple click
      setIsLoading(true)
      formData.append("categoryName", data.CategoryName);
      formData.append("categoryDescription", data.Description);
      if (data.CategoryImage) {
        formData.append("categoryImage", data.CategoryImage);
      }

      const res = await addCategory(formData)
      
      if (res?.success) {
        toast.success(res?.message); 
        window.location.reload()
      }else{
        alert('token expired')
      }
    } catch (error:any) {
      console.log(`Error from add category form \n`, error);
      toast.error(error?.message)
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-700">Add Category</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
          <FormField
            control={form.control}
            name="CategoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700">Category Name</FormLabel>
                <Tooltip title="Enter a unique category name" arrow>
                  <FormControl>
                    <Input
                      placeholder="Category Name"
                      {...field}
                      className="w-full mt-2 p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </FormControl>
                </Tooltip>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700">Description</FormLabel>
                <Tooltip title="Provide a detailed description" arrow>
                  <FormControl>
                    <Textarea
                      placeholder="Type your description here..."
                      {...field}
                      className="w-full mt-2 p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </FormControl>
                </Tooltip>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="CategoryImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700">Upload File</FormLabel>
                <Tooltip title="Choose an image for the category" arrow>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e: any) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                      className="w-full mt-2 p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </FormControl>
                </Tooltip>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {/* <Toaster richColors position="top-right" /> */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={`mt-4 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCategoryForm;
