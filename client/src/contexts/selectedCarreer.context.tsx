import React from "react";
import { Pensum } from "../interfaces/pensums.interface";

type SelectedCarreerAction = {
    type: "select-carreer";
    payload: Pensum;
};

type SelectedCarreerDispatch = (action: SelectedCarreerAction) => void;

const SelectedCarreerStateContext = React.createContext<Pensum | undefined>(
    undefined
);

const SelectedCarreerDispatchContext = React.createContext<
    SelectedCarreerDispatch | undefined
>(undefined);

function selectedCarreerReducer(state: Pensum, action: SelectedCarreerAction) {
    switch (action.type) {
        case "select-carreer": {
            return action.payload;
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function SelectedCarreerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = React.useReducer(selectedCarreerReducer, {
        carreerName: "",
        totalCredits: 0,
        pensumCode: "",
        cuatris: [],
        date: "",
    });

    return (
        <SelectedCarreerStateContext.Provider value={state}>
            <SelectedCarreerDispatchContext.Provider value={dispatch}>
                {children}
            </SelectedCarreerDispatchContext.Provider>
        </SelectedCarreerStateContext.Provider>
    );
}

function useSelectedCarreerState() {
    const context = React.useContext(SelectedCarreerStateContext);
    if (context === undefined) {
        throw new Error(
            "useSelectedCarreerState must be used within a CountProvider"
        );
    }
    return context;
}

function useSelectedCarreerDispatch() {
    const context = React.useContext(SelectedCarreerDispatchContext);
    if (context === undefined) {
        throw new Error(
            "useSelectedCarreerDispatch must be used within a CountProvider"
        );
    }
    return context;
}

function useSelectedCarreer() {
    return [useSelectedCarreerState(), useSelectedCarreerDispatch()];
}

export { SelectedCarreerProvider, useSelectedCarreer };
