import request from '/@/utils/request';

// 查询
export function getDemandApi(data:EmptyObjectType) {
  return request({
    url: `/api/Demand/GetDemand`,
    method: 'GET',
    params:data
  });
}
// 編輯
export function postDemandUpdateApi(data:Object) {
  return request({
    url: '/api/Demand/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postDemandExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Demand/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postDemandImportExcelApi(file:any) {
  return request({
    url: '/api/Demand/ImportExcel',
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






