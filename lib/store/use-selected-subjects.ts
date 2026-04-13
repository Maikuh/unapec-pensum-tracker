"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Subject, SelectedSubjects } from "@/types/pensum";
import type { SelectAllCheckboxStatus } from "@/types/checkbox";
import { getAllPrerequisiteSubjects } from "@/lib/helpers/get-all-prerequisite-subjects";
import { getSubjectsThatCanBeSelected } from "@/lib/helpers/get-subjects-that-can-be-selected";

interface SelectedSubjectsState {
  selectedSubjects: SelectedSubjects;
  initPensum: (pensumCode: string) => void;
  selectSubject: (
    pensumCode: string,
    subject: Subject,
    allSubjects: Subject[]
  ) => void;
  bulkSelect: (
    pensumCode: string,
    newSelectedSubjects: Subject[],
    periodSubjectsCount: number,
    checkboxStatus: SelectAllCheckboxStatus,
    creditsCount: number,
    totalCredits: number
  ) => void;
  importFromFile: (data: SelectedSubjects) => void;
  exportToFile: () => void;
}

export const useSelectedSubjectsStore = create<SelectedSubjectsState>()(
  persist(
    (set, get) => ({
      selectedSubjects: {},

      initPensum: (pensumCode) => {
        const { selectedSubjects } = get();
        if (!selectedSubjects[pensumCode]) {
          set({
            selectedSubjects: { ...selectedSubjects, [pensumCode]: [] },
          });
        }
      },

      selectSubject: (pensumCode, subject, allSubjects) => {
        const { selectedSubjects } = get();
        const subjects = selectedSubjects[pensumCode] ?? [];
        let temp: Subject[];

        if (subjects.some((s) => s.code === subject.code)) {
          // Remove subject and cascade-remove its dependents
          let subjectsToRemove: string[] = [subject.code];
          for (const subjectToRemove of subjectsToRemove) {
            subjectsToRemove = getAllPrerequisiteSubjects(
              allSubjects,
              subjectToRemove,
              subjectsToRemove
            );
          }
          subjectsToRemove = [...new Set(subjectsToRemove)];
          temp = subjects.filter((s) => !subjectsToRemove.includes(s.code));
        } else {
          temp = subjects.concat(subject);
        }

        set({
          selectedSubjects: { ...selectedSubjects, [pensumCode]: temp },
        });
      },

      bulkSelect: (
        pensumCode,
        newSelectedSubjects,
        periodSubjectsCount,
        checkboxStatus,
        creditsCount,
        totalCredits
      ) => {
        const { selectedSubjects } = get();
        const subjects = selectedSubjects[pensumCode] ?? [];
        let temp: Subject[] = [];

        if (checkboxStatus === "unchecked") {
          const selectable = getSubjectsThatCanBeSelected(
            newSelectedSubjects,
            subjects,
            creditsCount,
            totalCredits
          );
          temp = subjects.concat(...selectable);
        } else if (checkboxStatus === "indeterminate") {
          if (newSelectedSubjects.length < periodSubjectsCount) {
            // Some are selected — deselect them with cascade
            let subjectsToRemove = newSelectedSubjects.map((s) => s.code);
            for (const subjectToRemove of subjectsToRemove) {
              subjectsToRemove = getAllPrerequisiteSubjects(
                subjects,
                subjectToRemove,
                subjectsToRemove
              );
            }
            subjectsToRemove = [...new Set(subjectsToRemove)];
            temp = subjects.filter((s) => !subjectsToRemove.includes(s.code));
          } else {
            // All are selected — add ones that aren't yet selected
            const notInSelected = newSelectedSubjects.filter(
              (ns) => !subjects.some((s) => s.code === ns.code)
            );
            temp = subjects.concat(...notInSelected);
          }
        } else if (checkboxStatus === "checked") {
          // Deselect all with cascade
          let subjectsToRemove = newSelectedSubjects.map((s) => s.code);
          for (const subjectToRemove of subjectsToRemove) {
            subjectsToRemove = getAllPrerequisiteSubjects(
              subjects,
              subjectToRemove,
              subjectsToRemove
            );
          }
          subjectsToRemove = [...new Set(subjectsToRemove)];
          temp = subjects.filter((s) => !subjectsToRemove.includes(s.code));
        }

        set({
          selectedSubjects: { ...selectedSubjects, [pensumCode]: temp },
        });
      },

      importFromFile: (data) => {
        set({ selectedSubjects: data });
      },

      exportToFile: () => {
        const { selectedSubjects } = get();
        const dataStr = JSON.stringify(selectedSubjects);
        const dataUri =
          "data:application/json;charset=utf-8," +
          encodeURIComponent(dataStr);
        const link = document.createElement("a");
        link.setAttribute("href", dataUri);
        link.setAttribute("download", "uptracker.json");
        link.click();
        setTimeout(() => link.remove(), 5000);
      },
    }),
    {
      name: "selectedSubjects",
      skipHydration: true,
    }
  )
);
