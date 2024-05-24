import request from '/@/utils/request';

// 查询
export function getGetMonCoeffApi(data:EmptyObjectType) {
  return request({
    url: `/api/MonCoeff/GetMonCoeff`,
    method: 'GET',
    params:data
  });
}
// 編輯
export function postMonCoeffUpdateApi(data:Object) {
  return request({
    url: '/api/MonCoeff/Update',
    method: 'POST',
    data:data
  });
}
