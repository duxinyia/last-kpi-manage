import request from '/@/utils/request';
// 查询
export function getSMTMasspropApi(params:EmptyObjectType) {
  return request({
    url: `/api/SMTMassprop/GetSMTMassprop`,
    method: 'GET',
    params
  });
}

// 编辑
export function postSMTMasspropUpdateApi(data:Object) {
  return request({
    url: '/api/SMTMassprop/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postSMTMasspropExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/SMTMassprop/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}