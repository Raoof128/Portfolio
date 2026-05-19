"use client";

import { AlertTriangle, Home, Terminal } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { motion } from "framer-motion";
import { scaleIn, fadeInUp, staggerContainer } from "@/lib/utils";
import { useTranslation } from "@/i18n/provider";
import { defaultLocale } from "@/i18n";
import { usePathname } from "next/navigation";
import { getLocaleFromPath } from "@/i18n/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname ?? "");
  const { t } = useTranslation();

  const getPath = (path: string) => {
    if (currentLocale === defaultLocale) return path;
    return `/${currentLocale}${path}`;
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-lg"
      >
        {/* Dramatic 404 scale-in */}
        <motion.div variants={scaleIn} className="relative">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold font-mono text-zinc-900 absolute top-0 left-1/2 -translate-x-1/2 select-none blur-sm">404</h1>
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold font-mono text-white relative z-10">404</h1>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-cyan/50 animate-scanline" />
        </motion.div>

        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs rounded-sm">
            <AlertTriangle className="w-3 h-3" />
            <span>ERROR_CODE: PAGE_NOT_FOUND</span>
          </div>

          <p className="text-text-body text-lg">
            {t.not_found.description}
          </p>

          <div className="font-mono text-xs text-text-meta bg-black/50 p-4 rounded border border-cyber-gray text-left space-y-1">
            <p><span className="text-purple">root@portfolio:~$</span> ping target_url</p>
            <p>ping: unknown host</p>
            <p><span className="text-purple">root@portfolio:~$</span> trace route</p>
            <p className="text-red-400">Trace failed. Destination unreachable.</p>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <NeonButton href={getPath("/")} variant="primary">
            <Home className="w-4 h-4 mr-2" /> {t.not_found.return_home}
          </NeonButton>
          <NeonButton href={getPath("/projects")} variant="outline">
            <Terminal className="w-4 h-4 mr-2" /> {t.not_found.browse_projects}
          </NeonButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
