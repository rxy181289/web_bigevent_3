$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1.文章类别列表展示
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-art-cate', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2.显示文章添加分类列表
    var indexAdd = null
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        })
    })

    // 3.提交文章分类添加
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('文章分类添加成功')
                layer.close(indexAdd)
            }
        })
    })

    // 4.修改-展示表单
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        })

        // 获取Id, 发送ajax获取数据,渲染到页面
        var Id = $(this).attr('data-id')
        $.ajax({
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改-提交
    $('body').on('submit', '#edit-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('文章类别更新成功')
                layer.close(indexEdit)
            }
        })
    })

    // 5.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 更新成功，所以要重新渲染页面中的数据
                    initArtCateList()
                    layer.msg('文章类别删除成功')
                    layer.close(index)
                }
            })
        })
    })
})