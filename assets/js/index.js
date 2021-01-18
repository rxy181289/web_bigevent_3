$(function () {
    // 1.获取用户信息
    getUserinfo()

    var layer = layui.layer
    // 3.实现退出功能
    $('#btnlogout').on('click', function () {
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            // 退出本地存储
            localStorage.removeItem('token')
            // 跳转到登录页
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });
    })
})

function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 2.渲染用户头像
            randerAvatar(res.data)
        },
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 退出本地存储
        //         localStorage.removeItem('token');
        //         // 跳转页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

function randerAvatar(user) {
    // 渲染名称
    var name = user.nickname || user.username
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first)
    }
}