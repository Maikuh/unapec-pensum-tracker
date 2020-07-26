import React from "react";
import { Pensum } from "../interfaces/pensums.interface";

type SelectedCareerAction = {
    type: "select-career";
    payload: Pensum;
};

type SelectedCareerDispatch = (action: SelectedCareerAction) => void;

const SelectedCareerStateContext = React.createContext<Pensum | undefined>(
    undefined
);

const SelectedCareerDispatchContext = React.createContext<
    SelectedCareerDispatch | undefined
>(undefined);

function selectedCareerReducer(state: Pensum, action: SelectedCareerAction) {
    switch (action.type) {
        case "select-career": {
            return action.payload;
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function SelectedCareerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(selectedCareerReducer, {
        carreerName: "",
        totalCredits: 0,
        pensumCode: "",
        cuatris: [],
        date: "",
    });

    return (
        <SelectedCareerStateContext.Provider value={state}>
            <SelectedCareerDispatchContext.Provider value={dispatch}>
                {children}
            </SelectedCareerDispatchContext.Provider>
        </SelectedCareerStateContext.Provider>
    );
}

function useSelectedCareerState() {
    const context = React.useContext(SelectedCareerStateContext);
    if (context === undefined) {
        throw new Error(
            "useSelectedCareerState must be used within a SelectedCareerProvider"
        );
    }
    return context;
}

function useSelectedCareerDispatch() {
    const context = React.useContext(SelectedCareerDispatchContext);
    if (context === undefined) {
        throw new Error(
            "useSelectedCareerDispatch must be used within a SelectedCareerProvider"
        );
    }
    return context;
}

function useSelectedCareer(): [Pensum, SelectedCareerDispatch] {
    return [useSelectedCareerState(), useSelectedCareerDispatch()];
}

export { SelectedCareerProvider, useSelectedCareer };
