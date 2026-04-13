"use client";

import { useState } from "react";
import Link from "next/link";
import { CareerSearch } from "@/components/career-search";
import { ImportExportButtons } from "@/components/import-export-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import pensumsData from "@/lib/data/pensums.json";
import { cn } from "@/lib/utils";
import type { Pensum } from "@/types/pensum";
import { Menu } from "lucide-react";
import { LuGithub } from 'react-icons/lu'

const pensums = (pensumsData as Pensum[]).map(({ pensumCode, carreerName }) => ({
  pensumCode,
  carreerName,
}));

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        {/* Left: mobile menu + title */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link
            href="/"
            className="font-semibold text-base shrink-0 hidden lg:block hover:text-foreground/80 transition-colors"
          >
            UNAPEC Pensum Tracker
          </Link>
        </div>

        {/* Center: career search */}
        <div className="flex justify-center">
          <CareerSearch pensums={pensums} className="w-full max-w-sm md:max-w-md" />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 justify-end">
          <div className="hidden md:flex items-center gap-1">
            <ImportExportButtons />
            <Tooltip>
              <TooltipTrigger>
                <a
                  href="https://github.com/maikuh/unapec-pensum-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repo"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                >
                  <LuGithub className="h-5 w-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent>GitHub Repo</TooltipContent>
            </Tooltip>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>UNAPEC Pensum Tracker</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setDrawerOpen(false)}
              className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
            >
              Inicio
            </Link>
            <a
              href="https://github.com/maikuh/unapec-pensum-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
            >
              <LuGithub className="mr-2 h-4 w-4" />
              GitHub Repo
            </a>
            <Separator />
            <div className="flex items-center gap-2 px-3 py-1 text-sm text-muted-foreground">
              <ImportExportButtons />
              <span>Importar / Exportar</span>
            </div>
          </nav>
          <div className="absolute bottom-6 left-0 right-0 px-6 text-center text-sm text-muted-foreground">
            <p>by Miguel Araujo</p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
