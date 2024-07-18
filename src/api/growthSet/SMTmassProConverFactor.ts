import request from '/@/utils/request';
// 查询
export function getSMTMasscoeffApi(params:EmptyObjectType) {
  return request({
    url: `/api/SMTMasscoeff/GetSMTMasscoeff`,
    method: 'GET',
    params
  });
}

// 编辑
export function postSMTMasscoeffUpdateApi(data:Object) {
  return request({
    url: '/api/SMTMasscoeff/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postSMTMasscoeffExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/SMTMasscoeff/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postSMTMasscoeffImportExcelApi(file:any) {
  return request({
    url: '/api/SMTMasscoeff/ImportExcel',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
  },
    params:{
      
    },
    data:{
    
      file
    }
  });
}
// 設置為機種基準
export function postSMTMasscoeffSetBaseProjectApi(data:Object) {
  return request({
    url: `/api/SMTMasscoeff/SetBaseProject`,
    method: 'POST',
    data
  });
}