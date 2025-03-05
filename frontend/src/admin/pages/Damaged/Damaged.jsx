"use client"

import { useEffect, useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  ArrowLeftRight,
  Loader2,
  Trash2,
  ArrowUpDown,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const Damaged = () => {
  const [costumes, setCostumes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")
  const [selectedCostumes, setSelectedCostumes] = useState([])
  const [repairQuantities, setRepairQuantities] = useState({})
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [showCustomDateFilter, setShowCustomDateFilter] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [selectedTransferStatus, setSelectedTransferStatus] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })

  useEffect(() => {
    fetchCostumes()
  }, [])

  const fetchCostumes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getDamagedCostumes`, {
        method: "GET",
      })
      if (!res.ok) throw new Error("Failed to fetch data")
      const data = await res.json()
      setCostumes(data.Costumes || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (selectedCostumes.length === 0) return
    
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/deleteDamagedCostumes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ costumeIds: selectedCostumes })
      })
      
      if (res.ok) {
        toast.success("Selected costumes deleted successfully")
        fetchCostumes()
        setSelectedCostumes([])
        setRepairQuantities({})
      } else {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete costumes")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: 
        prev.key === key && prev.direction === 'ascending' 
          ? 'descending' 
          : 'ascending'
    }))
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCostumes(filteredCostumes.map((costume) => costume.id))
    } else {
      setSelectedCostumes([])
    }
  }

  const handleSelect = (id) => {
    setSelectedCostumes((prev) => {
      if (prev.includes(id)) {
        return prev.filter((costumeId) => costumeId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleQuantityChange = (id, value) => {
    const quantity = Number.parseInt(value) || 0
    const maxQuantity = costumes.find((costume) => costume.id === id)?.quantity || 0

    setRepairQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(quantity, maxQuantity)),
    }))
  }

  const handleRepair = async () => {
    if (selectedCostumes.length === 0) return
    setTransferDialogOpen(true)
  }

  const handleRestore = async () => {
    if (selectedCostumes.length === 0) return
    setTransferDialogOpen(true)
    setSelectedTransferStatus("Restored")
  }

  const handleTransferSubmit = async () => {
    try {
      const costumeIds = selectedCostumes.map((id) => {
        const costume = costumes.find(c => c.id === id);
        return {
          id,
          cid: costume?.cid || null,
          quantity: repairQuantities[id] || 1,
        }
      });
      const newStatus = selectedTransferStatus

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/updateStatusDamged`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ costumeIds, newStatus })
      })
      if (res.ok) {
        const message = await res.json();
        toast.success(message.message)
        setTransferDialogOpen(false)
        fetchCostumes()
        setSelectedCostumes([])
        setRepairQuantities({})
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const filteredCostumes = useMemo(() => {
    let result = [...costumes]

    if (searchTerm) {
      result = result.filter(
        (costume) =>
          (costume.costumename?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (costume.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "All") {
      result = result.filter((costume) => costume.status === statusFilter)
    }

    if (dateFilter !== "All") {
      if (dateFilter === "Custom" && (customDateRange.start || customDateRange.end)) {
        result = result.filter((costume) => {
          const costumeDate = new Date(costume.date)
          let isInRange = true

          if (customDateRange.start) {
            const startDate = new Date(customDateRange.start)
            isInRange = isInRange && costumeDate >= startDate
          }

          if (customDateRange.end) {
            const endDate = new Date(customDateRange.end)
            endDate.setDate(endDate.getDate() + 1)
            isInRange = isInRange && costumeDate < endDate
          }

          return isInRange
        })
      } else {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfMonth = new Date(today.getFullYear(), now.getMonth(), 1)
        const startOfYear = new Date(today.getFullYear(), 0, 1)

        result = result.filter((costume) => {
          const costumeDate = new Date(costume.date)
          switch (dateFilter) {
            case "Week":
              return costumeDate >= startOfWeek
            case "Month":
              return costumeDate >= startOfMonth
            case "Year":
              return costumeDate >= startOfYear
            default:
              return true
          }
        })
      }
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [costumes, searchTerm, statusFilter, dateFilter, customDateRange, sortConfig])

  const displayedCostumes = filteredCostumes

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <Card className="w-full mx-auto shadow-md">
        <CardHeader className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Damaged Costumes
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto text-sm">
                    Status: {statusFilter} <Filter className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["All", "Damaged", "In Repair", "Repaired", "Partially Returned"].map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="cursor-pointer"
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto text-sm">
                    Date: {dateFilter} <Filter className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["All", "Week", "Month", "Year", "Custom"].map((date) => (
                    <DropdownMenuItem
                      key={date}
                      onClick={() => {
                        setDateFilter(date)
                        setShowCustomDateFilter(date === "Custom")
                      }}
                      className="cursor-pointer"
                    >
                      {date}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomDateFilter(!showCustomDateFilter)}
                className="w-full sm:w-auto text-sm"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showCustomDateFilter ? "Hide Filter" : "Custom Filter"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-6 sm:px-6">
          {showCustomDateFilter && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={selectedCostumes.length === 0}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    Transfer Costumes
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleRepair}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Send to Repair
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRestore}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restore to Inventory
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedTransferStatus("Damaged")
                      setTransferDialogOpen(true)
                    }}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Mark as Damaged
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                disabled={selectedCostumes.length === 0}
                onClick={handleDelete}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      id="select-all"
                      onCheckedChange={handleSelectAll}
                      checked={selectedCostumes.length > 0 && selectedCostumes.length === filteredCostumes.length}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('cosumername')}>
                    Consumer
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('costumename')}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('quantity')}>
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('inrepairedquantity')}>
                    In Repair
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('repairedquantity')}>
                    Repaired
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="text-right">Transfer Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
                        Loading costumes...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4 text-red-500">
                      Error: {error}
                    </TableCell>
                  </TableRow>
                ) : displayedCostumes.length > 0 ? (
                  displayedCostumes.map((costume) => (
                    <TableRow
                      key={costume.id}
                      className={selectedCostumes.includes(costume.id) ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        <Checkbox
                          id={`select-${costume.id}`}
                          checked={selectedCostumes.includes(costume.id)}
                          onCheckedChange={() => handleSelect(costume.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={costume.fileUrl || "/placeholder.svg?height=48&width=48"}
                          alt={costume.costumename}
                          className="w-12 h-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                      </TableCell>
                      <TableCell>{costume.cosumername}</TableCell>
                      <TableCell>{costume.costumename}</TableCell>
                      <TableCell>{costume.description}</TableCell>
                      <TableCell>{costume.quantity}</TableCell>
                      <TableCell>{costume.inrepairedquantity || 0}</TableCell>
                      <TableCell>{costume.repairedquantity || 0}</TableCell>
                      <TableCell>{formatDate(costume.date)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${costume.status === "Damaged"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : costume.status === "In Repair"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : costume.status === "Partially Returned"
                                  ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                  : "bg-green-100 text-green-800 hover:bg-green-100"
                            }`}
                        >
                          {costume.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="1"
                          max={costume.quantity}
                          value={repairQuantities[costume.id] || 1}
                          onChange={(e) => handleQuantityChange(costume.id, e.target.value)}
                          className="w-20 text-right text-sm"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      No damaged costumes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Costumes</DialogTitle>
            <DialogDescription>Change the status of selected costumes to {selectedTransferStatus}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="transfer-status" className="text-sm font-medium">
                New Status
              </label>
              <Select value={selectedTransferStatus} onValueChange={setSelectedTransferStatus}>
                <SelectTrigger id="transfer-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="In Repair">In Repair</SelectItem>
                  <SelectItem value="Repaired">Repaired</SelectItem>
                  <SelectItem value="Restored">Restored</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Selected Costumes:</p>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                <ul className="text-sm space-y-1">
                  {selectedCostumes.map((id) => {
                    const costume = costumes.find((c) => c.id === id)
                    return (
                      <li key={id} className="flex justify-between">
                        <span>{costume?.costumename || `Costume #${id}`}</span>
                        <span>Qty: {repairQuantities[id] || 1}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransferSubmit}>Confirm Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Damaged