"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function SignUp() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 p-6">
          <Input placeholder="First Name" {...register("firstName")} />
          <Input placeholder="Last Name" {...register("lastName")} />
          <Input placeholder="Email" {...register("email")} />
          <Button className="w-full">Send OTP</Button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
