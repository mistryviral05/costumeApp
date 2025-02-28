import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Package, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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

const HolderCostumeDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [holder, setHolder] = useState({});
  const [costumes, setCostumes] = useState([]);
  const [returnStatus, setReturnStatus] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const handleReturn = (costumeId, condition) => {
    setReturnStatus(prev => ({
      ...prev,
      [costumeId]: condition
    }));
  };

  const handleSelectItem = (costumeId) => {
    setSelectedItems(prev => ({
      ...prev,
      [costumeId]: !prev[costumeId]
    }));
  };

  const handleBulkAction = (action) => {
    const selectedCostumeIds = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    selectedCostumeIds.forEach(id => {
      handleReturn(id, action);
    });
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/getAssignedDetailsById/${params.id}`, { method: "GET" });
  
      if (res.ok) {
        const data = await res.json();
        setHolder(data.data.assignedTo);
  
        const costumeDetails = await Promise.all(
          data.data.costumes.map(async (item) => {
            const costumeRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cpdetails/costumes/${item.id}`);
            if (costumeRes.ok) {
              const costumeData = await costumeRes.json();
              const costume = costumeData.data[Object.keys(costumeData.data)[0]] || costumeData.data;
              return { ...costume, quantity: item.quantity };
            }
            return null;
          })
        );
       
        setCostumes(costumeDetails);
        
        const initialSelectedState = {};
        costumeDetails.forEach(costume => {
          if (costume && costume.id) {
            initialSelectedState[costume.id] = false;
          }
        });
        setSelectedItems(initialSelectedState);
      }
    } catch (err) {
      console.log(err);
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

  const getSelectedCount = () => {
    return Object.values(selectedItems).filter(Boolean).length;
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
                  <p className="text-xs text-black font-medium">Address</p>
                  <p className="text-sm font-medium truncate">{holder.address}</p>
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
                  className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
                  onClick={() => handleBulkAction('medium')}
                  disabled={getSelectedCount() === 0}
                >
                  Mark Medium
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
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Costume Name</TableHead>
                    <TableHead className="w-20 text-center">Qty</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-32">Return Condition</TableHead>
                    <TableHead className="w-32 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costumes.map((costume, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="pl-4">
                        <Checkbox 
                          id={`select-${costume.id}`}
                          checked={selectedItems[costume.id] || false}
                          onCheckedChange={() => handleSelectItem(costume.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="h-12 w-12 rounded-md overflow-hidden">
                          <img 
                            src={costume.fileUrl}
                            alt={costume.costumename}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{costume.costumename}</TableCell>
                      <TableCell className="text-center">{costume.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={costume.status === 'Active' ? "success" : "secondary"} className="bg-green-100 text-green-800 hover:bg-green-100">
                          {costume.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-start">
                        {returnStatus[costume.id] && (
                          <Badge variant="outline" className={
                            returnStatus[costume.id] === 'good' ? "bg-green-50 border-green-200 text-green-700" :
                            returnStatus[costume.id] === 'medium' ? "bg-yellow-50 border-yellow-200 text-yellow-700" : 
                            "bg-red-50 border-red-200 text-red-700"
                          }>
                            {returnStatus[costume.id].charAt(0).toUpperCase() + returnStatus[costume.id].slice(1)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            className={
                              returnStatus[costume.id] === 'good' 
                                ? "bg-green-100 border-green-300 text-green-800" 
                                : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            }
                            onClick={() => handleReturn(costume.id, 'good')}
                          >
                            {returnStatus[costume.id] === 'good' && (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            Good
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className={
                              returnStatus[costume.id] === 'medium' 
                                ? "bg-yellow-100 border-yellow-300 text-yellow-800" 
                                : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                            }
                            onClick={() => handleReturn(costume.id, 'medium')}
                          >
                            {returnStatus[costume.id] === 'medium' && (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            Medium
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className={
                              returnStatus[costume.id] === 'damaged' 
                                ? "bg-red-100 border-red-300 text-red-800" 
                                : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            }
                            onClick={() => handleReturn(costume.id, 'damaged')}
                          >
                            {returnStatus[costume.id] === 'damaged' && (
                              <Check className="h-3 w-3 mr-1" />
                            )}
                            Damaged
                          </Button>
                        </div>
                      </TableCell>
                    
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden">
              {costumes.map((costume, idx) => (
                <div key={idx} className="border-b border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id={`mobile-select-${costume.id}`}
                      checked={selectedItems[costume.id] || false}
                      onCheckedChange={() => handleSelectItem(costume.id)}
                      className="mt-1"
                    />
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={costume.fileUrl}
                        alt={costume.costumename}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium mb-1">{costume.costumename}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant={costume.status === 'Active' ? "success" : "secondary"} className="bg-green-100 text-green-800 hover:bg-green-100">
                          {costume.status}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100">
                          Qty: {costume.quantity}
                        </Badge>
                        {returnStatus[costume.id] && (
                          <Badge variant="outline" className={
                            returnStatus[costume.id] === 'good' ? "bg-green-50 border-green-200 text-green-700" :
                            returnStatus[costume.id] === 'medium' ? "bg-yellow-50 border-yellow-200 text-yellow-700" : 
                            "bg-red-50 border-red-200 text-red-700"
                          }>
                            {returnStatus[costume.id].charAt(0).toUpperCase() + returnStatus[costume.id].slice(1)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button 
                          size="sm"
                          variant="outline"
                          className={
                            returnStatus[costume.id] === 'good' 
                              ? "bg-green-100 border-green-300 text-green-800" 
                              : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          }
                          onClick={() => handleReturn(costume.id, 'good')}
                        >
                          {returnStatus[costume.id] === 'good' && (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          Good
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className={
                            returnStatus[costume.id] === 'medium' 
                              ? "bg-yellow-100 border-yellow-300 text-yellow-800" 
                              : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                          }
                          onClick={() => handleReturn(costume.id, 'medium')}
                        >
                          {returnStatus[costume.id] === 'medium' && (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          Medium
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className={
                            returnStatus[costume.id] === 'damaged' 
                              ? "bg-red-100 border-red-300 text-red-800" 
                              : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          }
                          onClick={() => handleReturn(costume.id, 'damaged')}
                        >
                          {returnStatus[costume.id] === 'damaged' && (
                            <Check className="h-3 w-3 mr-1" />
                          )}
                          Damaged
                        </Button>
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
            disabled={getSelectedCount() === 0 || !Object.keys(returnStatus).length}
          >
            Save Return Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HolderCostumeDetails;