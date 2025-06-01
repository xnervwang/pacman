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

    // --- 规则2：特定域名和所有含 "amazon" 关键字的域名走直连 ---

    // 使用 indexOf 检查是否包含 "amazon" 关键字
    // 请注意，这种匹配方式可能导致误伤，例如 "notamazon.com" 也会被直连。
    if (host.indexOf("amazon") !== -1 ||
        host === "luum.com" ||
        host.endsWith(".luum.com") // 确保 luum.com 及其子域名都直连
       ) {
        return "DIRECT";
    }

    // --- 默认规则：所有不符合上述条件的流量走 SOCKS5 代理 ---
    return proxy;
}
