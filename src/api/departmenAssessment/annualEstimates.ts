import request from '/@/utils/request';
// 查询
export function getExamsetestApi(data:EmptyObjectType) {
  return request({
    url: `/api/Reportinfo/GetExamsetest`,
    method: 'GET',
    params:data
  });
}
// 計算
export function getExamsetstageApi(data:EmptyObjectType) {
  return request({
    url: `/api/Reportinfo/GetExamsetstage`,
    method: 'GET',
    params:data
  });
}
// 保存
export function postReportinfoSaveApi(data:Object) {
  return request({
    url: '/api/Reportinfo/Save',
    method: 'POST',
    data:data
  });
}











