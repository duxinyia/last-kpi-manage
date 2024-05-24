import request from '/@/utils/request';

// 查询
export function getHrActSalaryApi(data:EmptyObjectType) {
  return request({
    url: `/api/HrActSalary/GetHrActSalary`,
    method: 'GET',
    params:data
  });
}
// 編輯
export function postHrActSalaryUpdateApi(data:Object) {
  return request({
    url: '/api/HrActSalary/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postHrActSalaryExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/HrActSalary/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postHrActSalaryImportExcelApi(file:any) {
  return request({
    url: '/api/HrActSalary/ImportExcel',
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






