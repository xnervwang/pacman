function FindProxyForURL(url, host) {
    // 定义 SOCKS5 代理服务器地址
    var proxy = "SOCKS5 127.0.0.1:8384";

    // --- 内网 IP 网段 ---
    var localNets = [
        ["10.0.0.0", "255.0.0.0"],
        ["172.16.0.0", "255.240.0.0"],
        ["192.168.0.0", "255.255.0.0"],
        ["169.254.0.0", "255.255.0.0"],
        ["127.0.0.0", "255.0.0.0"]
    ];

    // 判断是否为内网地址
    if (host === "127.0.0.1") return "DIRECT";
    for (var i = 0; i < localNets.length; i++) {
        if (isInNet(host, localNets[i][0], localNets[i][1])) {
            return "DIRECT";
        }
    }

    // --- 域名关键词或特定域名 ---
    var keywordList = ["amazon", ".aws", "aws.", "slack", "chime"];
    var exactDomains = ["luum.com", "a2z.com"];
    var suffixDomains = [".luum.com", ".a2z.com"];

    // 关键词匹配
    for (var j = 0; j < keywordList.length; j++) {
        if (host.indexOf(keywordList[j]) !== -1) {
            return "DIRECT";
        }
    }

    // 完全匹配
    for (var k = 0; k < exactDomains.length; k++) {
        if (host === exactDomains[k]) {
            return "DIRECT";
        }
    }

    // 后缀匹配
    for (var l = 0; l < suffixDomains.length; l++) {
        if (host.endsWith(suffixDomains[l])) {
            return "DIRECT";
        }
    }

    // --- 非 80 和 443 端口的流量走直连 ---
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
