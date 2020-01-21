// 引入koa
const koa = require('koa');
const app = new koa();
const session = require('koa-session');

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
const router = require('koa-router')();
const views = require('koa-views');
const query = require('./db')
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'kaikeba:sess',
    /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true,
    /** (boolean) automatically commit headers (default true) */
    overwrite: false,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: false,
    /** (boolean) httpOnly or not (default true) */
    signed: false,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));


app.use(async (ctx, next) => {
    await next()
    // 参数出现在HTML内容或属性浏览器会拦截
    ctx.set('X-XSS-Protection', 0)//禁止xss过滤；
    // ctx.set('Content-Security-Policy', "default-src 'self'")
    ctx.set('X-FRAME-OPTIONS', 'DENY')//点击劫持，不能被嵌入到任何iframe或者frame中
    // const referer = ctx.request.header.referer
    // console.log('Referer:', referer)

    // const referer = ctx.request.header.referer
    // console.log('Referer:', referer)

})
// const helmet = require('koa-helmet')
// app.use(helmet())


router.get('/', async (ctx) => {
    res = await query('select * from test')//获取数据库数据；
    console.log(res)
    // ctx.set('X-FRAME-OPTIONS', 'DENY')
    await ctx.render('index', {
        from: ctx.query.from,
        username: ctx.session.username,
        //text: res[0].text,//
        text: '1111111',
    });
});



router.get('/login', async (ctx) => {
    await ctx.render('login');
});

const encryptPassword = require('./password')
router.post('/login', async (ctx) => {

    const { username, password } = ctx.request.body

    // 可注入写法
    let sql = `
    SELECT *
    FROM test
    WHERE user = '${username}'
    AND text = '${password}'
    `
    console.log('sql', sql)
    res = await query(sql)
    console.log('db', res)
    if (res.length !== 0) {//数据库有数据；
        ctx.redirect('/?from=china')
        console.log(ctx.request.body.username)
        ctx.session.username = ctx.request.body.username
    }

});



app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app