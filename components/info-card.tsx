"use client";

import { Calendar, CreditCard, ExternalLink, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pensumPages } from "@/lib/data/pensum-pages";

interface InfoCardProps {
  pensumCode: string;
  subjectsCount: number;
  totalSubjects: number;
  creditsCount: number;
  totalCredits: number;
  date: string;
}

export function InfoCard({
  pensumCode,
  subjectsCount,
  totalSubjects,
  creditsCount,
  totalCredits,
  date,
}: InfoCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const subjectsPercent = Math.round((subjectsCount / totalSubjects) * 100);
  const creditsPercent = Math.round((creditsCount / totalCredits) * 100);
  const originalLink = pensumPages[pensumCode];

  return (
    <div className="flex justify-center mb-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Informacion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Fecha del Pensum</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Materias</p>
              <p className="text-sm text-muted-foreground">
                <span data-testid="subjects-count">{subjectsCount}</span>{" "}
                (
                <span className="subject-credits-percentage">
                  {subjectsPercent}%
                </span>
                ) de{" "}
                <span data-testid="total-subjects">{totalSubjects}</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm font-medium">Créditos</p>
              <p className="text-sm text-muted-foreground">
                <span data-testid="credits-count">{creditsCount}</span>{" "}
                (
                <span className="subject-credits-percentage">
                  {creditsPercent}%
                </span>
                ) de{" "}
                <span data-testid="total-credits">{totalCredits}</span>
              </p>
            </div>
          </div>

          {originalLink && (
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">Pensum Original</p>
                <a
                  href={originalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline hover:text-foreground"
                >
                  Link al Pensum
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
