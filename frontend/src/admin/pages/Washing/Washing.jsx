
import { useLocation } from "react-router-dom"
import { useContext, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Shirt, Search, Calendar, Check, CircleCheck, CircleDashed, ArrowLeftRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { SocketContext } from "@/Context/SocketContext"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

const Washing = () => {
  const [selectedCostumes, setSelectedCostumes] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [isPartialReturnOpen, setIsPartialReturnOpen] = useState(false)
  const [partialReturnCostume, setPartialReturnCostume] = useState(null)
  const [partialReturnDate, setPartialReturnDate] = useState("")
  const [returnedQuantity, setReturnedQuantity] = useState(0)
  const [availableCostumes, setAvailableCostumes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectionState, setSelectionState] = useState({})
  const [dateSelections, setDateSelections] = useState({})
  const [washingStats, setWashingStats] = useState({
    total: 0,
    cleaned: 0,
    pending: 0,
  })
  const location = useLocation()

  const { socket } = useContext(SocketContext)

  const calculateWashingStats = useCallback((costumesData) => {
    let total = 0;
    let cleaned = 0;
  
    Object.values(costumesData).forEach((dateItems) => {
      dateItems.forEach((costume) => {
        total += costume.quantity;
        if (costume.status === "Partialy Cleaned" || costume.status === "Fully Cleaned") {
          cleaned += costume.cleanedQuantity || costume.quantity;
        }
      });
    });
  
    setWashingStats({
      total,
      cleaned,
      pending: total - cleaned,
    });
  }, []);

  useEffect(() => {
    const handleWashingAdd = async (data) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, { method: "GET" })
        const washingRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/washing/getWashingCostumes`, {
          method: "GET",
        })

        if (res.ok && washingRes.ok) {
          const { data: allCostumes } = await res.json()
          const { costumes: washingCostumes } = await washingRes.json()

          const mappedCostumes = washingCostumes.reduce((acc, washingItem) => {
            const fullCostume = allCostumes.find((costume) => costume.id === washingItem.id)
            if (fullCostume) {
              const date = new Date(washingItem.date).toISOString().split("T")[0]
              if (!acc[date]) {
                acc[date] = []
              }
              acc[date].push({
                ...fullCostume,
                quantity: washingItem.quantity,
                status: washingItem.status,
                cleanedQuantity:
                  washingItem.cleanedQuantity || (washingItem.status === "Fully Cleaned" ? washingItem.quantity : 0),
              })
            }
            return acc
          }, {})

          setAvailableCostumes(allCostumes)
          setSelectedCostumes(mappedCostumes)
          calculateWashingStats(mappedCostumes)
          initializeDateSelections(mappedCostumes)
        }
      } catch (error) {
        console.error("Error refreshing data after socket update:", error)
      }
    }

    socket.on("washingAdd", handleWashingAdd)

    return () => {
      socket.off("washingAdd", handleWashingAdd)
    }
  }, [socket, calculateWashingStats])

  useEffect(() => {
    const handleClean = async (data) => {
      if (data && data.costumes && data.costumes.length > 0) {
        // Update the local state to reflect cleaned costumes
        setSelectedCostumes((prev) => {
          const newState = { ...prev }

          // Find which date contains these costumes
          Object.keys(newState).forEach((date) => {
            const updatedCostumes = newState[date].map((costume) => {
              // If this costume's ID is in the cleaned costumes array
              if (data.costumes.includes(costume.id)) {
                return {
                  ...costume,
                  status: data.status ,
                  cleanedQuantity: data.partialClean
                    ? data.quantities && data.quantities[costume.id]
                      ? data.quantities[costume.id]
                      : costume.quantity
                    : costume.quantity,
                }
              }
              return costume
            })

            newState[date] = updatedCostumes
          })

          calculateWashingStats(newState)
          return newState
        })

        // Reset selection checkboxes for cleaned items
        setDateSelections((prev) => {
          const newSelections = { ...prev }

          Object.keys(newSelections).forEach((date) => {
            if (newSelections[date] && newSelections[date].costumes) {
              const updatedCostumes = { ...newSelections[date].costumes }

              // Uncheck cleaned costumes
              data.costumes.forEach((costumeId) => {
                if (updatedCostumes[costumeId] !== undefined) {
                  updatedCostumes[costumeId] = false
                }
              })

              newSelections[date] = {
                ...newSelections[date],
                costumes: updatedCostumes,
                dateSelected: false, // Unselect the date header checkbox
              }
            }
          })

          return newSelections
        })
      }
    }

    socket.on("washingClean", handleClean)

    return () => {
      socket.off("washingClean", handleClean)
    }
  }, [socket])

  useEffect(() => {
    const handleDelete = async (data) => {
      const date = data.date
      setSelectedCostumes((prev) => {
        const updatedCostumes = {
          ...prev,
          [date]: prev[date].filter((costume) => costume.id !== data.id),
        }
        calculateWashingStats(updatedCostumes)
        return updatedCostumes
      })
      setDateSelections((prev) => ({
        ...prev,
        [date]: {
          ...prev[date],
          costumes: {
            ...prev[date].costumes,
            [data.id]: false,
          },
        },
      }))
    }

    socket.on("washingDeleted", handleDelete)

    return () => {
      socket.off("washingDeleted", handleDelete)
    }
  }, [socket, calculateWashingStats])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, { method: "GET" })
      const washingRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/washing/getWashingCostumes`, {
        method: "GET",
      })

      if (res.ok && washingRes.ok) {
        const { data: allCostumes } = await res.json()
        const { costumes: washingCostumes } = await washingRes.json()

        const mappedCostumes = washingCostumes.reduce((acc, washingItem) => {
          const fullCostume = allCostumes.find((costume) => costume.id === washingItem.id)
          if (fullCostume) {
            const date = new Date(washingItem.date).toISOString().split("T")[0]
            if (!acc[date]) {
              acc[date] = []
            }
            acc[date].push({
              ...fullCostume,
              quantity: washingItem.quantity,
              status: washingItem.status,
              cleanedQuantity:
                washingItem.cleanedQuantity || (washingItem.status === "Fully Cleaned" ? washingItem.quantity : 0),
            })
          }
          return acc
        }, {})

        setAvailableCostumes(allCostumes)
        setSelectedCostumes(mappedCostumes)
        calculateWashingStats(mappedCostumes)
        initializeDateSelections(mappedCostumes)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [calculateWashingStats])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const initializeDateSelections = (costumes) => {
    const initialSelections = {}
    Object.keys(costumes).forEach((date) => {
      initialSelections[date] = {
        dateSelected: false,
        costumes: costumes[date].reduce((acc, costume) => {
          acc[costume.id] = false
          return acc
        }, {}),
      }
    })
    setDateSelections(initialSelections)
  }

  const filteredCostumes = availableCostumes.filter(
    (costume) =>
      costume.costumename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      costume.cpname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      costume.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCheckboxChange = (costumeId) => {
    setSelectionState((prev) => ({
      ...prev,
      [costumeId]: {
        ...prev[costumeId],
        checked: !prev[costumeId]?.checked,
      },
    }))
  }

  const handleQuantityChange = (costumeId, value) => {
    const quantity = Math.max(0, Number.parseInt(value) || 0)
    setSelectionState((prev) => ({
      ...prev,
      [costumeId]: {
        ...prev[costumeId],
        quantity: quantity,
      },
    }))
  }

  const handleAddSelected = async () => {
    const costumes = availableCostumes
      .filter((costume) => selectionState[costume.id]?.checked)
      .map((costume) => ({
        id: costume.id,
        quantity: selectionState[costume.id]?.quantity || 1,
      }))

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/washing/addWashingCostumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ costumes }),
      })

      if (res.ok) {
        const message = await res.json()
        toast.success(message.message, {
          description: message.message,
        })
        setIsOpen(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveCostume = async (date, id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/washing/deleteWashingClothe`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: date, id: id }),
      })

      if (res.ok) {
        const message = await res.json()
        toast.success(message.message)
      } else {
        const message = await res.json()
        if (message.error) {
          toast.warning(message.error)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDateSelection = (date, isSelected) => {
    setDateSelections((prev) => ({
      ...prev,
      [date]: {
        dateSelected: isSelected,
        costumes: Object.keys(prev[date].costumes).reduce((acc, costumeId) => {
          acc[costumeId] = isSelected
          return acc
        }, {}),
      },
    }))
  }

  const handleCostumeSelection = (date, costumeId, isSelected) => {
    setDateSelections((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        costumes: {
          ...prev[date].costumes,
          [costumeId]: isSelected,
        },
        dateSelected: isSelected && Object.values(prev[date].costumes).every((v) => v),
      },
    }))
  }

  const handleMarkAsClean = async (date) => {
    const costumes = Object.entries(dateSelections[date].costumes)
      .filter(([_, isSelected]) => isSelected)
      .map(([costumeId, _]) => costumeId)

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/washing/markAsClean`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: [date], costumes: costumes }),
      })

      if (res.ok) {
        const message = await res.json()
        toast.success(message.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openPartialReturnDialog = (costume, date) => {
    setPartialReturnCostume(costume)
    setPartialReturnDate(date)
    setReturnedQuantity(costume.cleanedQuantity || 0)
    setIsPartialReturnOpen(true)
  }

  const handlePartialReturn = async () => {
    if (!partialReturnCostume || !partialReturnDate) return

    try {
      // Assuming your API supports partial returns
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/washing/partialClean`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: partialReturnDate,
          costumeId: partialReturnCostume.id,
          cleanedQuantity: returnedQuantity,
        }),
      })

      if (res.ok) {
        const message = await res.json()
        toast.success(message.message || "Partial return recorded successfully")

        // Update local state
        setSelectedCostumes((prev) => {
          const newState = { ...prev }
          if (newState[partialReturnDate]) {
            newState[partialReturnDate] = newState[partialReturnDate].map((costume) => {
              if (costume.id === partialReturnCostume.id) {
                const newStatus = returnedQuantity >= costume.quantity ? "Fully Cleaned" : "Partially Cleaned"
                return {
                  ...costume,
                  cleanedQuantity: returnedQuantity,
                  status: newStatus,
                }
              }
              return costume
            })
          }
          calculateWashingStats(newState)
          return newState
        })

        setIsPartialReturnOpen(false)
      } else {
        const error = await res.json()
        toast.error(error.message || "Failed to record partial return")
      }
    } catch (error) {
      console.error("Error recording partial return:", error)
      toast.error("An error occurred while recording the partial return")
    }
  }

  // Mobile-friendly card view for costume items
  const CostumeCardDialog = ({ costume, showActions = false, showCheckbox = false, date }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border">
      <div className="flex items-center gap-3">
        {showCheckbox && (
          <Checkbox
            checked={selectionState[costume.id]?.checked}
            onCheckedChange={() => handleCheckboxChange(costume.id)}
          />
        )}
        <img
          src={costume.fileUrl || "/placeholder.svg"}
          alt={costume.costumename}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{costume.costumename}</h3>
          <div className="text-sm text-gray-500 mt-1">
            <div>Cupboard: {costume.cpname}</div>
            <div>Color: {costume.description}</div>
            <div className="flex flex-wrap items-center justify-between mt-2">
              <div>Available: {costume.quantity}</div>
              <div className="flex items-center mt-2 sm:mt-0">
                <span className="mr-2">Quantity:</span>
                <Input
                  type="number"
                  max={costume.quantity}
                  value={selectionState[costume.id]?.quantity}
                  onChange={(e) => handleQuantityChange(costume.id, e.target.value)}
                  className="w-20"
                  disabled={!selectionState[costume.id]?.checked}
                />
              </div>
            </div>
          </div>
        </div>
        {showActions && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleRemoveCostume(date, costume.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )

  const CostumeCard = ({ costume, showActions = false, showCheckbox = false, date }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border">
      <div className="flex items-center gap-3">
        {showCheckbox && (
          <Checkbox
            checked={dateSelections[date]?.costumes?.[costume.id] || false}
            onCheckedChange={(checked) => handleCostumeSelection(date, costume.id, checked)}
          />
        )}
        <img
          src={costume.fileUrl || "/placeholder.svg"}
          alt={costume.costumename}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{costume.costumename}</h3>
            <Badge variant={costume.status === "Fully Cleaned" ? "success" : "destructive"}>{costume.status}</Badge>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <div>Cupboard: {costume.cpname}</div>
            <div>Color: {costume.description}</div>
            <div className="flex items-center gap-2 mt-2">
              <span>Quantity: {costume.quantity}</span>
              {costume.cleanedQuantity > 0 && costume.cleanedQuantity < costume.quantity && (
                <span className="text-green-600">({costume.cleanedQuantity} returned)</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => openPartialReturnDialog(costume, date)}
          >
            <ArrowLeftRight className="h-4 w-4 mr-1" />
            Return
          </Button>
          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleRemoveCostume(date, costume.id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`p-2 md:p-6 max-w-7xl mx-auto ${location.pathname === '/client/clientWashing' ? 'bg-white' : 'bg-gray-100'}  min-h-screen`}>
      <Card className="shadow-lg bg-white">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Shirt className="h-6 md:h-8 w-6 md:w-8 text-gray-900" />
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">Costume Washing</CardTitle>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className={` ${location.pathname === '/client/clientWashing' ? "bg-purple-900 hover:bg-purple-800" : "bg-gray-900 hover:bg-gray-800"}  text-white flex items-center gap-2 w-full md:w-auto`}>
                  <Plus size={16} />
                  Add Costumes
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl mx-2">
                <DialogHeader>
                  <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Shirt className="h-6 w-6 text-gray-900" />
                    Select Costumes
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search costumes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <ScrollArea className="h-[60vh] md:h-[400px]">
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox className={`border-gray-400 text-gray-900 
    ${location.pathname === '/client/clientWashing'
                                  ? "data-[state=checked]:bg-purple-900 data-[state=checked]:border-purple-900"
                                  : "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"}
  `} />
                            </TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Cupboard</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCostumes.map((costume, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Checkbox
                                  checked={selectionState[costume.id]?.checked}
                                  onCheckedChange={() => handleCheckboxChange(costume.id)}
                                  className={`border-gray-400 text-gray-900 
                                    ${location.pathname === '/client/clientWashing'
                                      ? "data-[state=checked]:bg-purple-900 data-[state=checked]:border-purple-900"
                                      : "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"}
                                  `}
                                />
                              </TableCell>
                              <TableCell>
                                <img
                                  src={costume.fileUrl || "/placeholder.svg"}
                                  alt={costume.costumename}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              </TableCell>
                              <TableCell>{costume.costumename}</TableCell>
                              <TableCell>{costume.cpname}</TableCell>
                              <TableCell>{costume.description}</TableCell>
                              <TableCell>{costume.quantity}</TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  max={costume.quantity}
                                  value={selectionState[costume.id]?.quantity}
                                  onChange={(e) => handleQuantityChange(costume.id, e.target.value)}
                                  className="w-20"
                                  disabled={!selectionState[costume.id]?.checked}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="md:hidden">
                      {filteredCostumes.map((costume, index) => (
                        <CostumeCardDialog key={index} costume={costume} showCheckbox={true} />
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handleAddSelected}
                      disabled={!Object.values(selectionState).some((state) => state.checked)}
                      className={`${location.pathname === '/client/clientWashing' ? "bg-purple-900 hover:bg-purple-800" : "bg-gray-900 hover:bg-gray-800"}  w-full md:w-auto`}
                    >
                      Add Selected
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Costumes</h3>
                    <p className="text-2xl font-bold">{washingStats.total}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Shirt className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Cleaned</h3>
                    <p className="text-2xl font-bold text-green-600">{washingStats.cleaned}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CircleCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                    <p className="text-2xl font-bold text-amber-600">{washingStats.pending}</p>
                  </div>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <CircleDashed className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Washing Progress</span>
              <span className="text-sm font-medium">
                {washingStats.total > 0 ? Math.round((washingStats.cleaned / washingStats.total) * 100) : 0}%
              </span>
            </div>
            <Progress
              value={washingStats.total > 0 ? (washingStats.cleaned / washingStats.total) * 100 : 0}
              className="h-2 bg-gray-200"
            />
          </div>
        </div>
        <CardContent className="p-2 md:p-6 overflow-auto">
          {Object.entries(selectedCostumes)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, costumes]) => (
              <div key={date} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={dateSelections[date]?.dateSelected || false}
                      onCheckedChange={(checked) => handleDateSelection(date, checked)}
                      className={` ${location.pathname === '/client/clientWashing'
                        ? "data-[state=checked]:bg-purple-900 data-[state=checked]:border-purple-900"
                        : "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"} `}
                    />
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h2>
                  </div>
                  <Button
                    onClick={() => handleMarkAsClean(date)}
                    disabled={!Object.values(dateSelections[date]?.costumes || {}).some(Boolean)}
                    className={`${location.pathname === '/client/clientWashing' ? "bg-purple-900 hover:bg-purple-800" : "bg-gray-900 hover:bg-gray-800"}  text-white`}
                  >
                    <Check className="mr-2 h-4 w-4" /> Mark as Clean
                  </Button>
                </div>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Cupboard</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Returned</TableHead>
                        <TableHead className="text-start">Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costumes.map((costume, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Checkbox
                              checked={dateSelections[date]?.costumes[costume.id] || false}
                              onCheckedChange={(checked) => handleCostumeSelection(date, costume.id, checked)}
                              className={` ${location.pathname === '/client/clientWashing'
                                ? "data-[state=checked]:bg-purple-900 data-[state=checked]:border-purple-900"
                                : "data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"}`}
                            />
                          </TableCell>
                          <TableCell>
                            <img
                              src={costume.fileUrl || "/placeholder.svg"}
                              alt={costume.costumename}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </TableCell>
                          <TableCell>{costume.costumename}</TableCell>
                          <TableCell>{costume.cpname}</TableCell>
                          <TableCell>{costume.description}</TableCell>
                          <TableCell>{costume.quantity}</TableCell>
                          <TableCell>
                            {costume.cleanedQuantity || 0} / {costume.quantity}
                            {costume.cleanedQuantity > 0 && costume.cleanedQuantity < costume.quantity && (
                              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                Partial
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-start">
                            <Badge variant={costume.status === "Fully Cleaned" ? "success" : "destructive"}>
                              {costume.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => openPartialReturnDialog(costume, date)}
                              >
                                <ArrowLeftRight className="h-4 w-4" />
                                <span className="sr-only">Return</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveCostume(date, costume.id)}
                              >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="md:hidden">
                  {costumes.map((costume, index) => (
                    <CostumeCard key={index} costume={costume} showActions={true} showCheckbox={true} date={date} />
                  ))}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Partial Return Dialog */}
      <Dialog open={isPartialReturnOpen} onOpenChange={setIsPartialReturnOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Returned Items</DialogTitle>
            <DialogDescription>Enter the number of items that have been returned from washing.</DialogDescription>
          </DialogHeader>

          {partialReturnCostume && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <img
                  src={partialReturnCostume.fileUrl || "/placeholder.svg"}
                  alt={partialReturnCostume.costumename}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium">{partialReturnCostume.costumename}</h3>
                  <p className="text-sm text-muted-foreground">Total sent: {partialReturnCostume.quantity}</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="returnedQuantity">Number of items returned</Label>
                <Input
                  id="returnedQuantity"
                  type="number"
                  min="0"
                  max={partialReturnCostume.quantity}
                  value={returnedQuantity}
                  onChange={(e) =>
                    setReturnedQuantity(
                      Math.min(partialReturnCostume.quantity, Math.max(0, Number.parseInt(e.target.value) || 0)),
                    )
                  }
                />
                {returnedQuantity > 0 && returnedQuantity < partialReturnCostume.quantity && (
                  <p className="text-sm text-amber-600">
                    {partialReturnCostume.quantity - returnedQuantity} items will remain pending
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPartialReturnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePartialReturn}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Washing

