function FindProxyForURL(url, host) {
    // 定义 SOCKS5 代理服务器地址
    var proxy = "SOCKS5 [IP_ADDRESS]:8384";

    // --- 规则1：所有内网 IP 走直连 ---
    if (
        host === "[IP_ADDRESS]" ||
        isInNet(host, "10.0.0.0", "[IP_ADDRESS]") ||
        isInNet(host, "[IP_ADDRESS]", "[IP_ADDRESS]") ||
        isInNet(host, "[IP_ADDRESS]", "[IP_ADDRESS]") ||
        isInNet(host, "[IP_ADDRESS]", "[IP_ADDRESS]") ||
        isInNet(host, "[IP_ADDRESS]", "[IP_ADDRESS]")
    ) {
        return "DIRECT";
    }

    // --- 规则2：特定域名和所有含 "amazon"、".aws"、"aws."、"slack"或"chime" 关键字的域名走直连 ---
    if (
        host.indexOf("amazon") !== -1 ||
        host.indexOf(".aws") !== -1 || // 包含 .aws (例如 chime.aws)
        host.indexOf("aws.") !== -1 || // 包含 aws. (例如 aws.amazon.com)
        host.indexOf("slack") !== -1 || // 包含 slack
        host.indexOf("chime") !== -1 || // 包含 chime
        host === "luum.com" ||
        host.endsWith(".luum.com") ||
        host === "a2z.com" ||
        host.endsWith(".a2z.com")
    ) {
        return "DIRECT";
    }

    // --- 规则3：非 80 和 443 端口的流量走直连 ---
    var port = null;
    var colonIndex = url.lastIndexOf(":");
    var slashIndex = url.indexOf("/", colonIndex);
    
    if (colonIndex > -1 && (slashIndex === -1 || colonIndex < slashIndex)) {
        if (slashIndex === -1) {
            port = parseInt(url.substring(colonIndex + 1));
        } else {
            port = parseInt(url.substring(colonIndex + 1, slashIndex));
        }
    } else {
        if (url.startsWith("https://")) {
            port = 443;
        } else {
            port = 80;
        }
    }

    if (port !== null && port !== 80 && port !== 443) {
        return "DIRECT";
    }

    // --- 默认规则：所有不符合上述条件的流量走 SOCKS5 代理 ---
    return proxy;
}
