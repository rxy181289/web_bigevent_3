$(function () {
    var layer = layui.layer
    var form = layui.form

    // 1.初始化分类
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(Res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3. 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮，选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 5.设置图片
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]

        // 非空校验！
        if (file == undefined) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)

        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = "已发布"
    // $('#btnSave1').on('click', function () {
    //     state = '已发布'
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7.添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append('state', state)
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                fd.append('cover_img', blob)
                // 发送ajax, 要在toBlob()函数里面
                // console.log(...fd);
                publisherArticle(fd)
            })
    })

    // 封装，添加文章的方法
    function publisherArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // FormData数据类型提交ajax,需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('发布文章成功')
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art-list').click()
                }, 1500)
            }
        })
    }
})