import request from '/@/utils/request';
// 查询
export function getTrialpropApi(params:EmptyObjectType) {
  return request({
    url: `/api/Trialprop/GetTrialprop`,
    method: 'GET',
    params
  });
}

// 编辑
export function postTrialpropUpdateApi(data:Object) {
  return request({
    url: '/api/Trialprop/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postTrialpropExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Trialprop/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}