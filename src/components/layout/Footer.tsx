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
          <Link href="https://linkedin.com" className="text-zinc-500 hover:text-cyan transition-colors">
            <Linkedin className="w-5 h-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="mailto:contact@raouf.sh" className="text-zinc-500 hover:text-cyan transition-colors">
            <Mail className="w-5 h-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600">
          <span>SECURE_CONNECTION_ESTABLISHED</span>
          <span className="w-2 h-2 bg-green-900 rounded-full animate-pulse border border-green-500/50" />
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
