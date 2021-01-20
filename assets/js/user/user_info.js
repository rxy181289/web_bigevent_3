$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度在1~6位之间'
            }
        }
    })

    // 2.用户渲染
    getUserInfo()
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('getUserInfo', res.data)
            }
        })
    }

    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        getUserInfo()
    })

    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改信息成功')
                window.parent.getUserinfo()
            }
        })
    })
})