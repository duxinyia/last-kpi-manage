import request from '/@/utils/request';
// 查询
export function getMasscoeffApi(params:EmptyObjectType) {
  return request({
    url: `/api/Masscoeff/GetMasscoeff`,
    method: 'GET',
    params
  });
}

// 编辑
export function postMasscoeffUpdateApi(data:Object) {
  return request({
    url: '/api/Masscoeff/Update',
    method: 'POST',
    data:data
  });
}
// 删除
// export function postTrialcoeffDeleteApi(data:Object) {
//   return request({
//     url: `/api/Trialcoeff/Delete`,
//     method: 'POST',
//     data
//   });
// }
// 導出
export function postMasscoeffExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Masscoeff/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postMasscoeffImportExcelApi(file:any) {
  return request({
    url: '/api/Masscoeff/ImportExcel',
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
export function postMasscoeffSetBaseProjectApi(data:Object) {
  return request({
    url: `/api/Masscoeff/SetBaseProject`,
    method: 'POST',
    data
  });
}





