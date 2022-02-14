import {ComponentClass} from "react";
import hoistNonReactStatics from "hoist-non-react-statics";

import { throwError as _throwError } from "rbox";

export function deferProcess(task: Function){
  const isSupportPromise = typeof Promise == "function";

  if (isSupportPromise) {
    Promise.resolve().then(task as any);
  } else {
    setTimeout(task);
  }
}

export function throwError(message: string): never {
  _throwError(message, "abox-react");
}



//复制组件一些静态属性
export function copyComponent<T extends ComponentClass>(target:T, source:ComponentClass):T {
  target.displayName = source.displayName || source.name;
  target.contextTypes = source.contextTypes;
  target.propTypes = source.propTypes;
  target.defaultProps = source.defaultProps;

  hoistNonReactStatics(target, source);

  return target
}


export const mergeUpdateData = {
  isMerging:false,
  queue:[] as Array<()=>void>
}
