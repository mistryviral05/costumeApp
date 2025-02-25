import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function confirm({ open, onOpenChange, title, message, confirmText, cancelText, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-lg font-semibold">{title || "Are you sure?"}</DialogHeader>
        <p className="text-gray-600">{message || "This action cannot be undone."}</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText || "Cancel"}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
