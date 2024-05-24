import request from '/@/utils/request';

// 查询
export function getRiseSalaryApi(data:EmptyObjectType) {
  return request({
    url: `/api/RiseSalary/GetRiseSalary`,
    method: 'GET',
    params:data
  });
}
// 編輯
export function postRiseSalaryUpdateApi(data:Object) {
  return request({
    url: '/api/RiseSalary/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postRiseSalaryExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/RiseSalary/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postRiseSalaryImportExcelApi(file:any) {
  return request({
    url: '/api/RiseSalary/ImportExcel',
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
