var baseURL = 'http://api-breakingnews-web.itheima.net'
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url);

    // 对需要权限的接口配置头信息
    // 必须以my开头才行
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 拦截所有响应，判断身份认证信息
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 退出本地存储
            localStorage.removeItem('token');
            // 跳转页面
            location.href = '/login.html'
        }
    }
})