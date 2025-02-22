import Link from "next/link";
import QRScanner from "./qr-scanner";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

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
      <footer className="mt-8 text-center">
        <p className="text-sm">Made with ❤️ by Kevin Samson</p>
        <a
          href="https://github.com/kevin-samson/QuickQrSender"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-2"
        >
          <Github className="mr-2" />
          GitHub
        </a>
      </footer>
    </main>
  );
}
