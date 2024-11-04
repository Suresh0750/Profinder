
"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'
import {Table,TableBody,TableCell,TableHead,TableRow,TableHeader} from '@/components/ui/table'
import {  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'
import {Switch} from '@/components/ui/switch'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { useFetchCategoryDataQuery, useEditCategoryAPIMutation, useListUnlistAPIMutation, useDeleteProductAPIMutation } from "@/lib/features/api/adminApiSlice"

interface Category {
  _id: string
  categoryName: string
  categoryDescription: string
  categoryImage: string
  isListed: boolean
}

export default function CategoryTable({ searchValue }: { searchValue: string }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const router = useRouter()
  const { data: categoryData, error, isLoading } = useFetchCategoryDataQuery(undefined)
  const [editCategoryAPI] = useEditCategoryAPIMutation()
  const [listUnlistAPI] = useListUnlistAPIMutation()
  const [deleteProductAPI] = useDeleteProductAPIMutation()

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData.totalCategory || [])
    }
  }, [categoryData])

  useEffect(() => {
    const filtered = categories.filter(category => 
      category.categoryName.toLowerCase().includes(searchValue.toLowerCase())
    )
    setFilteredCategories(filtered)
    setPage(1)
  }, [searchValue, categories])

  const handleEditClick = (category: Category) => {
    setEditCategory({ ...category })
    setIsEditDialogOpen(true)
  }

  const handleEditSave = async () => {
    if (editCategory) {
      try {
        const formData = new FormData()
        formData.append('categoryName', editCategory.categoryName)
        formData.append('categoryDescription', editCategory.categoryDescription)
        formData.append('categoryImage', editCategory.categoryImage)
        formData.append('_id', editCategory._id)

        const result = await editCategoryAPI(formData)
        if ('data' in result && result.data.success) {
          setCategories(categories.map(cat => 
            cat._id === editCategory._id ? editCategory : cat
          ))
          toast.success('Category updated successfully')
          setIsEditDialogOpen(false)
        } else {
          toast.error('Failed to update category')
        }
      } catch (error) {
        toast.error('An error occurred while updating the category')
      }
    }
  }

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        const result = await deleteProductAPI(categoryToDelete._id)
        if ('data' in result && result.data.success) {
          setCategories(categories.filter(cat => cat._id !== categoryToDelete._id))
          toast.success(`${categoryToDelete.categoryName} has been deleted`)
          setIsDeleteDialogOpen(false)
        } else {
          toast.error('Failed to delete category')
        }
      } catch (error) {
        toast.error('An error occurred while deleting the category')
      }
    }
  }

  const handleToggleList = async (category: Category) => {
    try {
      const result = await listUnlistAPI({ _id: category._id, isListed: !category.isListed })
      if ('data' in result && result.data.success) {
        setCategories(categories.map(cat => 
          cat._id === category._id ? { ...cat, isListed: !cat.isListed } : cat
        ))
        toast.success(`Category ${category.isListed ? 'unlisted' : 'listed'} successfully`)
      } else {
        toast.error('Failed to update category status')
      }
    } catch (error) {
      toast.error('An error occurred while updating the category status')
    }
  }

  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">Error loading categories</div>

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold mb-6">Category Management</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <Image
                    src={category.categoryImage}
                    alt={category.categoryName}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{category.categoryName}</TableCell>
                <TableCell>{category.categoryDescription}</TableCell>
                <TableCell>
                  <Switch
                    checked={category.isListed}
                    onCheckedChange={() => handleToggleList(category)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(page > 1 ? page - 1 : 1)} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink onClick={() => setPage(pageNumber)} isActive={pageNumber === page}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editCategory?.categoryName || ''}
                onChange={(e) => setEditCategory(prev => ({ ...prev!, categoryName: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={editCategory?.categoryDescription || ''}
                onChange={(e) => setEditCategory(prev => ({ ...prev!, categoryDescription: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Input
                  id="image"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setEditCategory(prev => ({ ...prev!, categoryImage: reader.result as string }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
                {editCategory?.categoryImage && (
                  <Image
                    src={editCategory.categoryImage}
                    alt="Category preview"
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the category &quot;{categoryToDelete?.categoryName}&quot;?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}