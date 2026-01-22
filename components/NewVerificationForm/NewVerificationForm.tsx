"use client";
import { Loader } from "lucide-react";
import { Card } from "../ui/card";
export const NewVerificationForm = () => {
return (
    <Card className="w-full max-w-md p-6">
        <div className="flex items-center w-full justify-center">
            <Loader />
        </div>
    </Card>
);
};