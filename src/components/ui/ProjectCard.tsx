"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn, hoverSpring } from "@/lib/utils";
import { HUDFrame } from "./HUDFrame";
import { NeonButton } from "./NeonButton";
import { ArrowUpRight, Github, Lock, Database, Play } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/provider";

export interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  buildItems: string[];
  secureItems: string[];
  links: {
    demo?: string;
    repo?: string;
    caseStudy?: string;
  };
  featured?: boolean;
}

function toDomId(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProjectCard({
  title,
  description,
  tags,
  buildItems,
  secureItems,
  links,
  featured = false,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"build" | "secure">("build");
  const instanceId = useId();
  const tabs = useRef<
    Partial<Record<"build" | "secure", HTMLButtonElement | null>>
  >({});
  const idBase = `${toDomId(title) || "project"}-${instanceId}`;
  const buildTabId = `${idBase}-tab-build`;
  const secureTabId = `${idBase}-tab-secure`;
  const panelId = `${idBase}-tab-panel`;

  function moveTab(event: KeyboardEvent<HTMLDivElement>) {
    let next: "build" | "secure";
    if (event.key === "Home") next = "build";
    else if (event.key === "End") next = "secure";
    else if (event.key === "ArrowLeft" || event.key === "ArrowRight")
      next = activeTab === "build" ? "secure" : "build";
    else return;
    event.preventDefault();
    setActiveTab(next);
    tabs.current[next]?.focus();
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={hoverSpring}
      className="h-full"
    >
      <HUDFrame
        className={cn("flex flex-col h-full", featured ? "lg:col-span-2" : "")}
        title={t.project_card.module_title}
      >
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold font-mono text-white">
                {title}
              </h3>
              <p className="mt-2 text-text-body leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
            {featured && (
              <div className="hidden sm:block text-xs font-mono text-cyan/70 border border-cyan/30 px-2 py-1">
                {t.project_card.featured_op}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-text-body bg-[#030712]/60 px-2 py-1 border border-cyan/15"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Tabs Control */}
          <div
            className="mt-6 flex border-b border-cyan/12"
            role="tablist"
            onKeyDown={moveTab}
            aria-label={t.project_card.tab_details_aria}
          >
            <button
              id={buildTabId}
              ref={(element) => {
                tabs.current.build = element;
              }}
              role="tab"
              tabIndex={activeTab === "build" ? 0 : -1}
              aria-selected={activeTab === "build"}
              aria-controls={panelId}
              onClick={() => setActiveTab("build")}
              type="button"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-mono transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-cyan/50 rounded-t-sm",
                activeTab === "build"
                  ? "border-cyan text-cyan bg-cyan/5"
                  : "border-transparent text-text-body hover:text-slate-300",
              )}
            >
              <Database className="w-3 h-3" /> {t.project_card.build_tab}
            </button>
            <button
              id={secureTabId}
              ref={(element) => {
                tabs.current.secure = element;
              }}
              role="tab"
              tabIndex={activeTab === "secure" ? 0 : -1}
              aria-selected={activeTab === "secure"}
              aria-controls={panelId}
              onClick={() => setActiveTab("secure")}
              type="button"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-mono transition-colors border-b-2 focus:outline-none focus:ring-2 focus:ring-cyan/50 rounded-t-sm",
                activeTab === "secure"
                  ? "border-cyan text-cyan bg-cyan/5"
                  : "border-transparent text-text-body hover:text-slate-300",
              )}
            >
              <Lock className="w-3 h-3" /> {t.project_card.secure_tab}
            </button>
          </div>

          {/* Tab Content with AnimatePresence */}
          <div
            className="h-40 overflow-y-auto pe-2 custom-scrollbar pt-4"
            role="tabpanel"
            tabIndex={0}
            id={panelId}
            aria-labelledby={activeTab === "build" ? buildTabId : secureTabId}
          >
            <AnimatePresence mode="wait">
              <motion.ul
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                {(activeTab === "build" ? buildItems : secureItems).map(
                  (item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="text-cyan mt-1" aria-hidden="true">
                        &#x25B9;
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-6 border-t border-cyan/10 flex flex-wrap gap-4">
          {links.demo && (
            <NeonButton
              href={links.demo}
              variant="primary"
              className="text-xs py-2 px-4"
            >
              <Play className="w-3 h-3 me-2" /> {t.project_card.watch_demo}
            </NeonButton>
          )}
          {links.repo && (
            <NeonButton
              href={links.repo}
              variant="secondary"
              className="text-xs py-2 px-4"
            >
              <Github className="w-3 h-3 me-2" /> {t.project_card.repo}
            </NeonButton>
          )}
          {links.caseStudy && (
            <Link
              href={links.caseStudy}
              className="flex items-center text-xs font-mono text-text-body hover:text-cyan ms-auto transition-colors"
            >
              {t.project_card.read_case_study}{" "}
              <ArrowUpRight className="w-3 h-3 ms-1 rtl:-scale-x-100" />
            </Link>
          )}
        </div>
      </HUDFrame>
    </motion.div>
  );
}
