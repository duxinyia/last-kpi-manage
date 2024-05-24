import request from '/@/utils/request';

// 查询
export function getLaborcoststandardsApi(data:EmptyObjectType) {
  return request({
    url: `/api/Laborcost/GetLaborcoststandards`,
    method: 'GET',
    params:data
  });
}
// 新增
export function postLaborcostAddApi(data:Object) {
  return request({
    url: '/api/Laborcost/Add',
    method: 'POST',
    data:data
  });
}
// 編輯
export function postLaborcostUpdateApi(data:Object) {
  return request({
    url: '/api/Laborcost/Update',
    method: 'POST',
    data:data
  });
}
// 刪除
export function postLaborcostDeleteApi(data:Object) {
  return request({
    url: '/api/Laborcost/Delete',
    method: 'POST',
    data:data
  });
}

// 導出（暫時沒用）
export function postLaborcostExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Laborcost/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入（暫時沒用）
export function postLaborcostImportExcelApi(file:any) {
  return request({
    url: '/api/Laborcost/ImportExcel',
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






