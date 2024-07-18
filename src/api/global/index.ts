import request from '/@/utils/request';

// 上传文件
export function getUploadFileApi(FileType:number,file:any) {
  return request({
    url: '/api/File/UploadFile',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
  },
    params:{
      FileType
    },
    data:{
      file
    }
  });
}
// 上傳文件到S3
export function getUploadFile2S3Api(ProjectName:string,ProjectCode:string,ProductionLineType:string,FileType:number,file:any) {
  return request({
    url: '/api/File/UploadFile2S3',
    method: 'POST',
    headers: {
      "Content-Type": "multipart/form-data",
  },
    params:{
      FileType,ProjectName,ProjectCode,ProductionLineType
    },
    data:{
      file
    }
  });
}
// 部門下拉框
export function getDeptInfoGetKPIOrganizeApi() {
  return request({
    url: `/api/DeptInfo/GetKPIOrganize`,
    method: 'GET',
  });
}

