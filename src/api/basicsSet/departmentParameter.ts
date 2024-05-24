import request from '/@/utils/request';
// 查询
export function getDeptInfoGetDeptInfoApi(data:EmptyObjectType) {
  return request({
    url: `/api/DeptInfo/GetDeptInfo`,
    method: 'GET',
    params:data
  });
}


// 部門樹形下拉
export function getDeptInfoGetOrganizeFrameApi() {
  return request({
    url: `/api/DeptInfo/GetOrganizeFrame`,
    method: 'GET',
    
  });
}
// 新增
export function postDeptInfoUpdateApi(data:Object) {
  return request({
    url: '/api/DeptInfo/Update',
    method: 'POST',
    data:data
  });
}






