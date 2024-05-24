import request from '/@/utils/request';
// 查询
export function getMasspropApi(params:EmptyObjectType) {
  return request({
    url: `/api/Massprop/GetGetMassprop`,
    method: 'GET',
    params
  });
}

// 编辑
export function postMasspropUpdateApi(data:Object) {
  return request({
    url: '/api/Massprop/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postMasspropExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Massprop/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}