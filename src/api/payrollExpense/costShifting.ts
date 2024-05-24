import request from '/@/utils/request';

// 查询
export function getCostShiftApi(data:EmptyObjectType) {
  return request({
    url: `/api/CostShift/GetCostShift`,
    method: 'GET',
    params:data
  });
}
// 編輯
export function postCostShiftUpdateApi(data:Object) {
  return request({
    url: '/api/CostShift/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postCostShiftExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/CostShift/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postCostShiftImportExcelApi(file:any) {
  return request({
    url: '/api/CostShift/ImportExcel',
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