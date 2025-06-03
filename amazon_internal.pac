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

    // --- 默认规则 ---
    return proxy;
}
