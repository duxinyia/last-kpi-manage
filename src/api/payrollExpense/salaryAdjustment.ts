import request from '/@/utils/request';

// 查询
export function getSalaDjustApi(data:EmptyObjectType) {
  return request({
    url: `/api/SalaDjust/GetSalaDjust`,
    method: 'GET',
    params:data
  });
}
// 編輯
export function postSalaDjustUpdateApi(data:Object) {
  return request({
    url: '/api/SalaDjust/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postSalaDjustExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/SalaDjust/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postSalaDjustImportExcelApi(file:any) {
  return request({
    url: '/api/SalaDjust/ImportExcel',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
  },
    params:{},
    data:{
      file
    }
  });
}

