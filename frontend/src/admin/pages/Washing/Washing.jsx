import { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Shirt, Search, Calendar, Check } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { SocketContext } from "@/Context/SocketContext"


const Washing = () => {
  const [selectedCostumes, setSelectedCostumes] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [availableCostumes, setAvailableCostumes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectionState, setSelectionState] = useState({})
  const [dateSelections, setDateSelections] = useState({})

 const {socket} = useContext(SocketContext)

//  useEffect(() => {
  
    


//  }, [])


useEffect(() => {
  const handleWashingAdd = async (data) => {
    
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getCostume`, { method: "GET" });
      const washingRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/washing/getWashingCostumes`, {
        method: "GET",
      });

      if (res.ok && washingRes.ok) {
        const { data: allCostumes } = await res.json();
        const { costumes: washingCostumes } = await washingRes.json();

        const mappedCostumes = washingCostumes.reduce((acc, washingItem) => {
          const fullCostume = allCostumes.find((costume) => costume.id === washingItem.id);
          if (fullCostume) {
            const date = new Date(washingItem.date).toISOString().split("T")[0];
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({ ...fullCostume, quantity: washingItem.quantity, status: washingItem.status });
          }
          return acc;
        }, {});

        setAvailableCostumes(allCostumes);
        setSelectedCostumes(mappedCostumes);
        initializeDateSelections(mappedCostumes);
      }
    } catch (error) {
      console.error("Error refreshing data after socket update:", error);
    }
  };

  socket.on("washingAdd", handleWashingAdd);

  return () => {
    socket.off("washingAdd", handleWashingAdd);
  };
}, [socket]);// Added availableCostumes as a dependency// ✅ Proper useEffect dependency

useEffect(() => {
  const handleClean = async(data) => {
    if (data && data.costumes && data.costumes.length > 0) {
      // Update the local state to reflect cleaned costumes
      setSelectedCostumes((prev) => {
        const newState = { ...prev };
        
        // Find which date contains these costumes
        Object.keys(newState).forEach(date => {
          const updatedCostumes = newState[date].map(costume => {
            // If this costume's ID is in the cleaned costumes array
            if (data.costumes.includes(costume.id)) {
              return { ...costume, status: data.status || "Cleaned" };
            }
            return costume;
          });
          
          newState[date] = updatedCostumes;
        });
        
        return newState;
      });
      
      // Reset selection checkboxes for cleaned items
      setDateSelections((prev) => {
        const newSelections = { ...prev };
        
        Object.keys(newSelections).forEach(date => {
          if (newSelections[date] && newSelections[date].costumes) {
            const updatedCostumes = { ...newSelections[date].costumes };
            
            // Uncheck cleaned costumes
            data.costumes.forEach(costumeId => {
              if (updatedCostumes[costumeId] !== undefined) {
                updatedCostumes[costumeId] = false;
              }
            });
            
            newSelections[date] = {
              ...newSelections[date],
              costumes: updatedCostumes,
              dateSelected: false // Unselect the date header checkbox
            };
          }
        });
        
        return newSelections;
      });
    }
  };
 
  socket.on("washingClean", handleClean);
  
  return () => {
    socket.off("washingClean", handleClean);
  };
}, [socket]);


useEffect(() => {
  const handleDelete = async(data)=>{
    let date = data.date
    setSelectedCostumes((prev) => ({
      ...prev,
      [date]: prev[date].filter((costume) => costume.id !== data.id),
    }))
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

  socket.on("washingDeleted", handleDelete);
  
  return () => {
    socket.off("washingDeleted", handleDelete);
  }
}, [socket])


 


  const fetchData = async () => {
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
            acc[date].push({ ...fullCostume, quantity: washingItem.quantity, status: washingItem.status })
          }
          return acc
        }, {})

        setAvailableCostumes(allCostumes)
        setSelectedCostumes(mappedCostumes)
        initializeDateSelections(mappedCostumes)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {

    // socket.on("washingUpdated",(data)=>{
    //   console.log("Received update:", data);
    // })
    fetchData()
  }, [])

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

        });
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ date: date, id: id })
      });

      if (res.ok) {
        const message = await res.json();
        toast.success(message.message);
       

      }else{
        const message = await res.json();
        if(message.error){
          toast.warning(message.error);
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ date: [date], costumes: costumes })
      })

      if (res.ok) {
        const message = await res.json();
        toast.success(message.message)
           

    }

      

    } catch (error) {
      console.log(error)
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
            <Badge variant={costume.status === "Cleaned" ? "success" : "destructive"}>
              {costume.status}
            </Badge>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            <div>Cupboard: {costume.cpname}</div>
            <div>Color: {costume.description}</div>
            <div className="flex items-center gap-2 mt-2">
              <span>Quantity: {costume.quantity}</span>
            </div>
          </div>
        </div>
        {showActions && (
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-2"
            onClick={() => handleRemoveCostume(date, costume.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto bg-gray-100 min-h-screen">
      <Card className="shadow-lg bg-white">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Shirt className="h-6 md:h-8 w-6 md:w-8 text-gray-900" />
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">Costume Washing</CardTitle>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 w-full md:w-auto">
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
                              <Checkbox />
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
                      className="bg-gray-900 hover:bg-gray-800 w-full md:w-auto"
                    >
                      Add Selected
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-6 overflow-auto">

          {Object.entries(selectedCostumes).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, costumes]) => (
              <div key={date} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={dateSelections[date]?.dateSelected || false}
                      onCheckedChange={(checked) => handleDateSelection(date, checked)}
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
                    className="bg-gray-900 hover:bg-gray-950 text-white"
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
                        <TableHead className="text-start" >status</TableHead>
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
                          <TableCell className="text-start"> <Badge variant={costume.status === "Cleaned" ? "success" : "destructive"}>
                            {costume.status}
                          </Badge></TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveCostume(date, costume.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
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
    </div>
  )
}

export default Washing

