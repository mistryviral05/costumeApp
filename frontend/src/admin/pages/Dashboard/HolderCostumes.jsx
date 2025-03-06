import React, { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Package, Check, SplitIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SocketContext } from '@/Context/SocketContext';
import { toast } from 'sonner';

const HolderCostumeDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [holder, setHolder] = useState({});
  const [costumes, setCostumes] = useState([]);
  const [returnStatus, setReturnStatus] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [returnQuantities, setReturnQuantities] = useState({});
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    const handleFetchUpdate = (data) => {
      // Check if the update is for the current holder
      if (data.holderId !== params.id) return;

      console.log("Socket update received:", data);

      // Update costumes state using only backend-provided status
      setCostumes((prev) =>
        prev.map((costume) => {
          const updatedCostume = data.costumes.find((c) => c.id === costume.id);
          if (updatedCostume) {
            const quantities = updatedCostume.returnQuantities || {};
            console.log(updatedCostume)
            return {
              ...costume,
              status: updatedCostume.status, // Use status directly from backend
              quantity: updatedCostume.totalQuantity || costume.quantity,
              good: quantities.good ?? costume.good,
              damaged: quantities.damaged ?? costume.damaged,
              lost: quantities.lost ?? costume.lost,
              pending: quantities.pending ?? costume.pending,
            };
          }
          return costume;
        })
      );

      // Update returnQuantities state
      setReturnQuantities((prev) => {
        const updatedQuantities = { ...prev };
        data.costumes.forEach((updatedCostume) => {
          if (updatedCostume.id in updatedQuantities) {
            const quantities = updatedCostume.returnQuantities || {};
            updatedQuantities[updatedCostume.id] = {
              good: quantities.good ?? prev[updatedCostume.id].good,
              damaged: quantities.damaged ?? prev[updatedCostume.id].damaged,
              lost: quantities.lost ?? prev[updatedCostume.id].lost,
              pending: quantities.pending ?? prev[updatedCostume.id].pending,
            };
          }
        });
        return updatedQuantities;
      });

      toast.info(`Costume status updated for ${data.holderName || 'holder'}`);
    };

    socket.on("updateCostumeStatus", handleFetchUpdate);

    return () => {
      socket.off("updateCostumeStatus", handleFetchUpdate);
    };
  }, [socket, params.id]);




  const handleSaveReturnStatus = async () => {
    // Filter only the selected costumes
    const selectedCostumes = costumes.filter(costume => selectedItems[costume.id] === true);

    // If no costumes are selected, show a warning and return early
    if (selectedCostumes.length === 0) {
      toast.warning('No costumes selected to save.');
      return;
    }

    const returnData = {
      holderId: params.id,
      holderName: holder.personname,
      holderphonenumber:holder.contact,
      costumes: selectedCostumes.map(costume => ({
        id: costume.id,
        name: costume.costumename,
        totalQuantity: costume.quantity,
        returnQuantities: {
          good: returnQuantities[costume.id]?.good || 0,
          damaged: returnQuantities[costume.id]?.damaged || 0,
          lost: returnQuantities[costume.id]?.lost || 0,
          pending: returnQuantities[costume.id]?.pending || 0
        },
        selected: true // Since we're only sending selected items, this can be hardcoded
      })),
      selectedCount: selectedCostumes.length, // Use the filtered length
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/updateReturnStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success('Return status saved successfully!');
    } catch (error) {
      console.error('Error saving return status:', error);
      toast.error('Failed to save return status. Please try again.');
    }
  };

  // Handle direct quantity input
  const handleQuantityChange = (id, status, value) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [status]: value,
      },
    }));
  };



  const handleSelectItem = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getSelectedCount = () => {
    return Object.values(selectedItems).filter(Boolean).length;
  };

  const handleBulkAction = (status) => {
    const updatedQuantities = { ...returnQuantities };

    costumes.forEach((costume) => {
      if (selectedItems[costume.id]) {
        updatedQuantities[costume.id] = {
          good: 0,
          damaged: 0,
          lost: 0,
          pending: 0,
          [status]: costume.quantity, // Set full quantity to the chosen status
        };
      }
    });

    setReturnQuantities(updatedQuantities);
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getAssignedDetailsById/${params.id}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch assigned details");

      const data = await res.json();
      setHolder(data.data.assignedTo);

      const costumeDetails = await Promise.all(
        data.data.costumes.map(async (item) => {
          const costumeRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/costumes/${item.id}`);
          if (costumeRes.ok) {
            const costumeData = await costumeRes.json();
            const costume = costumeData.data[Object.keys(costumeData.data)[0]] || costumeData.data;
            return {
              ...costume,
              quantity: item.quantity,
              status: item.status,
              good: item.good || 0,
              damaged: item.damaged || 0,
              pending: item.pending || 0,
              lost: item.lost || 0,
            };
          }
          return null;
        })
      );

      const validCostumes = costumeDetails.filter(costume => costume !== null);
      setCostumes(validCostumes);

      const initialQuantities = {};
      validCostumes.forEach(costume => {
        if (costume && costume.id) {
          initialQuantities[costume.id] = {
            good: costume.good || 0,
            damaged: costume.damaged || 0,
            lost: costume.lost || 0,
            pending: costume.pending || 0,
          };
        }
      });
      setReturnQuantities(initialQuantities);

      const initialSelectedState = {};
      validCostumes.forEach(costume => {
        if (costume && costume.id) {
          initialSelectedState[costume.id] = false;
        }
      });
      setSelectedItems(initialSelectedState);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB");
  };



  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to List</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl sm:text-2xl">{holder.personname}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-black flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-black font-medium">Email</p>
                  <p className="text-sm font-medium truncate">{holder.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-black flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-black font-medium">Contact</p>
                  <p className="text-sm font-medium truncate">{holder.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-black flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-black font-medium">Refrence</p>
                  <p className="text-sm font-medium truncate">{holder.Refrence}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-black flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-black font-medium">Return By</p>
                  <p className="text-sm font-medium">{formatDate(holder.deadline)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Costume List Card */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 gap-2">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Package className="h-5 w-5" />
              Rented Costumes
            </CardTitle>
            <Badge variant="outline" className="sm:ml-2">
              {costumes.length} {costumes.length === 1 ? 'Item' : 'Items'}
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            {/* Bulk Action Bar */}
            <div className="p-3 sm:p-4 border-y border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  onCheckedChange={(checked) => {
                    const newSelectedState = {};
                    costumes.forEach(costume => {
                      if (costume && costume.id) {
                        newSelectedState[costume.id] = !!checked;
                      }
                    });
                    setSelectedItems(newSelectedState);
                  }}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Select All ({getSelectedCount()} selected)
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                  onClick={() => handleBulkAction('good')}
                  disabled={getSelectedCount() === 0}
                >
                  Mark Good
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                  onClick={() => handleBulkAction('damaged')}
                  disabled={getSelectedCount() === 0}
                >
                  Mark Damaged
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
                  onClick={() => handleBulkAction('lost')}
                  disabled={getSelectedCount() === 0}
                >
                  Mark Lost
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                  onClick={() => handleBulkAction('pending')}
                  disabled={getSelectedCount() === 0}
                >
                  Mark Pending
                </Button>

                <Select disabled={getSelectedCount() === 0}>
                  <SelectTrigger className="w-full sm:w-[150px] h-9">
                    <SelectValue placeholder="More Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="return">Return Selected</SelectItem>
                    <SelectItem value="extend">Extend Rental</SelectItem>
                    <SelectItem value="cancel">Cancel Rental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Responsive Table/Card View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] p-2">
                      <span className="sr-only">Select</span>
                    </TableHead>
                    <TableHead className="w-[60px] p-2 hidden sm:table-cell">Image</TableHead>
                    <TableHead className="p-2">Costume Name</TableHead>
                    <TableHead className="p-2 text-center hidden md:table-cell">Qty</TableHead>
                    <TableHead className="p-2 text-center">Status</TableHead>
                    <TableHead className="p-2 text-center hidden lg:table-cell">Return Status</TableHead>
                    <TableHead className="p-2 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costumes.map((costume, idx) => (
                    <TableRow key={costume.id || idx} className="align-middle">
                      <TableCell className="p-2">
                        <Checkbox
                          id={`select-${costume.id}`}
                          checked={selectedItems[costume.id] || false}
                          onCheckedChange={() => handleSelectItem(costume.id)}
                        />
                      </TableCell>
                      <TableCell className="p-2 hidden sm:table-cell">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={costume.fileUrl}
                            alt={costume.costumename}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="p-2 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md overflow-hidden sm:hidden">
                            <img
                              src={costume.fileUrl}
                              alt={costume.costumename}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>{costume.costumename}</span>
                          <span className="text-xs text-gray-500 md:hidden">({costume.quantity})</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2 text-center hidden md:table-cell">{costume.quantity}</TableCell>
                      <TableCell className="p-2 text-center">
                        <Badge
                          variant={costume.status === "returned" ? "success" : 
                            costume.status === "partially returned" ? "warning" : 
                            "secondary"}
                          className={costume.status === "returned" 
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : costume.status === "partially returned"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                        >
                          {costume.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2 hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            Good: {returnQuantities[costume.id]?.good || 0}
                          </Badge>
                          <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                            Damaged: {returnQuantities[costume.id]?.damaged || 0}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                            Lost: {returnQuantities[costume.id]?.lost || 0}
                          </Badge>
                          <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                            Pending: {returnQuantities[costume.id]?.pending || 0}
                          </Badge>
                          <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                            (Remaining: {costume.status === "returned" ? 0 :
                              costume.quantity -
                              ((returnQuantities[costume.id]?.good || 0) +
                                (returnQuantities[costume.id]?.damaged || 0) +
                                (returnQuantities[costume.id]?.lost || 0) +
                                (returnQuantities[costume.id]?.pending || 0))
                            })
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center justify-center gap-1">
                          {['good', 'damaged', 'lost', 'pending'].map((status) => (
                            <div key={status} className="w-10 sm:w-16">
                              <Input
                                id={`${status}-${costume.id}`}
                                type="number"
                                min="0"
                                max={costume.quantity}
                                value={returnQuantities[costume.id]?.[status] || 0}
                                onChange={(e) => handleQuantityChange(costume.id, status, parseInt(e.target.value) || 0)}
                                className={`h-7 text-xs text-center border-${status === 'good' ? 'green' :
                                  status === 'damaged' ? 'red' :
                                    status === 'lost' ? 'purple' :
                                      'orange'
                                  }-200`}
                                title={status.charAt(0).toUpperCase() + status.slice(1)}
                              />
                              <span className="text-xs hidden sm:block text-center text-gray-500">
                                {status.charAt(0).toUpperCase() + status.slice(1).substring(0, 3)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {costumes.map((costume, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-200 px-4 py-6 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <Checkbox
                      id={`mobile-select-${costume.id}`}
                      checked={selectedItems[costume.id] || false}
                      onCheckedChange={() => handleSelectItem(costume.id)}
                      className="mt-0"
                    />

                    {/* Image */}
                    <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={costume.fileUrl}
                        alt={costume.costumename}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Title and Status */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {costume.costumename}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={costume.status === "returned" ? "success" : "secondary"}
                            className={
                              costume.status === "returned"
                                ? "bg-green-100 text-green-800 text-xs px-2 py-0.5"
                                : "bg-gray-100 text-gray-800 text-xs px-2 py-0.5"
                            }
                          >
                            {costume.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 text-xs px-2 py-0.5"
                          >
                            Qty: {costume.quantity}
                          </Badge>
                        </div>
                      </div>

                      {/* Status Quantities */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Badge
                          variant="outline"
                          className="bg-green-50 border-green-200 text-green-700 py-1 justify-center"
                        >
                          Good: {returnQuantities[costume.id]?.good || 0}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-red-50 border-red-200 text-red-700 py-1 justify-center"
                        >
                          Damaged: {returnQuantities[costume.id]?.damaged || 0}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-50 border-purple-200 text-purple-700 py-1 justify-center"
                        >
                          Lost: {returnQuantities[costume.id]?.lost || 0}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 border-orange-200 text-orange-700 py-1 justify-center"
                        >
                          Pending: {returnQuantities[costume.id]?.pending || 0}
                        </Badge>
                      </div>

                      {/* Remaining */}
                      <div className="text-xs text-gray-600">
                        Remaining: {costume.quantity -
                          ((returnQuantities[costume.id]?.good || 0) +
                            (returnQuantities[costume.id]?.damaged || 0) +
                            (returnQuantities[costume.id]?.lost || 0) +
                            (returnQuantities[costume.id]?.pending || 0))}
                      </div>

                      {/* Input Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Good', color: 'green', key: 'good' },
                          { label: 'Damaged', color: 'red', key: 'damaged' },
                          { label: 'Lost', color: 'purple', key: 'lost' },
                          { label: 'Pending', color: 'orange', key: 'pending' }
                        ].map(({ label, color, key }) => (
                          <div key={key} className="space-y-1">
                            <label
                              htmlFor={`mobile-${key}-${costume.id}`}
                              className={`block text-xs font-medium text-${color}-700`}
                            >
                              {label}
                            </label>
                            <Input
                              id={`mobile-${key}-${costume.id}`}
                              type="number"
                              min="0"
                              max={costume.quantity}
                              value={returnQuantities[costume.id]?.[key] || 0}
                              onChange={(e) => handleQuantityChange(costume.id, key, parseInt(e.target.value) || 0)}
                              className={`h-8 text-sm border-${color}-200 focus:ring-${color}-500`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Bar */}
        <div className="flex justify-end mt-4 sm:mt-6">
          <Button
            className="bg-gray-900 hover:bg-gray-950 text-white w-full sm:w-auto"
            disabled={getSelectedCount() === 0}
            onClick={handleSaveReturnStatus}
          >
            Save Return Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HolderCostumeDetails;