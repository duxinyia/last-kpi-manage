import request from '/@/utils/request';
// 查询
export function getTrialcoeffApi(params:EmptyObjectType) {
  return request({
    url: `/api/Trialcoeff/GetTrialcoeff`,
    method: 'GET',
    params
  });
}
// 新增
// export function postTrialplanAddApi(data:Object) {
//   return request({
//     url: '/api/Trialplan/Add',
//     method: 'POST',
//     data:data
//   });
// }
// 编辑
export function postTrialcoeffUpdateApi(data:Object) {
  return request({
    url: '/api/Trialcoeff/Update',
    method: 'POST',
    data:data
  });
}
// 删除
export function postTrialcoeffDeleteApi(data:Object) {
  return request({
    url: `/api/Trialcoeff/Delete`,
    method: 'POST',
    data
  });
}
// 導出
export function postTrialcoeffExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Trialcoeff/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postTrialcoeffImportExcelApi(file:any) {
  return request({
    url: '/api/Trialcoeff/ImportExcel',
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
export function postTrialcoeffSetBaseProjectApi(data:Object) {
  return request({
    url: `/api/Trialcoeff/SetBaseProject`,
    method: 'POST',
    data
  });
}





