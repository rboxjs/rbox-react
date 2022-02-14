import {CommonStore,getIsStore,getIsObject, PickData} from 'rbox'
import {deferProcess, mergeUpdateData} from "./helper";

export type ShouldRenderForStore = <D extends CommonStore>(store:D,previousData:PickData<D>)=>boolean

function findTotalStores(target: any, stores: CommonStore[] = []): CommonStore[] {
  if (getIsStore(target)) {
    if(!stores.includes(target)){
      stores.push(target);
    }
    findTotalStores(target.core.pickData(), stores);
  } else if (getIsObject(target)) {
    Object.values(target).forEach((item) => findTotalStores(item, stores));
  } else if (Array.isArray(target)) {
    target.forEach((item) => findTotalStores(item, stores));
  }

  return stores;
}

function createDeferRender(renderComponent:()=>void){
  let isRendering = false;

  return () => {
    if(!isRendering){
      isRendering = true;

      deferProcess(() => {
        renderComponent();
        isRendering = false;
      })
    }
  }
}

export function monitor(
  stores: CommonStore[],
  renderComponent: () => void,
  shouldRenderForStore: ShouldRenderForStore | undefined
){
  const deferRender = createDeferRender(renderComponent);
  const observes = [] as Array<{
    store: CommonStore;
    unobserve: ()=>void;
  }>;
  const observer = function<D extends CommonStore>(this: D, previousData:PickData<D>){
    if (shouldRenderForStore === undefined || !shouldRenderForStore(this, previousData)) {
      if(mergeUpdateData.isMerging && !mergeUpdateData.queue.includes(deferRender)){
        mergeUpdateData.queue.push(deferRender)
      }
      else{
       deferRender();
      }
    }
    seekObserves();
  }
  const seekObserves = () => {
    const totalStores = findTotalStores(stores);

    //卸载之前的不用的
    observes.forEach((observe, index) => {
      if (!totalStores.includes(observe.store)) {
        observe.unobserve;
        observes.splice(index, 1);
      }
    });
    //添加新创建的
    totalStores.forEach((store) => {
      if (!observes.some((observe) => observe.store === store)) {
        observes.push({
          store,
          unobserve: store.core.observeData(observer),
        });
      }
    });
  }

  seekObserves();

  return function () {
    observes.forEach((observe) => observe.unobserve());
  };
}
