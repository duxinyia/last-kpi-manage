import request from '/@/utils/request';
// 查询
export function getProjectInfoByPageApi(params:EmptyObjectType) {
  return request({
    url: `/api/ProjectInfo/GetProjectInfoByPage`,
    method: 'GET',
    params
  });
}
// 新增
export function postProjectInfoAddApi(data:Object) {
  return request({
    url: '/api/ProjectInfo/Add',
    method: 'POST',
    data:data
  });
}
// 编辑
export function postProjectInfoUpdaApi(data:Object) {
  return request({
    url: '/api/ProjectInfo/Update',
    method: 'POST',
    data:data
  });
}
// 删除
export function postProjectInfoDeleteApi(data:Object) {
  return request({
    url: `/api/ProjectInfo/Delete`,
    method: 'POST',
    data
  });
}
// 導出
export function postProjectInfoExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/ProjectInfo/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postProjectInfoImportExcelApi(file:any) {
  return request({
    url: '/api/ProjectInfo/ImportExcel',
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



