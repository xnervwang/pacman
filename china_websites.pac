function FindProxyForURL(url, host) {
    // 定义需要通过代理的域名列表
    var proxyDomains = {
        "baidu.com": 1, "qq.com": 1, "weixin.com": 1, "weibo.com": 1, "bilibili.com": 1,
        "bilivideo.com": 1, "biliapi.net": 1, "taobao.com": 1, "tmall.com": 1, "jd.com": 1,
        "alipay.com": 1, "sina.com.cn": 1, "sohu.com": 1, "ifeng.com": 1, "people.com.cn": 1,
        "xinhuanet.com": 1, "163.com": 1, "huanqiu.com": 1, "zhihu.com": 1, "douyin.com": 1,
        "xigua.com": 1, "kuaishou.com": 1, "youku.com": 1, "iqiyi.com": 1, "tencent.com": 1,
        "mi.com": 1, "xiaomi.com": 1, "bytedance.com": 1, "csdn.net": 1, "36kr.com": 1,
        "tianyancha.com": 1, "eastmoney.com": 1
    };

    // 定义 SOCKS5 代理服务器地址
    var proxy = "SOCKS5 127.0.0.1:8384";

    // 提取主域名
    var parts = host.split('.');
    var domain = parts.slice(-2).join('.');

    // 检查主域名是否在代理列表中
    if (proxyDomains[domain]) {
        return proxy;
    }

    // 默认直接连接
    return "DIRECT";
}
