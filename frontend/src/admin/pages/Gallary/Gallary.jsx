"use client"

import { useState, useEffect, useContext, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Filter, Search, Grid, List, Plus, Trash2, ShoppingCart, Edit, CheckSquare } from "lucide-react"
import { toast, ToastContainer, Bounce } from "react-toastify"
import { SocketContext } from "@/Context/SocketContext"

// Import shadcn components
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import CatagoryModal from "../../components/CatagoryModal"
import GallaryNavbar from "./GallaryNavbar"

const Gallery = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [images, setImages] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // New state for multiple selection
  const [selectedItems, setSelectedItems] = useState([])
  const [isSelectMode, setIsSelectMode] = useState(false)

  const { socket } = useContext(SocketContext)

  useEffect(() => {
    const handleDel = async (data) => {
      setImages((prevImages) => prevImages.filter((image) => image.id !== data.message))
      // Clear selection if deleted item was selected
      setSelectedItems((prev) => prev.filter((id) => id !== data.message))
    }

    const handleUpdateQuantity = (data) => {
      setImages((prevCostumes) =>
        prevCostumes.map((e) => (e.id === data.id ? { ...e, quantity: data.newQuantity,status:data.status } : e)),
      )
    }

    const fetchRealTimeData = (data) => {
      setImages((prevImages) => [...prevImages, data.newDetails])
    }

    socket.on("deleteGallary", handleDel)
    socket.on("updateCostumeQuantity", handleUpdateQuantity)
    socket.on("addNewCostumes", fetchRealTimeData)

    return () => {
      socket.off("deleteGallary", handleDel)
      socket.off("updateCostumeQuantity", handleUpdateQuantity)
      socket.off("addNewCostumes", fetchRealTimeData)
    }
  }, [socket])

  const [viewType, setViewType] = useState(() => {
    return localStorage.getItem("galleryViewType") || "grid"
  })

  // Update localStorage when view type changes
  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType)
    localStorage.setItem("galleryViewType", newViewType)
  }

  // Handle item selection
  const toggleItemSelection = (id, e) => {
    e?.stopPropagation()

    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Toggle select mode
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode)
    if (isSelectMode) {
      setSelectedItems([])
    }
  }

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.length === sortedImages.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(sortedImages.map((image) => image.id))
    }
  }

  // Add multiple items to cart
  const addSelectedToCart = async () => {
    if (selectedItems.length === 0) {
      toast.info("No items selected", {
        position: "top-center",
        autoClose: 1000,
      })
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedItems }), // Sending the entire array
        }
      )

      if (response.ok) {
        toast.success(`${selectedItems.length} items added to cart`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        })
        setSelectedItems([])
        setIsSelectMode(false)
      } else {
        throw new Error("Failed to add items")
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to add items to cart", {
        position: "top-center",
        autoClose: 1000,
      })
    }
  }


  // Delete multiple items
  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) {
      toast.info("No items selected", {
        position: "top-center",
        autoClose: 1000,
      })
      return
    }

    const confirmDelete = confirm(`Are you sure you want to delete ${selectedItems.length} costume(s)?`)
    if (!confirmDelete) return

    try {
      const promises = selectedItems.map((id) =>
        fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/deleteCostume/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      )

      const results = await Promise.all(promises)
      const allSuccessful = results.every((res) => res.ok)

      if (allSuccessful) {
        toast.success(`${selectedItems.length} items deleted successfully`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        })
        // Socket will handle the removal from the UI
        setSelectedItems([])
        setIsSelectMode(false)
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to delete items", {
        position: "top-center",
        autoClose: 1000,
      })
    }
  }

  const handleToAddCart = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/addToCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        const message = await res.json()
        toast(`${message.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSearch = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/searchCostume?query=${searchQuery}`)

      if (res.ok) {
        const data = await res.json()
        setImages(data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    const c = confirm("Are you sure you want to delete costume?")
    if (c) {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/deleteCostume/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const message = await response.json()
        toast(`${message.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        })
      }
    }
  }

  const handleChangeOpen = () => {
    setIsOpen(true)
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (res.ok) {
        const data = await res.json()
        setImages(data.data)
      }
    } catch (err) {
      console.log(err)
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/catagories/getCatagory`, { method: "GET" })
      if (res.ok) {
        const data = await res.json()
        const fetchedCatagories = data.data.map((cat) => cat.catagory)
        const UniqData = Array.from(new Set(["All", ...fetchedCatagories]))
        setCategories(UniqData)
      }
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredImages =
    selectedCategory === "All" ? images : images.filter((image) => image.catagory === selectedCategory)

  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0)
      case "price-high":
        return (b.price || 0) - (a.price || 0)
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default:
        return 0
    }
  })

  const CategoryButton = ({ category }) => (
    <Button
      variant={selectedCategory === category ? "default" : "outline"}
      size="sm"
      onClick={() => {
        setSelectedCategory(category)
        setIsMobileFiltersOpen(false)
      }}
      className="whitespace-nowrap"
    >
      {category}
    </Button>
  )

  const TableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {isSelectMode && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === sortedImages.length && sortedImages.length > 0}
                  onCheckedChange={selectAllItems}
                />
              </TableHead>
            )}
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>CP Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedImages.map((image, index) => (
            <TableRow
              key={index}
              className={`${selectedItems.includes(image.id) ? "bg-primary/5" : ""}`}
              onClick={() =>
                isSelectMode ? toggleItemSelection(image.id) : navigate(`/admin/costumeDetails/${image.id}`)
              }
            >
              {isSelectMode && (
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(image.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems([...selectedItems, image.id])
                      } else {
                        setSelectedItems(selectedItems.filter((id) => id !== image.id))
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
              )}
              <TableCell>
                <img
                  src={`${image.fileUrl}?auto=format&fit=crop&w=100&q=80`}
                  alt={image.costumename}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {image.costumename}
                  {image.isNew && (
                    <Badge variant="default" className="ml-2">
                      New
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{image.cpname}</TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">{image.description}</TableCell>
              <TableCell>{image.quantity}</TableCell>
              <TableCell>
                <Badge variant={image.status === "In Stock" ? "outline" : "destructive"} className="ml-auto">
                  {image.status}
                </Badge>

              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToAddCart(image.id)
                    }}
                    title="Add to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/admin/costumeDetails/${image.id}`)
                    }}
                    title="View Details"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(image.id)
                    }}
                    title="Delete Costume"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const GridView = () => (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {sortedImages.map((image, index) => (
        <Card
          key={index}
          className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${selectedItems.includes(image.id) ? "ring-2 ring-primary" : ""
            }`}
          onClick={() => (isSelectMode ? toggleItemSelection(image.id) : navigate(`/admin/costumeDetails/${image.id}`))}
        >
          <div className="relative">
            {isSelectMode && (
              <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedItems.includes(image.id)}
                  onCheckedChange={() => toggleItemSelection(image.id)}
                  className="h-5 w-5 bg-white/90 border-gray-400"
                />
              </div>
            )}

            <div className="relative pb-[100%]">
              <img
                src={`${image.fileUrl}?auto=format&fit=crop&w=400&q=80`}
                alt={image.costumename}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {image.isNew && <Badge className="absolute top-2 right-2">New Arrival</Badge>}
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="text-lg font-medium line-clamp-1">{image.costumename}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{image.cpname}</p>
            <p className="text-sm line-clamp-2 mt-1">{image.description}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm font-medium">Quantity: {image.quantity}</p>
              <Badge variant={image.status === "In Stock" ? "outline" : "destructive"} className="ml-auto">
                {image.status}
              </Badge>

            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                handleToAddCart(image.id)
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Add to Cart
            </Button>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/admin/costumeDetails/${image.id}`)
                }}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(image.id)
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {isOpen && (
        <CatagoryModal onClose={() => setIsOpen(false)} setCategories={setCategories} categories={categories} />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <GallaryNavbar toggalMobileFilter={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} />

        {/* Mobile Filters Drawer */}
        {!isMobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden">
            <div className="absolute right-0 top-0 h-full w-64 bg-white p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsMobileFiltersOpen(true)}>
                  ✕
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <CategoryButton key={category} category={category} />
                ))}
                <Button variant="outline" size="sm" onClick={handleChangeOpen} className="w-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Selection Actions Bar - Appears when in select mode */}
          {isSelectMode && (
            <div className="bg-white border rounded-lg p-2 mb-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedItems.length === sortedImages.length && sortedImages.length > 0}
                  onCheckedChange={selectAllItems}
                  id="select-all"
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  {selectedItems.length} selected
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={addSelectedToCart} disabled={selectedItems.length === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedItems}
                  disabled={selectedItems.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleSelectMode}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Search and Filters Section */}
          <div className="mb-6 sm:mb-8 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search costumes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                  className="pl-9 pr-4"
                />
              </div>
              <Button variant="outline" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-600 mr-1" />
                <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-20rem)]">
                  {categories.map((category) => (
                    <CategoryButton key={category} category={category} />
                  ))}
                  <Button variant="outline" size="sm" onClick={handleChangeOpen}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                {!isSelectMode && (
                  <Button variant="outline" size="sm" onClick={toggleSelectMode} className="mr-2">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                )}

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleViewTypeChange(viewType === "grid" ? "table" : "grid")}
                >
                  {viewType === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {sortedImages.length} results in {selectedCategory}
          </div>

          {/* Content View */}
          {viewType === "grid" ? <GridView /> : <TableView />}
        </div>
      </div>
    </>
  )
}

export default Gallery

