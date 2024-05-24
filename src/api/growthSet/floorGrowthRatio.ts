import request from '/@/utils/request';
// 查询
export function getFloorpropByPageApi(params:EmptyObjectType) {
  return request({
    url: `/api/Floorprop/GetFloorpropByPage`,
    method: 'GET',
    params
  });
}

// 编辑
export function postFloorpropUpdaApi(data:Object) {
  return request({
    url: '/api/Floorprop/Update',
    method: 'POST',
    data:data
  });
}
// 導出
export function postFloorpropExportApi(params:EmptyObjectType) {
  return request({
    url: '/api/Floorprop/Export',
    method: 'POST',
    responseType: 'blob', // 设置响应数据类型为 blob
    params,
  });
}
// 導入
export function postFloorpropImportExcelApi(file:any) {
  return request({
    url: '/api/Floorprop/ImportExcel',
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



