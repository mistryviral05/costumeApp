import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Search, Edit, Trash2, Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/clients/userDetails`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditedUser(user);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUsers(users.map(user => user._id === editingUserId ? editedUser : user));
    setEditingUserId(null);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                <TableHead className="px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</TableHead>
                <TableHead className="px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</TableHead>
                <TableHead className="px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</TableHead>
                <TableHead className="px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</TableHead>
                <TableHead className="px-6 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                    {editingUserId === user._id ? (
                      <Input
                        type="text"
                        name="name"
                        value={editedUser.name}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                    {editingUserId === user._id ? (
                      <Input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                    {editingUserId === user._id ? (
                      <Input
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.username
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                    {editingUserId === user._id ? (
                      <Input
                        type="text"
                        name="phonenumber"
                        value={editedUser.phonenumber}
                        onChange={handleEditChange}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      user.phonenumber
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-4">
                      {editingUserId === user._id ? (
                        <Button
                          onClick={handleSave}
                          variant="ghost"
                          className="text-green-600 hover:text-green-800 p-0"
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleEditClick(user)}
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-800 p-0"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-800 p-0"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Users;