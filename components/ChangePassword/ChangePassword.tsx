import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Lock, Shield, CheckCircle2 } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { toast } from "@/hooks/use-toast";
import { PasswordStrengthIndicator } from "../PasswordStrengthIndicator/PasswordStrengthIndicator";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
type ChangePasswordProps = {
    openPassword: boolean;
    setOpenPassword: (open: boolean) => void;
}
const ChangePassword = ({ openPassword, setOpenPassword }: ChangePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

    const passwordsMatch =
    Boolean(newPassword) &&
    Boolean(confirmPassword) &&
    newPassword === confirmPassword;

    const passwordsDontMatch =
    Boolean(confirmPassword) &&
    newPassword !== confirmPassword;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    toast({
      title: "Password changed!",
      description: "Your password has been updated successfully.",
    });
  };

  return (
    <Dialog open={openPassword} onOpenChange={setOpenPassword}>
        <DialogContent
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-[300px] max-w-full xs:h-auto h-full xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] bg-white/50 border-none [&>button]:hidden gap-0 block z-200 rounded-2xl lg:h-full h-full m-auto">
            <div className="rounded-2xl px-4 shadow-none border-0 w-full max-w-full relative bg-[#fff] lg:h-full h-full overflow-y-scroll custom-scroll-password">
                <DialogTitle className="text-white hidden">
                    Confirm email screens
                </DialogTitle>
                <DialogClose asChild className="z-[999]">
                    <X size={30} fill="#000" className="fixed top-[20px] right-[20px] text-[#000] opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0"/>
                </DialogClose>
           
            <Card className="w-full max-w-md shadow-none border-0 animate-scale-in">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-xl bg-[#fff2e5]">
                <Shield className="h-8 w-8 text-[#ff8000]" />
                </div>
                <CardTitle className="text-2xl font-bold text-[#000]">Change Password</CardTitle>
                <CardDescription className="text-[#6c7993]">
                Keep your account secure with a strong password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-[#000] text-sm font-medium block !mb-3">
                    Current Password
                    </Label>
                    <PasswordInput
                    id="current-password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-[#000] text-sm font-medium block !mb-3">
                    New Password
                    </Label>
                    <PasswordInput
                    id="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={setNewPassword}
                    className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10"
                    />
                    <PasswordStrengthIndicator password={newPassword} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-[#000] text-sm font-medium block !mb-3">
                    Confirm New Password
                    </Label>
                    <div className="relative">
                    <PasswordInput
                        id="confirm-password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] pr-10 ${
                        passwordsDontMatch 
                            ? "focus-visible:ring-[#e1474620] ring-1 ring-[#e1474650]" 
                            : "focus-visible:ring-[#4b63e720]"
                        }`}
                    />
                    {passwordsMatch && (
                        <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-[#22c378] animate-fade-in" />
                    )}
                    </div>
                    {passwordsDontMatch && (
                    <p className="text-xs text-[#e14747] animate-fade-in">
                        Passwords do not match
                    </p>
                    )}
                </div>

                <Button 
                    type="submit" 
                    className="!cursor-pointer w-full h-12 text-base font-semibold "
                    variant="auth"
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || passwordsDontMatch}
                >
                    {isLoading ? (
                    <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full text-[#000] animate-spin" />
                        Updating...
                    </span>
                    ) : (
                    <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Update Password
                    </span>
                    )}
                </Button>
                </form>

                <div className="mt-6 p-4 rounded-xl bg-[#edeff34d] border border-border/50">
                <h4 className="text-sm font-medium mb-2 text-[#000]">Password Requirements</h4>
                <ul className="text-xs text-[#6c7993] space-y-1">
                    <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${newPassword.length >= 8 ? "bg-[#22c378]" : "bg-[#6c79934d]"}`} />
                    At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "bg-[#22c378]" : "bg-[#6c79934d]"}`} />
                    Upper and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${/\d/.test(newPassword) ? "bg-[#22c378]" : "bg-[#6c79934d]"}`} />
                    At least one number
                    </li>
                    <li className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(newPassword) ? "bg-[#22c378]" : "bg-[#6c79934d]"}`} />
                    Special character (!@#$%^&*)
                    </li>
                </ul>
                </div>
            </CardContent>
            </Card>
             </div>
        </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;