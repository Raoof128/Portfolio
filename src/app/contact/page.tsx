import { SecureContactForm } from "@/components/ui/SecureContactForm"
import { Github, Linkedin } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="flex-1 container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-white">
            Open <span className="text-cyan-500">Secure Channel</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
            Initiate encrypted communication. 
            <br className="hidden md:block" />
            Response times vary based on operational load.
          </p>
        </div>

        {/* The Keylogger Form */}
        <SecureContactForm />

        {/* Alternate Comms */}
        <div className="flex justify-center gap-6 pt-4 border-t border-white/5">
          <Link href="https://github.com/Raoof128" className="flex items-center text-zinc-500 hover:text-cyan-400 transition-colors font-mono text-xs">
            <Github className="w-4 h-4 mr-2" /> GITHUB_FREQ
          </Link>
          <Link href="https://linkedin.com" className="flex items-center text-zinc-500 hover:text-cyan-400 transition-colors font-mono text-xs">
            <Linkedin className="w-4 h-4 mr-2" /> LINKEDIN_FREQ
          </Link>
        </div>

      </div>
    </div>
  )
}