export class HttpClient {
    public static Request(url: string, body: any, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS', repType: XMLHttpRequestResponseType = 'json'): Promise<any> {
        let request = null;
        switch (method) {
            case 'GET':
                request = HttpClient.httpGet(url, body, repType);
                break;
            case 'POST':
                request = HttpClient.httpPost(url, body, repType);
                break;
            default:
                break;
        }
        return request;
    }

    public static httpGet(url: string, body: any, rspType: XMLHttpRequestResponseType = 'json'): Promise<any> {
        return new Promise((resolve, reject) => {
            let req = cc.loader.getXMLHttpRequest();
            if (body) {
                let str = "?";
                for (let k in body) {
                    if (str != "?") {
                        str += "&";
                    }
                    str += k + "=" + body[k];
                }
                url = url + str;
            }
            req.open('GET', url, true);
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (rspType == 'text') {
                            resolve(JSON.parse(req.responseText))
                        } else {
                            resolve(req.response);
                        }
                    } else {
                        reject({ code: req.status, msg: req.statusText, data: {} });
                    }
                }
            }
            switch (rspType) {
                case 'json':
                    req.setRequestHeader('content-type', 'application/json')
                    break;
                case 'text':
                    req.setRequestHeader('content-type', 'text/plain')
                    break
            }
            // set reponse type ，如果是二进制，则最好是arraybuffer或者blob
            if (rspType == 'blob' || rspType == 'arraybuffer' || rspType == 'text') {
                req.responseType = rspType
            }
            req.timeout = 5000;
            req.ontimeout = () => {
                reject({ code: -1, msg: "网络异常，消息发送超时", data: {} });
            }
            req.send()
        });

    }

    public static httpPost(url: string, body: any, rspType: XMLHttpRequestResponseType = 'json'): Promise<any> {
        return new Promise((resolve, reject) => {
            let req = cc.loader.getXMLHttpRequest();
            req.open('GET', url, true);
            req.onreadystatechange = () => {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        if (rspType == 'text') {
                            resolve(JSON.parse(req.responseText))
                        } else {
                            resolve(req.response);
                        }
                    } else {
                        reject({ code: req.status, msg: req.statusText, data: {} });
                    }
                }
            }
            switch (rspType) {
                case 'json':
                    req.setRequestHeader('content-type', 'application/json')
                    break;
                case 'text':
                    req.setRequestHeader('content-type', 'text/plain')
                    break
            }
            // set reponse type ，如果是二进制，则最好是arraybuffer或者blob
            if (rspType == 'blob' || rspType == 'arraybuffer' || rspType == 'text') {
                req.responseType = rspType
            }
            req.timeout = 5000;
            req.send(body ? JSON.stringify(body) : '');
        });
    }
}