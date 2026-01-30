import { NeonButton } from "@/components/ui/NeonButton"
import { Mail, Github, Linkedin, Terminal } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex-1 container mx-auto px-4 md:px-6 py-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl border border-white/10 bg-white/5 p-8 md:p-12 relative overflow-hidden">
        {/* Decorative HUD corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan/50" />

        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan/10 text-cyan mb-4">
            <Mail size={32} />
          </div>

          <h1 className="text-4xl font-mono font-bold text-white">Get In Touch</h1>

          <p className="text-zinc-400 text-lg">
            I&apos;m always interested in hearing about new projects, security research, or developer tools.
          </p>

          <div className="grid gap-4 w-full max-w-sm mx-auto">
            <NeonButton href="mailto:hello@raouf.sh" variant="primary" className="w-full justify-center">
              <Mail size={16} className="mr-2" /> hello@raouf.sh
            </NeonButton>

            <div className="grid grid-cols-2 gap-4">
              <NeonButton href="https://github.com/Raoof128" variant="secondary" className="w-full justify-center">
                <Github size={16} className="mr-2" /> GitHub
              </NeonButton>
              <NeonButton href="https://linkedin.com" variant="secondary" className="w-full justify-center">
                <Linkedin size={16} className="mr-2" /> LinkedIn
              </NeonButton>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8">
            <div className="font-mono text-sm text-zinc-500">
              <Terminal size={14} className="inline mr-2" />
              <span>status: open_for_opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
