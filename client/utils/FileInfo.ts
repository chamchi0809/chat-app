export interface IFileInfo{
  size:string
  name:string
}

export function getFileInfo(url:string):IFileInfo
{
  let fileSize = '';
  let http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send(null);

  if (http.status === 200) {
    fileSize = http.getResponseHeader('content-length');
  }

  const split = url.split('/');

  return {
    size:formatBytes(fileSize,2),
    name:split[split.length-1]
  };
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}