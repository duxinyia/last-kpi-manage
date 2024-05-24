import request from '/@/utils/request';

// 查询
export function getRewardstandardsApi() {
  return request({
    url: `/api/Departalassess/GetRewardstandardsByPage`,
    method: 'GET',
  });
}
// 新增
export function postDepartalassessAddApi(data:Object) {
  return request({
    url: '/api/Departalassess/Add',
    method: 'POST',
    data:data
  });
}
// 編輯
export function postDepartalassessUpdateApi(data:Object) {
  return request({
    url: '/api/Departalassess/Update',
    method: 'POST',
    data:data
  });
}
// // 刪除
export function postDepartalassessDeleteApi(data:Object) {
  return request({
    url: '/api/Departalassess/Delete',
    method: 'POST',
    data:data
  });
}







