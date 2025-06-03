function FindProxyForURL(url, host) {
    // 定义 SOCKS5 代理服务器地址
    var proxy = "SOCKS5 127.0.0.1:8384";

    // --- 规则1：所有内网 IP 走直连 ---
    if (
        host === "127.0.0.1" ||
        isInNet(host, "10.0.0.0", "255.0.0.0") ||
        isInNet(host, "172.16.0.0", "255.240.0.0") ||
        isInNet(host, "192.168.0.0", "255.255.0.0") ||
        isInNet(host, "169.254.0.0", "255.255.0.0") ||
        isInNet(host, "127.0.0.0", "255.0.0.0")
    ) {
        return "DIRECT";
    }

    // --- 规则2：特定域名及包含关键字的域名走直连 ---
    if (
        host.indexOf("amazon") !== -1 ||
        host.indexOf(".aws") !== -1 ||
        host.indexOf("aws.") !== -1 ||
        host.indexOf("slack") !== -1 ||
        host.indexOf("chime") !== -1 ||

        host === "luum.com" ||
        host.endsWith(".luum.com") ||
        host === "a2z.com" ||
        host.endsWith(".a2z.com")
    ) {
        return "DIRECT";
    }

    // --- 规则3：非 80 和 443 端口的流量走直连 ---
    var port = null;
    // 去掉协议部分
    var urlNoProtocol = url.replace(/^https?:\/\//i, '');
    var colonIndex = urlNoProtocol.indexOf(':');
    var slashIndex = urlNoProtocol.indexOf('/');
    
    if (colonIndex > -1 && (slashIndex === -1 || colonIndex < slashIndex)) {
        if (slashIndex === -1) {
            port = parseInt(urlNoProtocol.substring(colonIndex + 1));
        } else {
            port = parseInt(urlNoProtocol.substring(colonIndex + 1, slashIndex));
        }
    } else {
        port = url.startsWith("https://") ? 443 : 80;
    }

    if (port !== 80 && port !== 443) {
        return "DIRECT";
    }

    // --- 默认规则 ---
    return proxy;
}
