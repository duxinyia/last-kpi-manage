import request from '/@/utils/request';
// 查询
export function getTrialplanByPageApi(params:EmptyObjectType) {
  return request({
    url: `/api/Trialplan/GetTrialplanByPage`,
    method: 'GET',
    params
  });
}
// 新增
export function postTrialplanAddApi(data:Object) {
  return request({
    url: '/api/Trialplan/Add',
    method: 'POST',
    data:data
  });
}
// 编辑
export function postTrialplanUpdateApi(data:Object) {
  return request({
    url: '/api/Trialplan/Update',
    method: 'POST',
    data:data
  });
}
// 删除
export function postTrialplanDeleteApi(data:Object) {
  return request({
    url: `/api/Trialplan/Delete`,
    method: 'POST',
    data
  });
}
// 導出
export function postTrialplanExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Trialplan/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postTrialplanImportExcelApi(file:any) {
  return request({
    url: '/api/Trialplan/ImportExcel',
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




