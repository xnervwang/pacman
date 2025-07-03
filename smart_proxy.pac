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
    // 注：isInNet 函数需要被定义才能使用，此处假设它已存在或浏览器内置。
    // 为了脚本健壮性，先判断 host 是否为 IP 地址。
    if (isPlainHostName(host) || /^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        if (host === "127.0.0.1") return "DIRECT";
        for (var i = 0; i < localNets.length; i++) {
            if (isInNet(host, localNets[i][0], localNets[i][1])) {
                return "DIRECT";
            }
        }
    }


    // --- Office 365 域名直连 ---
    // 添加了Office 365的核心一级域名后缀
    var office365Suffixes = [
        ".microsoft.com",
        ".microsoftonline.com",
        ".msecnd.net",
        ".msocdn.com",
        ".office.com",
        ".office.net",
        ".office365.com",
        ".onenote.com",
        ".outlook.com",
        ".sharepoint.com",
        ".skype.com",
        ".windows.net",
        ".live.com" // 用于 OneDrive
    ];

    for (var m = 0; m < office365Suffixes.length; m++) {
        if (host.endsWith(office365Suffixes[m])) {
            return "DIRECT";
        }
    }
    // 对 office.com 进行一次完全匹配，以防用户直接访问
    if (host === "office.com") {
        return "DIRECT";
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
    // 注意：原始脚本的端口解析逻辑在处理不带端口的URL时可能不完全准确，
    // 这里简化并修正了逻辑。
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // 对于非 http/https 协议（如 ftp, ws, wss 等），直接连接
        return "DIRECT";
    }

    var urlPort = url.match(/:(\d+)/);
    if (urlPort) {
        var port = parseInt(urlPort[1]);
        if (port !== 80 && port !== 443) {
            return "DIRECT";
        }
    }

    // --- 默认规则 ---
    return proxy;
}
