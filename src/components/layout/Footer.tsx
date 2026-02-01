import Link from "next/link";
import { Github, Linkedin, Mail, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center space-x-6">
          <Link href="https://github.com/Raoof128" className="text-zinc-500 hover:text-cyan transition-colors">
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="https://linkedin.com/in/mohammad-raouf-abedini-885a9226a" className="text-zinc-500 hover:text-cyan transition-colors">
            <Linkedin className="w-5 h-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="/contact" className="text-zinc-500 hover:text-cyan transition-colors">
            <Mail className="w-5 h-5" />
            <span className="sr-only">Contact Page</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600">
          <span className="hidden md:inline">System Status: ONLINE</span>
          <span className="hidden md:inline mx-2">|</span>
          <span>Last Index: {new Date().toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}</span>
        </div>

        <div>
          <Link href="/.well-known/security.txt" className="flex items-center text-xs font-mono text-zinc-600 hover:text-cyan transition-colors">
            <Shield className="w-3 h-3 mr-2" />
            security.txt
          </Link>
        </div>

      </div>
    </footer>
  );
}
