import request from '/@/utils/request';
// 查询
export function getExamsetstageApi(data:EmptyObjectType) {
  return request({
    url: `/api/Reportinfo/GetExamsetstage`,
    method: 'GET',
    params:data
  });
}
// 計算
export function getCalculateExamsetstageApi(data:EmptyObjectType) {
  return request({
    url: `/api/Reportinfo/CalculateExamsetstage`,
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
// 預覽
export function getPreviewExamsetstageApi(data:EmptyObjectType) {
  return request({
    url: `/api/Reportinfo/PreviewExamsetstage`,
    method: 'GET',
    params:data
  });
}











