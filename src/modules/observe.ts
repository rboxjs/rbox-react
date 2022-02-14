import React,{ComponentClass} from "react";
import {copyComponent, throwError} from "../utils/helper";
import {monitor} from "../utils/monitor";

export function observe<C extends ComponentClass>(ReactClassComponent:C):C{
  if (ReactClassComponent && (ReactClassComponent as any).observed) {
    throwError('you are already observe to this component');
  }
  if(!getIsClassComponent(ReactClassComponent)){
    throwError('ReactComponent is not a react class component');
  }

  (ReactClassComponent as any).observed = true;
  return observeClassComponent(ReactClassComponent);
}

function getIsClassComponent(target:any) :target is ComponentClass{
  return typeof target === 'function' && target.prototype && !!target.prototype.isReactComponent
}

function observeClassComponent<C extends ComponentClass<any,any>>(Component:C,needCopy:boolean = true):C {
  // @ts-ignore
  class FinalComponent extends Component {
    unMonitor:()=>void;

    constructor(...args:any[]) {
      // @ts-ignore
      super(...args);

      const stores = [...Object.values(this)];


      this.unMonitor = monitor(
        stores,
        ()=>this.forceUpdate(),
        (this as any).shouldRenderForStore
      )
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount.apply(this)
      }

      this.unMonitor();
    }
  }

  return copyComponent(FinalComponent, Component)
}