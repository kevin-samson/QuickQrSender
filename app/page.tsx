import Link from "next/link"
import QRScanner from "./qr-scanner"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">QR Scanner</h1>
      <QRScanner />
      <div className="mt-4 text-center">
        <Link href="/config">
          <Button variant="outline">Configure</Button>
        </Link>
      </div>
    </main>
  )
}

