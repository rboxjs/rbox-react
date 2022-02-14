import { useEffect, useMemo, useReducer } from "react";
import {CommonStore,getIsStore} from 'rbox'

import {ShouldRenderForStore,monitor} from '../utils/monitor'
import {throwError} from "../utils/helper";

export function useStores<S extends CommonStore[]>(stores: S, shouldRenderForStore?: ShouldRenderForStore):S {
  if (!Array.isArray(stores) || !stores.every((store) =>getIsStore(store))) {
    throwError("stores is not an store array");
  }
  if (shouldRenderForStore && typeof shouldRenderForStore !== "function") {
    throwError("shouldRenderForStore is not a function");
  }

  const [ , forceRender ] = useReducer(v => v + 1, 0)

  const unMonitor = useMemo(() => monitor(stores, forceRender, shouldRenderForStore), []);

  useEffect(() => unMonitor, []);

  return stores;
}
