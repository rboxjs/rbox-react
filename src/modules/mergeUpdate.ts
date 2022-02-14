import {mergeUpdateData, throwError} from "../utils/helper";

export function mergeUpdate(task:()=>void) {
  if(mergeUpdateData.isMerging){
    throwError('You cannot nest call mergeUpdate')
  }

  mergeUpdateData.isMerging = true;
  task();
  mergeUpdateData.isMerging = false;

  const queue = [...mergeUpdateData.queue];
  queue.forEach(item=>item());
}
