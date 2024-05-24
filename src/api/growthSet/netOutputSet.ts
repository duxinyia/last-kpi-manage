import request from '/@/utils/request';
// 查询
export function getOutputinfoByPageApi(params:EmptyObjectType) {
  return request({
    url: `/api/Outputinfo/GetOutputinfoByPage`,
    method: 'GET',
    params
  });
}
// 新增
// export function postProjectInfoAddApi(data:Object) {
//   return request({
//     url: '/api/ProjectInfo/Add',
//     method: 'POST',
//     data:data
//   });
// }
// 编辑
export function postOutputinfoUpdateApi(data:Object) {
  return request({
    url: '/api/Outputinfo/Update',
    method: 'POST',
    data:data
  });
}
// 删除
export function postOutputinfoDeleteApi(data:Object) {
  return request({
    url: `/api/Outputinfo/Delete`,
    method: 'POST',
    data
  });
}
// 導出
export function postOutputinfoExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Outputinfo/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postOutputinfoImportExcelApi(file:any) {
  return request({
    url: '/api/Outputinfo/ImportExcel',
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



