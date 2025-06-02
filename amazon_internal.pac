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

    // --- 规则2：特定域名和所有含 "amazon"、".aws" 或 "aws." 关键字的域名走直连 ---
    // 注意：indexOf 匹配可能导致误伤，例如 "notamazon.com" 也会被直连。
    // .aws 和 aws. 的匹配是为了覆盖 aws.amazon.com, chime.aws 等域名。
    if (
        host.indexOf("amazon") !== -1 ||
        host.indexOf(".aws") !== -1 || // 包含 .aws (例如 chime.aws)
        host.indexOf("aws.") !== -1 || // 包含 aws. (例如 aws.amazon.com)
        host === "luum.com" ||
        host.endsWith(".luum.com") ||
        host === "a2z.com" ||
        host.endsWith(".a2z.com")
    ) {
        return "DIRECT";
    }

    // --- 规则3：非 80 和 443 端口的流量走直连 ---
    // 提取 URL 中的端口号
    var port = null;
    var colonIndex = url.lastIndexOf(":");
    var slashIndex = url.indexOf("/", colonIndex);

    if (colonIndex > -1 && (slashIndex === -1 || colonIndex < slashIndex)) {
        // 如果有冒号且冒号在斜杠之前（或者没有斜杠），则可能存在端口号
        if (slashIndex === -1) {
            port = parseInt(url.substring(colonIndex + 1));
        } else {
            port = parseInt(url.substring(colonIndex + 1, slashIndex));
        }
    } else {
        // 如果没有明确的端口号，则使用默认端口
        if (url.startsWith("https://")) {
            port = 443;
        } else {
            port = 80;
        }
    }

    // 如果端口存在且不是 80 或 443，则直连
    if (port !== null && port !== 80 && port !== 443) {
        return "DIRECT";
    }

    // --- 默认规则：所有不符合上述条件的流量走 SOCKS5 代理 ---
    return proxy;
}
