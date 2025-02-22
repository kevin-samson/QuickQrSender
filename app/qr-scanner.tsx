"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [permissionState, setPermissionState] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setPermissionState(result.state);
      result.onchange = () => setPermissionState(result.state);
    } catch (error) {
      console.error("Error checking camera permission:", error);
      setPermissionState("prompt");
    }
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionState("granted");
      setErrorMessage(null);
    } catch (error) {
      console.error("Camera permission denied:", error);
      setPermissionState("denied");
      setErrorMessage(
        "Camera permission was denied. Please grant permission and try again."
      );
    }
  };

  const startScanning = async () => {
    setErrorMessage(null);
    hasScannedRef.current = false;
    if (permissionState !== "granted") {
      await requestPermission();
      return;
    }

    try {
      if (scannerRef.current === null) {
        scannerRef.current = new Html5Qrcode("reader");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdgePercentage = 0.7; // 70%
            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
            return { width: qrboxSize, height: qrboxSize };
          },
        },
        onScanSuccess,
        onScanError
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
      setErrorMessage("Failed to start the scanner. Please try again.");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
        setErrorMessage("Failed to stop the scanner. Please refresh the page.");
      }
    }
  };

  function onScanSuccess(result: string) {
    if (!hasScannedRef.current) {
      hasScannedRef.current = true;
      sendToWhatsApp(result);
      stopScanning();
    }
  }

  function onScanError(err: any) {
    console.warn(err);
  }

  const sendToWhatsApp = (scanResult: string) => {
    const savedConfig = localStorage.getItem("qrScannerConfig");
    let whatsappUrl = `https://wa.me/?text=${encodeURIComponent(scanResult)}`;

    if (savedConfig) {
      const { phoneNumber } = JSON.parse(savedConfig);
      if (phoneNumber) {
        whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          scanResult
        )}`;
      }
    }

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div id="reader" className="w-full aspect-square bg-muted relative">
          {isScanning && (
            <Button
              variant="destructive"
              onClick={stopScanning}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
            >
              <XCircle className="mr-2 h-4 w-4" /> Stop Scanning
            </Button>
          )}
        </div>
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-center">
          {permissionState !== "granted" && (
            <Button onClick={requestPermission} className="w-full">
              <Camera className="mr-2 h-4 w-4" /> Request Camera Permission
            </Button>
          )}
          {permissionState === "granted" && !isScanning && (
            <Button onClick={startScanning} className="w-full">
              <Camera className="mr-2 h-4 w-4" /> Start Scanning
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isScanning && (
          <p className="text-center">
            Click on stop scanning after sending the QR code
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
