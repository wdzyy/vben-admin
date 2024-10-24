import type { OperationLog } from './model';

import type { IDS, PageQuery, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  operLogClean = '/system/operlog/clean',
  operLogExport = '/system/operlog/export',
  operLogList = '/system/operlog/list',
  root = '/system/operlog',
}

export function operLogList(params?: PageQuery) {
  return requestClient.get<PageResult<OperationLog>>(Api.operLogList, {
    params,
  });
}

export function operLogDelete(operIds: IDS) {
  return requestClient.deleteWithMsg(`${Api.root}/${operIds}`);
}

export function operLogClean() {
  return requestClient.deleteWithMsg(Api.operLogClean);
}

export function operLogExport(data: any) {
  return commonExport(Api.operLogExport, data);
}
