"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface UpgradePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradePromptDialog({ open, onOpenChange }: UpgradePromptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Weekly limit reached</DialogTitle>
          <DialogDescription>
            You&apos;ve used all 20 free credits this week. Upgrade to Pro for unlimited scans.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Unlimited scans across all modules
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Button className="w-full gradient">
            Upgrade to Pro
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
