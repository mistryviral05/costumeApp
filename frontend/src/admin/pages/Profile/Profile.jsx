import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

const Profile = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    } else {
      setError("");
      alert("Password changed successfully!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Profile Card */}
      <Card className="w-full max-w-lg shadow-lg p-6 rounded-2xl bg-white border border-gray-200">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="/profile-pic.jpg" alt="Profile" />
            <AvatarFallback>VM</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold text-gray-800">Viral Mistry</h2>
          <p className="text-gray-600">Software Developer</p>
        </CardHeader>
      </Card>

      {/* Change Password Section */}
      <Card className="w-full max-w-lg mt-6 shadow-lg p-6 rounded-2xl bg-white border border-gray-200">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full mt-2" onClick={handleChangePassword}>
            Update Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
