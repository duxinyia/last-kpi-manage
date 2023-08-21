import request from '/@/utils/request';
// 查询
export function getIToolReceivePageListApi(data:Object) {
  return request({
    url: '/api/ToolCheck/IToolReceivePageList',
    method: 'POST',
  	data:data
  });
}
// 点击验收得到的数据
export function getCheckdetailApi(data:object) {
  return request({
    url: '/api/ToolCheck/GetCheckdetail/Receiptno',
    method: 'GET',
  	params:data
  });
}
// 验收
export function getTInsertCheckApi(data:Object) {
  return request({
    url: '/api/ToolCheck/InsertCheck',
    method: 'POST',
  	data:data
  });
}