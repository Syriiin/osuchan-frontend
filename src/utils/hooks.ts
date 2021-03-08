import React, { useEffect } from "react";
import { IReactionPublic, IAutorunOptions, autorun, runInAction } from "mobx";

export const useAction = (fn: () => void, deps: React.DependencyList) => {
    useEffect(() => {
        runInAction(fn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export const useAutorun = (view: (r: IReactionPublic) => any, opts?: IAutorunOptions) => {
    useEffect(() => {
        autorun(view, opts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
