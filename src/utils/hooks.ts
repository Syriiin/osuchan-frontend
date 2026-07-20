import React, { useContext, useEffect } from "react";
import type { IReactionPublic, IAutorunOptions } from "mobx";
import { autorun, runInAction } from "mobx";
import { StoreContext } from "../store";

export const useAction = (fn: () => void, deps: React.DependencyList) => {
    useEffect(() => {
        runInAction(fn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

export const useAutorun = (view: (r: IReactionPublic) => any, opts?: IAutorunOptions) => {
    useEffect(() => {
        const disposer = autorun(view, opts);
        return () => disposer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

export const useStore = () => {
    const store = useContext(StoreContext);

    if (store === null) {
        throw new Error("useStore must be used within a context provider");
    }

    return store;
};
