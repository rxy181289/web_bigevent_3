$(function () {
    $('#reg_box').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
    })

    $('#login_box').on('click', function () {
        $('.login_box').show()
        $('.reg_box').hide()
    })

    // 2.自定义表单验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须6-16位，不能有空格'
        ],

        repwd: function (value) {
            var pwd = $('.reg_box [name=password]').val();
            if (value !== pwd) {
                return '两次的密码输入并不一致'
            }
        }
    })

    // 3.注册
    $('#reg_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box [name=username]').val(),
                password: $('.reg_box [name=password]').val()
            },
            success: function (res) {
                // 注册失败
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 注册成功
                layer.msg('注册成功，去登录')
                $('#login_box').click()
                $('#reg_form')[0].reset()
            }
        })
    })

    // 4.登录
    $('#login_form').on('submit', function (e) {
        e.preventDefault()
        console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // 登陆失败
                    return layer.msg(res.message)
                }
                // 登录成功
                layer.msg('登录成功')
                // 将token本地存储
                localStorage.setItem('token', res.token)
                // 跳转页面
                location.href = '/index.html'
            }
        })

    })
})