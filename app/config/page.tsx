"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Config() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  useEffect(() => {
    const savedConfig = localStorage.getItem("qrScannerConfig")
    if (savedConfig) {
      setPhoneNumber(JSON.parse(savedConfig).phoneNumber || "")
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("qrScannerConfig", JSON.stringify({ phoneNumber }))
    router.push("/")
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Configure QR Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Default WhatsApp Number or Group ID</Label>
            <Input
              id="phone"
              type="text"
              placeholder="Enter phone number with country code or group ID"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

