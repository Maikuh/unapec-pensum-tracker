import React from "react";

type ImportExportAction = {
    type: "import" | "export";
};

type ImportExportDispatch = (action: ImportExportAction) => void;

const ImportExportStateContext = React.createContext<number>(0);

const ImportExportDispatchContext = React.createContext<
    ImportExportDispatch | undefined
>(undefined);

function importExportReducer(state: number, action: ImportExportAction) {
    switch (action.type) {
        case "import": {
            const randomNumber = Math.floor(Math.random() * 10000) + 1
            localStorage.setItem("importRandomNumber", randomNumber.toString())
            return randomNumber;
        }
        case "export": {
            const savedSelectedSubjects = localStorage.getItem(
                "selectedSubjects"
            );

            if (!savedSelectedSubjects) {
                alert(
                    "No hay datos para exportar. Por favor seleccione una carrera y al menos 1 asignatura."
                );
                return state;
            }

            let dataStr = savedSelectedSubjects;
            let dataUri =
                "data:application/json;charset=utf-8," +
                encodeURIComponent(dataStr);

            let exportFileDefaultName = "uptracker.json";

            let linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", exportFileDefaultName);
            linkElement.click();

            setTimeout(() => {
                linkElement.remove();
            }, 5000);

            return state;
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function ImportExportProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(importExportReducer, 0);

    return (
        <ImportExportStateContext.Provider value={state}>
            <ImportExportDispatchContext.Provider value={dispatch}>
                {children}
            </ImportExportDispatchContext.Provider>
        </ImportExportStateContext.Provider>
    );
}

function useImportExportState() {
    const context = React.useContext(ImportExportStateContext);
    if (context === undefined) {
        throw new Error(
            "useImportExportState must be used within a ImportExportProvider"
        );
    }
    return context;
}

function useImportExportDispatch() {
    const context = React.useContext(ImportExportDispatchContext);
    if (context === undefined) {
        throw new Error(
            "useImportExportDispatch must be used within a ImportExportProvider"
        );
    }
    return context;
}

function useImportExport(): [number, ImportExportDispatch] {
    return [useImportExportState(), useImportExportDispatch()];
}

export { ImportExportProvider, useImportExport };
