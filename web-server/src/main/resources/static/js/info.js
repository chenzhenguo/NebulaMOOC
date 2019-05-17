$('#avatarInput').on('change', function (e) {
    var filemaxsize = 1024 * 5;//5M
    var target = $(e.target);
    var Size = target[0].files[0].size / 1024;
    if (Size > filemaxsize) {
        alert('图片过大，请重新选择!');
        $(".avatar-wrapper").childre().remove;
        return false;
    }
    if (!this.files[0].type.match(/image.*/)) {
        alert('请选择正确的图片!')
    } else {
        var filename = document.querySelector("#avatar-name");
        var teststr = document.querySelector("#avatarInput").value;
        testend = teststr.match(/[^\\]+\.[^\(]+/i); //直接完整文件名的
        filename.innerHTML = testend;
    }

});

$(".avatar-save").on("click", function () {
    var img_lg = document.getElementById('imageHead');
    // 截图小的显示框内的内容
    html2canvas(img_lg, {
        allowTaint: true,
        taintTest: false,
        onrendered: function (canvas) {
            canvas.id = "mycanvas";
            //生成base64图片数据
            var dataUrl = canvas.toDataURL("image/jpeg");
            var imgfile = convertBase64UrlToBlob(dataUrl);
            imagesAjax(imgfile);
        }
    });
});

function imagesAjax(file) {
    var formData = new FormData();
    formData.append('file', file);  //添加图片信息的参数
    $.ajax({
        url: "/api/file/uploadHead",
        data: formData,
        type: "POST",
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        success: function (data) {
            if (data.code == 100) {
                toastr.success('上传成功');
            } else {
                toastr.warning(data.msg);
            }
        },
        error: function () {
            toastr.error('上传失败');
        }
    });
}

/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 * 用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData) {

    var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {type: 'image/jpeg'});
}

var sexChoice = 0;

$("#boy-c").on('click', function () {
    sexChoice = 1;
    $(this).prop('checked', true);
    $("#girl-c").prop('checked', false);
});
$("#girl-c").on('click', function () {
    sexChoice = 2;
    $(this).prop('checked', true);
    $("#boy-c").prop('checked', false);
});

function initInfo() {
    getInfo({}, function (data) {
        console.log(data);
        if (data.code == 100) {
            var info = data.data;
            $('.headimg-view').attr('src', 'https://nebula-head.oss-cn-shenzhen.aliyuncs.com/' + info.headUrl + '/head100');
            $('#user-mail').html(info.email);
            $('#input-user-name').val(info.nickName);
            sexChoice = info.sex;
            if (info.sex == 1) {
                $('#boy-c').prop('checked', true);
            } else if (info.sex == 2) {
                $('#girl-c').prop('checked', true);
            }


        } else {
            toastr.warning('获取个人信息失败');
        }
    })
}

initInfo();