export function checkUrlIsImage(url: string) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
