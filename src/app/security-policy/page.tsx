import { ActiveGrid } from "@/components/ui/ActiveGrid";
import { HUDFrame } from "@/components/ui/HUDFrame";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { NeonButton } from "@/components/ui/NeonButton";
import { Shield, AlertTriangle, Mail, Clock, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Security Policy | Mohammad Raouf Abedini",
  description: "Security vulnerability disclosure policy and responsible disclosure guidelines.",
};

export default function SecurityPolicyPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-x-hidden">
      <ActiveGrid />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-cyan mb-2">
            <Shield className="w-4 h-4" />
            <span className="font-mono text-xs tracking-widest uppercase text-cyan/70">Security Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            <DecryptedText text="Security Policy" />
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Responsible disclosure guidelines for reporting security vulnerabilities.
          </p>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Quick Contact */}
          <HUDFrame className="p-6 md:p-8 bg-cyan-500/5 border-l-4 border-l-cyan">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan" /> Report a Vulnerability
                </h2>
                <p className="text-zinc-400">
                  Found a security issue? Contact me directly at{" "}
                  <a href="mailto:raoof.r12@gmail.com" className="text-cyan hover:underline">
                    raoof.r12@gmail.com
                  </a>
                </p>
              </div>
              <NeonButton href="mailto:raoof.r12@gmail.com" variant="primary">
                <Mail className="w-4 h-4 mr-2" /> SEND_REPORT
              </NeonButton>
            </div>
          </HUDFrame>

          {/* Scope */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan font-mono">01.</span> Scope
            </h2>
            <HUDFrame className="p-6 bg-zinc-900/50">
              <p className="text-zinc-400 mb-4">
                This security policy applies to the following assets:
              </p>
              <ul className="space-y-2 text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                  <span><code className="text-cyan">raoof128.github.io/Portfolio</code> - This portfolio website</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                  <span>Any open-source repositories under <code className="text-cyan">github.com/Raoof128</code></span>
                </li>
              </ul>
            </HUDFrame>
          </section>

          {/* In Scope */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan font-mono">02.</span> What to Report
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <HUDFrame className="p-6 bg-zinc-900/50">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" /> In Scope
                </h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>Cross-Site Scripting (XSS)</li>
                  <li>Cross-Site Request Forgery (CSRF)</li>
                  <li>Security misconfigurations</li>
                  <li>Information disclosure</li>
                  <li>Authentication/authorization flaws</li>
                  <li>Injection vulnerabilities</li>
                </ul>
              </HUDFrame>
              <HUDFrame className="p-6 bg-zinc-900/50">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" /> Out of Scope
                </h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>Social engineering attacks</li>
                  <li>Physical security issues</li>
                  <li>Denial of Service (DoS/DDoS)</li>
                  <li>Spam or phishing attempts</li>
                  <li>Issues in third-party services</li>
                  <li>Rate limiting issues</li>
                </ul>
              </HUDFrame>
            </div>
          </section>

          {/* Response Timeline */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan font-mono">03.</span> Response Timeline
            </h2>
            <HUDFrame className="p-6 bg-zinc-900/50">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 shrink-0">
                    <Clock className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Initial Response: 48-72 hours</h4>
                    <p className="text-zinc-400 text-sm">I will acknowledge receipt of your report and provide an initial assessment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 shrink-0">
                    <Shield className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Resolution: 7-30 days</h4>
                    <p className="text-zinc-400 text-sm">Depending on severity, I will work to resolve the issue within this timeframe.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan/10 border border-cyan/30 shrink-0">
                    <CheckCircle className="w-5 h-5 text-cyan" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold">Disclosure: Coordinated</h4>
                    <p className="text-zinc-400 text-sm">We will coordinate public disclosure after the fix is deployed.</p>
                  </div>
                </div>
              </div>
            </HUDFrame>
          </section>

          {/* Guidelines */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan font-mono">04.</span> Responsible Disclosure Guidelines
            </h2>
            <HUDFrame className="p-6 bg-zinc-900/50">
              <ul className="space-y-3 text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">1.</span>
                  <span>Do not access, modify, or delete data that does not belong to you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">2.</span>
                  <span>Do not perform attacks that could harm the availability of services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">3.</span>
                  <span>Provide sufficient information to reproduce the vulnerability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">4.</span>
                  <span>Give reasonable time to address the issue before public disclosure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan mt-1">5.</span>
                  <span>Act in good faith and avoid privacy violations.</span>
                </li>
              </ul>
            </HUDFrame>
          </section>

          {/* Encryption */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan font-mono">05.</span> Encrypted Communication
            </h2>
            <HUDFrame className="p-6 bg-zinc-900/50">
              <p className="text-zinc-400 mb-4">
                For sensitive reports, you can encrypt your message using my PGP key:
              </p>
              <Link 
                href="/pgp-key.txt" 
                className="inline-flex items-center text-cyan hover:underline font-mono text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Download PGP Public Key
              </Link>
            </HUDFrame>
          </section>

          {/* Acknowledgments */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-cyan font-mono">06.</span> Acknowledgments
            </h2>
            <HUDFrame className="p-6 bg-zinc-900/50">
              <p className="text-zinc-400 mb-4">
                I appreciate responsible security researchers who help improve the security of my projects. 
                Valid reports may be acknowledged in the{" "}
                <Link href="/hall-of-fame" className="text-cyan hover:underline">
                  Security Hall of Fame
                </Link>.
              </p>
              <p className="text-zinc-500 text-sm font-mono">
                Note: This is a personal portfolio project. No monetary bounties are offered, but your contribution will be recognized.
              </p>
            </HUDFrame>
          </section>

        </div>
      </main>
    </div>
  );
}
