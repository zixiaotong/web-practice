/** 商品新增JS **/
/*0不需要，1需要。a:首次选择大项中的小项；b:删除一个不为空的大项(包括变更)；c:删除小项后大项为空。*/
var needClear = 0;
/*选出的大项集合 里面是小项集合*/
var selectSpec = new Array();
//里面存放最后组合好的规格
var resultBk = new Array();
/*最终生成的规格表格元素集合*/
var tblArr = new Array();
var count = 0;
KindEditor.ready(function(K) {
    var editor1 = K.create('#editor', {
        minHeight: 200,
        height: 400,
        imageSizeLimit: '1MB',
        //批量上传图片单张最大容量
        imageUploadLimit: 10,
        //批量上传图片同时上传最多个数
        items: ['source', '|', 'undo', 'redo', '|', 'preview', 'template', 'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript', 'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/', 'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak', 'anchor'],
        /** 配置kindeditor编辑器的工具栏菜单项 **/
        cssPath: 'kindeditor/plugins/code/prettify.css',
        uploadJson: basePathJs + '/uploadfile/uploadimg?ignoreTab=1&imgType=2',
        allowFileManager: false,
        afterCreate: function(data) {
            var self = this;
            K.ctrl(document, 13,
                function() {
                    self.sync();
                });
            K.ctrl(self.edit.doc, 13,
                function() {
                    self.sync();
                });
        },
        afterUpload: function(url) {
            this.sync();
        },
        afterChange: function() {
            //富文本输入区域的改变事件，一般用来编写统计字数等判断
            if (10000 - this.count() <= 0) {
                K('.word_count1').html("最多10000个字符,还剩0个字符,字符超长");
            } else {
                K('.word_count1').html("最多10000个字符,还剩" + (10000 - this.count()) + "个字符");
            }
            count = this.count();
        }
    });
    window.editor = editor1;
});

/*拖拽顺序*/
$(".filelist").dragsort({
    dragSelector: ".imgWrap",
    dragEnd: function() {},
    dragBetween: false,
    placeHolderTemplate: "<li></li>"
});

$(function() {
    /*图片拖拽*/
    $(".goodsImgWrap").dragsort({
        dragSelector: ".goodsImgItem",
        dragEnd: function() {},
        dragBetween: false,
        placeHolderTemplate: "<li></li>"
    });
    $(".bg-fa .alert .close").click(function() {
        $(this).parents('.bg-fa').hide();
    });
    specCheck();
    $('.setSpecCheck').click(function() {
        specCheck();
    });
    $('.userPrice').click(function() {
        if ($("#ghsId").val() == 0) {
            alert_common("请选择供货商！");
            $('#userPrice').attr('checked', false);
            return;
        }
        specCheck();
        //SKU.showSupermarketInfo(63); //触发显示超市 sku 定价页面
    });
    //弹出规格值
    /**$(".addLabelWrap a").click(function(enevt){
        $(this).parent('.addLabelWrap').find('.addLabelInput').show();
        event.stopPropagation();
    });**/
    $('.addLabelInput .btnQX').click(function() {
        $(this).parents('.addLabelWrap').find('.addLabelInput').hide();
    })
    /*按客户单价指定添加超市*/
    $('.jsdown-menu li input[type="checkbox"]').each(function() {
        $(this).attr("data-id", "0");
    });
    /*获取商品分类*/
    //SPU.category();
    $('#product_classWarp').goodMenus({
        "type": "post",
        "url": basePathJs + "/addgoods/listcate"
    });
    SPU.categoryInput("product_class_text", "catAll");
    /*商品品牌*/
    SPU.brand();
    //供货商
    SPU.ghs();
    //单品名称信息
    SPU.spuName();
    initial();
    // 隐藏销售状态
    $("#xszt").hide();
    /*新增商品录入===============================*/
    $('#bigUnitId').on('change',
        function() {
            var val = $('#bigUnitId option:selected').val();
            if (val == -1) {
                $('#s-conversion').hide(); //单位换算
                $('#specification_div').show(); //包装规格
                $("#unitTransfer").val(''); //单位换算的值
                $("#scount").val(1);
                $('#bigMinOrderNum').hide(); //大单位起订量
                $('#big_min_order_num').val(1); //大单位起订量
                $('#smallUnitSetting').show();
                $('#bigUnitSetting').hide();
                $('#tdSmallUnitPrice').show();
                $('#tdSmallUnitLadderPrice').hide();
            } else {
                $('#s-conversion').show();
                $('#specification_div').hide();
                $('#specification_div').val('');
                $('#bigMinOrderNum').show();
                $('#smallUnitSetting').hide();
                $('#bigUnitSetting').show();
                $('#tdSmallUnitPrice').hide();
                $('#tdSmallUnitLadderPrice').show();
            }
            needClear = 1;
            preCombineV2();
            /*生成表格*/
            createTbl();
            changeTidupriceStyle();
        });
    $('#smallUnitId').on('change',
        function() {
            setUnit();
        });
    /*新增商品录入 end===============================*/
    questionTipsFn();
})

/*获取隐藏元素的高度和宽度*/
; (function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register module depending on jQuery using requirejs define.
        define(['jquery'], factory);
    } else {
        // No AMD.
        factory(jQuery);
    }
} (function($) {
    $.fn.addBack = $.fn.addBack || $.fn.andSelf;

    $.fn.extend({

        actual: function(method, options) {
            // check if the jQuery method exist
            if (!this[method]) {
                throw '$.actual => The jQuery method "' + method + '" you called does not exist';
            }

            var defaults = {
                absolute: false,
                clone: false,
                includeMargin: false,
                display: 'block'
            };

            var configs = $.extend(defaults, options);

            var $target = this.eq(0);
            var fix, restore;

            if (configs.clone === true) {
                fix = function() {
                    var style = 'position: absolute !important; top: -1000 !important; ';

                    // this is useful with css3pie
                    $target = $target.clone().attr('style', style).appendTo('body');
                };

                restore = function() {
                    // remove DOM element after getting the width
                    $target.remove();
                };
            } else {
                var tmp = [];
                var style = '';
                var $hidden;

                fix = function() {
                    // get all hidden parents
                    $hidden = $target.parents().addBack().filter(':hidden');
                    style += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';

                    if (configs.absolute === true) style += 'position: absolute !important; ';

                    // save the origin style props
                    // set the hidden el css to be got the actual value later
                    $hidden.each(function() {
                        // Save original style. If no style was set, attr() returns undefined
                        var $this = $(this);
                        var thisStyle = $this.attr('style');

                        tmp.push(thisStyle);
                        // Retain as much of the original style as possible, if there is one
                        $this.attr('style', thisStyle ? thisStyle + ';' + style: style);
                    });
                };

                restore = function() {
                    // restore origin style values
                    $hidden.each(function(i) {
                        var $this = $(this);
                        var _tmp = tmp[i];

                        if (_tmp === undefined) {
                            $this.removeAttr('style');
                        } else {
                            $this.attr('style', _tmp);
                        }
                    });
                };
            }

            fix();
            // get the actual value with user specific methed
            // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
            // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
            var actual = /(outer)/.test(method) ? $target[method](configs.includeMargin) : $target[method]();

            restore();
            // IMPORTANT, this plugin only return the value of the first element
            return actual;
        }
    });
}));
//更新页面多规格初始化
function initSpecificationItem(spujson) {
    var skusArray = spujson.singleSkus;
    if (skusArray != null && skusArray.length > 0) {
        var skuAttrsArray = skusArray[0].singleSkuAttrs;
        for (var i = 0; i < skuAttrsArray.length; i++) {
            var selectSpecificationsName = skuAttrsArray[i].select_specifications_name;
            var specificationsId = skuAttrsArray[i].specifications_id;
            var specificationsName = skuAttrsArray[i].specifications_name;
            if (skuAttrsArray[i].specifications_name == "净含量") {
                //将值添加到当前值列表
                var html = '<div class="form-group pull-left inline relative p-xxs m-r pop-info">';
                html += '<div class="labelBox">' + selectSpecificationsName + '</div>';
                html += '<em class="delItmeImg" onclick="javascript:removeSpecificationVal(this,loseHashCode(selectSpecificationsName));"></em>';
                html += '</div>';
                $(".selectSpecificationListDiv").after(html);
                $("#thJingHanLiangTD").text(selectSpecificationsName);
                $("#thJingHanLiang").attr("data-id", specificationsId);
                $("#thJingHanLiang").attr("data-text", specificationsName);
                $(".btn-xs").hide();
            }
            if (skuAttrsArray[i].specifications_name != "净含量") {
                initskuAttrHtml(specificationsId, specificationsName, selectSpecificationsName, spujson.big_unit_id);
                oldspecificationVal = specificationsId;

            }
        }

    }
}

//初始化多规格选择页面
function initskuAttrHtml(specificationsId, specificationsName, selectSpecificationsName, big_unit_id) {
    //异步获取动态规格属性名称
    $.ajax({
        type: "post",
        url: basePathJs + "/addgoods/specificationItem?r=" + Math.random(),
        data: {},
        success: function(d) {
            if (d.code == 1) {
                if (d.data != null) {
                    var items = d.data;
                    if (items != null) {
                        var html = '<div class="itemWrap">';
                        html += '<div class="alert alert-default alert-dismissable selectSpecificationListDiv">';
                        html += '<select class="form-control pull-left w-100" lastChoice="-1" onchange="javascript:specificationChange(this);">';
                        html += '<option value="-1">请选择</option>';
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].name != '净含量') {
                                if (specificationsId == items[i].id) {
                                    html += '<option value="' + items[i].id + '" selected>' + items[i].name + '</option>';
                                } else {
                                    html += '<option value="' + items[i].id + '">' + items[i].name + '</option>';
                                }
                            }
                        }
                        html += '</select>';
                        html += '<button type="button" aria-hidden="true" data-dismiss="alert" class="pull-right" onclick="javascript:removeSpecification(this);" style="background:none;border:none"><em class="icon-16 icon-erro"></em></button>';
                        html += '<div class="clearfix"></div></div>';

                        html += '<div class="form-group pull-left inline relative p-xxs m-r pop-info">';
                        html += '<div class="labelBox">' + selectSpecificationsName + '</div>';
                        html += '<em class="delItmeImg" onclick="javascript:removeSpecificationVal(this,loseHashCode(selectSpecificationsName));"></em>';
                        html += '</div>';

                        html += '<div class="form-group inline relative p-xxs m-r addLabelWrap">';
                        html += '<button type="button" class="btn btn-success btn-xs" onclick="javascript:popSpecificationValDiv(this);" style="display: none;">+规格值</button>';
                        html += '<div class="addLabelInput" style="display: none">';
                        html += '<div class="w-200 pull-left">';
                        html += '<input type="text" class="form-control"/></div>';
                        html += '<div class="pull-left m-l-md">';
                        html += '<button type="button" class="btn btn-primary" onclick="javascript:addSpecificationVal(this);">确定</button>';
                        html += '<button type="button" class="btn btn-default m-l btnQX" onclick="javascript:closeSpecificationVal(this);">取消</button>';
                        html += '</div></div></div>';
                        $("#jingHanLiangItemWrap").after(html);

                        //初始化新增列
                        $("#tblSimpleSku>thead>tr>th[class=\"dyAttr skuTitle\"]").after('<th class="skuTitle" data-id="' + specificationsId + '" data-text="' + specificationsName + '" style="width: 150px;"><span class="text-danger">*</span>' + specificationsName + '</th>');
                        if (big_unit_id > 0) {
                            $("#tblSimpleSku>tbody>tr>td[class=\"dyAttr skuVal\"]").after('<td class="skuVal" rowspan="2" data-id="' + specificationsId + '">' + selectSpecificationsName + '</td>');
                        } else {
                            $("#tblSimpleSku>tbody>tr>td[class=\"dyAttr skuVal\"]").after('<td class="skuVal" data-id="' + specificationsId + '">' + selectSpecificationsName + '</td>');
                        }

                        // 隐藏添加规格项 2017-08-15业务需求 只添加一个值
                        $(".specificationItem").hide();
                    }
                }

            } else {
                alert_common(d.msg);
            }
        },
        complete: function() {

        }
    });
}

//关于比较的校验写到这个方法里，在提交的时候统一判断
function validSubmit() {
    //校验销售单位属性
    var sel = $('#smallUnitId option:selected').val();
    var bigUnitId = $('#bigUnitId option:selected').val();
    if (bigUnitId != -1 && sel != -1) {
        if (bigUnitId == sel) {
            alert_common("大小单位不能选择同一个！");
            return false;
        }
    }
    //sku属性校验
    var skuTitleTh = $(".skuTitle").length;
    if (skuTitleTh < 2) {
        alert_common("设置商品规格");
        return false;
    }

    var colNum = 0;
    $('#tblSimpleSku .skuVal').each(function(i, val) {
        //表列值
        var specificationVal = $(this).text();
        if (specificationVal == undefined || specificationVal == null || specificationVal == '') {
            colNum += 1;
        }
    });
    if (colNum > 0) {
        alert_common("请填写商品规格值!");
        return false;
    }

    if ($(".filelist").find("li").length <= 0) {
        alert_common("主图不能为空");
        return false;
    }
    if (!seacherProduct()) {
        alert_common("无效的商品分类");
        return false;
    }
    if ($("#brandId").val() == undefined || $("#brandId").val() == "") {
        alert_common("无效的品牌");
        return false;
    }
    if ($("#ghsId").val() == 0) {
        alert_common("无效的供货商");
        return false;
    }
    if (count > 10000) {
        alert_common("商品描述超长");
        return false;
    }
    if (!uniNum($("#unitTransfer"))) {
        alert_common("单位换算填写有误");
        return false;
    }

    if ($("#isyuncang").val() == "1") {
        alert_common("当前供货商为云仓供货商,不允许录入商品");
        return false;
    }
    return true;
}

function validSku() {
    //净含量下的规格值为必填项
    for (var i = 0; i < selectSpec.length; i++) {
        if (selectSpec[i].specId == 1) {
            if (selectSpec[i].specItems == 0) {
                alert_common("净含量下的规格值为必填项");
                return;
            }
        }
    }
    var trList = $("#tblSimpleSku tr");
    var biUnitval = $('#bigUnitId option:selected').val();
    for (var i = 0; i < trList.length; i++) {
        if (trList.eq(i).find("input[name=Fruit]").prop('checked')) {
            var priceSingle = trList.eq(i).find("input[name=priceSingle]").val();
            var retailprice = trList.eq(i).find("input[name=retailprice]").val();
            var smallUnitCodeSingle = trList.eq(i).find("input[name=smallUnitCodeSingle]").val();
            var goodsStockSingle = trList.eq(i).find("input[name=goodsStockSingle]").val();
            var goodsNo = trList.eq(i).find("input[name=goodsNo]").val();

            var big_priceSingle = trList.eq(i + 1).find("input[name=big_priceSingle]").val();
            var big_retailprice = trList.eq(i + 1).find("input[name=big_retailprice]").val();
            var big_unit_code = trList.eq(i + 1).find("input[name=big_unit_code]").val();

            var tiduprice = $("input[name=tiduprice]:checked").val();
            if (tiduprice == 0) {
                if (priceSingle == "") {
                    alert_common("请输入已启用的小单位价格");
                    return false;
                }
                if (!/^\d+(\.\d{1,2})?$/.test(priceSingle)) {
                    alert_common("已启用的小单位价格只能是正数,最多保留两位小数");
                    return false;
                }
                if (parseFloat(priceSingle) <= 0) {
                    alert_common("已启用的小单位价格必须大于0");
                    return false;
                }
                if (parseFloat(priceSingle) > 999999.99) {
                    alert_common("已启用的小单位价格最大值为999999.99");
                    return false;
                }
            } else {
                if (trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata") == "") {
                    alert_common("请输入已启用的小单位阶梯价");
                    return false;
                }
            }

            if (retailprice != "") {
                if (!/^\d+(\.\d{1,2})?$/.test(retailprice)) {
                    alert_common("已启用的小单位建议零售价只能是正数,最多保留两位小数");
                    return false;
                }
                if (parseFloat(retailprice) > 999999.99) {
                    alert_common("已启用的小单位建议零售价最大值为999999.99");
                    return false;
                }
            }
            if (smallUnitCodeSingle == "") {
                alert_common("请输入已启用的小单位条形码");
                return false;
            }
            if (!/^\d+(\.\d{1,2})?$/.test(smallUnitCodeSingle)) {
                alert_common("已启用的小单位条形码只能是正数");
                return false;
            }

            if (parseFloat(smallUnitCodeSingle) <= 0) {
                alert_common("已启用的小单位条形码必须大于0");
                return false;
            }
            if (goodsStockSingle == "") {
                alert_common("请输入已启用的库存");
                return false;
            }
            if (parseFloat(goodsStockSingle) > 999999.99) {
                alert_common("已启用的库存最大值为999999.99");
                return false;
            }
            if (parseFloat(goodsStockSingle) < 0) {
                alert_common("已启用的库存不能是负数");
                return false;
            }
            var min_order_num = $("#min_order_num").val();
            if (parseFloat(min_order_num) > parseFloat(goodsStockSingle)) {
                alert_common("已启用的库存必须大于等于小单位起订量");
                return false;
            }
            if (biUnitval != -1) {
                var big_min_order_num = $("#big_min_order_num").val();
                if (parseFloat(big_min_order_num) > parseFloat(goodsStockSingle)) {
                    alert_common("已启用的库存必须大于等于大单位起订量");
                    return false;
                }
                if (parseFloat(big_min_order_num) > parseFloat(goodsStockSingle / $("#unitTransfer").val())) {
                    alert_common("已启用的库存/单位换算必须大于等于大单位起订量");
                    return false;
                }
            }
            if (goodsNo != "") {
                if (goodsNo.length > 20) {
                    alert_common("已启用的货品编码长度不能大于20");
                    return false;
                }
            }
            // 校验大单位的值
            if (biUnitval != -1) {
                if (big_priceSingle == "") {
                    alert_common("请输入已启用的大单位价格");
                    return false;
                }
                if (!/^\d+(\.\d{1,2})?$/.test(big_priceSingle)) {
                    alert_common("已启用的大单位价格只能是正数,最多保留两位小数");
                    return false;
                }
                if (parseFloat(big_priceSingle) <= 0) {
                    alert_common("已启用的大单位价格必须大于0");
                    return false;
                }
                if (parseFloat(big_priceSingle) > 999999.99) {
                    alert_common("已启用的大单位价格最大值为999999.99");
                    return false;
                }
                if (big_retailprice != "") {
                    if (!/^\d+(\.\d{1,2})?$/.test(big_retailprice)) {
                        alert_common("已启用的大单位建议零售价只能是正数,最多保留两位小数");
                        return false;
                    }
                    if (parseFloat(big_retailprice) > 999999.99) {
                        alert_common("已启用的大单位建议零售价最大值为999999.99");
                        return false;
                    }
                }
                if (big_unit_code == "") {
                    alert_common("请输入已启用的大单位条形码");
                    return false;
                }
                if (!/^\d+(\.\d{1,2})?$/.test(big_unit_code)) {
                    alert_common("已启用的大单位条形码只能是正数");
                    return false;
                }
                if (parseFloat(big_unit_code) <= 0) {
                    alert_common("已启用的大单位条形码必须大于0");
                    return false;
                }
            }
        }
    }
    return true;
}

//提交并继续新增数据
$('#submitAndContinue').click(function() {
    //如果未获取到佣金比例则重新获取佣金比例
    var catScale = $('#catCommissionRate').val();
    if (catScale == 0) {
        var catAll = $("#product_class_text").attr('data-id').split("&");
        var arrLength = catAll.length;
        if (arrLength == 6) {
            var cat_three_id = catAll[5];
            zbCommissionRate(cat_three_id);
        }
    }

    if (!validateData('addGoodForm').form()) {
        return false;
    } else if (!validSubmit()) {
        return false;
    } else if (!validSku()) {
        return false;
    } else {
        cleanColor(1);
        $.ajax({
            type: "post",
            url: basePathJs + "/addgoods/dosave?r=" + Math.random(),
            data: {
                "spuString": JSON.stringify(getSpuJson())
            },
            success: function(d) {
                if (d.code == 1) {
                    //location.reload();
                    window.location.href = basePathJs + "/addgoods/add?ignoreTab=1&r=" + Math.random();
                } else {
                    alert_common(d.msg);
                }
            },
            complete: function() {
                cleanColor(2);
            }
        })
    }
});

//提交并返回列表
$('#submitAndReturn').click(function() {
    //如果未获取到佣金比例则重新获取佣金比例
    var catScale = $('#catCommissionRate').val();
    if (catScale == 0) {
        var catAll = $("#product_class_text").attr('data-id').split("&");
        var arrLength = catAll.length;
        if (arrLength == 6) {
            var cat_three_id = catAll[4];
            zbCommissionRate(cat_three_id);
        }
    }
    if (!validateData('addGoodForm').form()) {
        return false;
    } else if (!validSubmit()) {
        return false;
    } else if (!validSku()) {
        return false;
    } else {
        cleanColor(1);
        $.ajax({
            type: "post",
            url: basePathJs + "/addgoods/dosave?r=" + Math.random(),
            data: {
                "spuString": JSON.stringify(getSpuJson())
            },
            success: function(d) {
                if (d.code == 1) {
                    addTab(basePathJs + '/goods/list', '新商品管理');
                    removeTab();
                } else {
                    alert_common(d.msg);
                }
            },
            complete: function() {
                cleanColor(2);
            }
        })
    }
});

function cleanColor(obj) {
    if (obj == 1) {
        $("#submitAndContinue").attr("disabled", true);
        $("#submitAndContinue").css("background-color", "#c2c2c2");
        $("#submitAndContinue").css("border-color", "#c2c2c2");
        $("#submitAndReturn").attr("disabled", true);
        $("#submitAndReturn").css("background-color", "#c2c2c2");
        $("#submitAndReturn").css("border-color", "#c2c2c2");
    } else {
        $("#submitAndContinue").attr("disabled", false);
        $("#submitAndContinue").css("background-color", "#18a689");
        $("#submitAndContinue").css("border-color", "#18a689");
        $("#submitAndReturn").attr("disabled", false);
        $("#submitAndReturn").css("background-color", "#18a689");
        $("#submitAndReturn").css("border-color", "#18a689");
    }
}
/*初始化界面元素*/
function initial() {
    var single_spu_id = $("#templateId").val();
    if (single_spu_id.length > 0) {
        $.post(basePathJs + "/goods/selectSingleSpuBySpuId?spuid=" + single_spu_id, "",
            function(d) {
                if (d.code > 0 && d.data != null) {
                    loadSpuAndSkuInfo(d.data);
                    initSpecificationItem(d.data);
                    projectUpLoader();
                }
            });
    } else {
        projectUpLoader();
    }
    //初始化selectSpec的值
    var newMap = {};
    /*代表添加大项*/
    tableColl(1, "净含量", 0, '');
}

/*切换*/
function specCheck() {
    /**
     var ischeck = $('.setSpecCheck').attr('checked');
     var ischeck2 = $('.userPrice').attr('checked');
     if(ischeck==undefined){
	        $('.setSpec').hide();
	        $('.noSetSpec').show();
	        $('#isMultiSpec').val(0);
	    }else{
	        $('.setSpec').show();
	        $('.noSetSpec').hide();
	        $('#isMultiSpec').val(1);
	    }
     if(ischeck2==undefined){
	        $('.selCs').hide();
	    }else{
	        $('.selCs').show();
	    }
     */
}
//用户输入条码 后确认  achao 2017年1月7日20:58:27
$("#barcodeConfirm").click(function() {
    var barcode = $('#barcode').val();
    if ($.trim(barcode).length == 0) {
        alert_common("请输入条形码！");
        return false;
    }
    $.post(basePathJs + "/addgoods/getsinglebybarcode", {
            "small_unit_code": barcode
        },
        function(d) {
            if (d.code == 1 && d.data != null) {
                $('#findBarcodeHint span').html(barcode);
                $('#findBarcodeHint').show();
                $('#canotFindBarcodeHint').hide();
                loadSpuAndSkuInfo(d.data);
            } else {
                $('#canotFindBarcodeHint span').html(barcode);
                $('#canotFindBarcodeHint').show();
                $('#findBarcodeHint').hide();
            }
        })

});
/*获取spu json格式信息*/
function getSpuJson() {
    var json = {};
    json.shop_id = $("#ghsId").val();
    json.ss_id = $('#ssId').val();
    //供货商名字处理
    var ghsName = $("#ghsName").val();
    var str = "(帐号:";
    json.shop_name = ghsName.substring(0, ghsName.indexOf(str));
    json.shop_username = ghsName.substring(ghsName.indexOf(str) + str.length, ghsName.length - 1);
    json.spu_name = $("#spuName").val();
    json.headline = $("#headline").val();
    json.brand_id = $("#brandId").val();
    if (json.brand_id == -1) {
        json.brand_name = $("#inputOtherBrand").val();
    } else {
        json.brand_name = $("#brand").val();
    }

    var catAll = $("#product_class_text").attr('data-id').split("&");
    json.cat_one_id = catAll[0];
    json.cat_one_name = catAll[1];
    json.cat_two_id = catAll[2];
    json.cat_two_name = catAll[3];
    json.cat_three_id = catAll[4];
    json.cat_three_name = catAll[5];
    if ($("li.fileImgList").length > 0) {
        var goodsImg = [];
        for (var i = 0; i < $("li.fileImgList").length; i++) {
            if (i >= 1) {
                goodsImg.push($($("li.fileImgList")[i]).attr("data-url"));
            } else {
                json.main_image = $($("li.fileImgList")[0]).attr("data-url");
            }
        }
        var other_img = "";
        for (var i = 0; i < 5; i++) {
            if (i < goodsImg.length) {
                other_img += goodsImg[i];
            }
            if (i < 4) {
                other_img += "|";
            }
        }
        json.other_image = other_img;
    }
    json.is_import = $("#is_import").val();
    json.companyname = $("#companyname").val();
    json.producer = $("#producer").val();
    json.shelf_life = $("#shelf_life").val();
    json.shelf_life_unit = $("#shelf_life_unit").val();
    json.shelf_life_unit_text = $("#shelf_life_unit").find("option:selected").text();
    json.small_unit_id = $("#smallUnitId").val();
    json.small_unit_name = $.trim($("#smallUnitId").find("option:selected").text());
    var bigUnitId = $("#bigUnitId").val();
    json.big_unit_id = (bigUnitId == null ? -1 : bigUnitId);
    if (json.big_unit_id == -1) {
        json.big_unit_name = "";
    } else {
        json.big_unit_name = $.trim($("#bigUnitId").find("option:selected").text());
        json.big_min_buy_count = $("#big_min_order_num").val();
    }
    json.sale_unit = $("#sale_unit").val();
    json.min_buy_count = $("#min_order_num").val();
    json.is_return = $("#return_type").val();
    json.unit_transfer = $("#unitTransfer").val();
    json.safe_stock = $("#safe_stock").val();
    json.commission_rate = $("#commissionRate").val();
    json.shelves = $('input[name="shelves"]:checked').val();
    json.sale_model = $('input[name="sales_status"]:checked').val();
    //json.order_limit_num = $("#order_limit_num").val();
    json.service_content = $("#serviceContent").val();
    json.returndesc = $("#returndesc").val();

    json.add_user_type = "1"; //添加人用户类型，1服务站，0供货商
    json.template_id = $("#templateId").val();
    json.scount = $("#scount").val();
    json.skus = getSkuJson(); //sku信息
    json.spuDesc = getSpuDescJson();

    return json;
}
/*获取spu_desc json信息*/
function getSpuDescJson() {
    window.editor.sync();
    var json = {};
    /*json.spu_desc = encodeURI($('#editor').val());*/
    json.spu_desc = encodeURIComponent($('#editor').val());

    return json;
}
/*获取sku属性* achao 2017年1月10日14:13:51*/
function getSkuJson() {
    var skuArray = [];
    var trList = $("#tblSimpleSku tr");
    for (var i = 0; i < trList.length; i++) {
        if (trList.eq(i).find("input[name=Fruit]").prop('checked')) {

            var retailprice = trList.eq(i).find("input[name=retailprice]").val();
            var smallUnitCodeSingle = trList.eq(i).find("input[name=smallUnitCodeSingle]").val();
            var goodsStockSingle = trList.eq(i).find("input[name=goodsStockSingle]").val();
            var goodsNo = trList.eq(i).find("input[name=goodsNo]").val();

            var big_priceSingle = trList.eq(i + 1).find("input[name=big_priceSingle]").val();
            var big_retailprice = trList.eq(i + 1).find("input[name=big_retailprice]").val();
            var big_unit_code = trList.eq(i + 1).find("input[name=big_unit_code]").val();

            var sku = {
                'sku_no': goodsNo,
                'stock': goodsStockSingle,
                'retailprice': retailprice,
                'small_unit_code': smallUnitCodeSingle,
                /*此处添加大单位s属性*/
                'big_unit_price': big_priceSingle,
                'big_retailprice': big_retailprice,
                'big_unit_code': big_unit_code
            };

            //获取SKU参数信息
            var singleSkuAttrsArray = [];
            $('#tblSimpleSku thead th.skuTitle').each(function() {
                var singleSkuAttr = {
                    'specifications_id': $(this).attr('specnum') == undefined ? 0 : $(this).attr('specnum'),
                    'specifications_name': $(this).text().replace("*", "")
                };
                singleSkuAttrsArray.push(singleSkuAttr);
            });

            $(trList.eq(i).find("span")).each(function(i, val) {
                singleSkuAttrsArray[i].select_specifications_id = 0;
                singleSkuAttrsArray[i].select_specifications_name = $(this).text();
            });

            sku.skuAttrs = singleSkuAttrsArray;
            //指定价格
            var priceLevelList = $("#priceLevelList").val();
            var priceLevelArray = [];
            if (priceLevelList != null && priceLevelList != undefined && priceLevelList != '') {
                priceLevelArray = JSON.parse(priceLevelList);
            }
            sku.priceLevelList = priceLevelArray;

            sku.priceUserList = [];

            sku.priceList = [];

            /*如果设置的梯度价*/
            if ($("input[name=tiduprice]:checked").val() == 1) {
                var jtjJson = JSON.parse(trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata"));
                for (var x = 0; x < jtjJson.length; x++) {
                    var priceObj = {
                        'price': jtjJson[x].minPrice,
                        'price_type': 2,
                        'min_count': jtjJson[x].minCount,
                        'max_count': 0
                    };
                    if (x == jtjJson.length - 1) {
                        priceObj.max_count = jtjJson[x].minCount;
                    } else {
                        priceObj.max_count = jtjJson[x + 1].minCount - 1;
                    }
                    sku.priceList.push(priceObj);
                }
            } else {
                var priceObj = {
                    'price': trList.eq(i).find("input[name=priceSingle]").val(),
                    'price_type': 1,
                    'min_count': 0,
                    'max_count': 0
                };
                sku.priceList.push(priceObj);
            }
            skuArray.push(sku);
        }
    }
    if (skuArray.length == 0) {
        alert_common("最少启用一个sku！");
        return;
    }
    return skuArray;
}

function clearPageData() {
    location.reload();
}

function seacherProduct() {
    var inputVal = $("#product_class_text").val();
    if (catArray != null && catArray != undefined) {
        for (var o in catArray) {
            if (catArray[o].cglist != null) {
                for (var str in catArray[o].cglist) {
                    if (catArray[o].cglist[str].cglist != null) {
                        for (var search in catArray[o].cglist[str].cglist) {
                            if (catArray[o].cglist[str].cglist[search].name == inputVal) {
                                return true;
                            }
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
    return false;
}

/********************************************************************************************* 多规格操作 start ********************************************************************************************************/
//弹出规格值添加层
function popSpecificationValDiv(obj) {
    //校验有没有选择，没有选择提示选择
    var selectVal = $(obj).parent().parent().find(".selectSpecificationListDiv").find("select option:selected").text();
    if (selectVal == "请选择") {
        alert_common("请选择规格!");
        return;
    }
    $(obj).parent('.addLabelWrap').find('.addLabelInput').show();
    //获取焦点
    $(obj).parent('.addLabelWrap').find('input[type="text"]').focus();
    window.event.stopPropagation();
}
//关闭弹出层
function closeSpecificationVal(obj) {
    $(obj).parents('.addLabelWrap').find('.addLabelInput').hide();
}
//添加规格值（确定）
function addSpecificationVal(obj) {
    if (resultBk.length > 50) {
        alert_common("最多只能生成50条sku!");
        return;
    }
    var name = $(obj).parent().parent().find("input[type=text]").val();
    if (name == null || name == '') {
        alert_common("请输入规格值!");
        return;
    }
    if (name.length > 10) {
        alert_common("规格值最多只能输入10个字!");
        return;
    }
    var specId = loseHashCode(name);
    //将值添加到当前值列表
    var html = '<div class="form-group pull-left inline relative p-xxs m-r pop-info">';
    html += '<div class="labelBox">' + name + '</div>';
    html += '<em class="delItmeImg" onclick="javascript:removeSpecificationVal(this,' + specId + ');"></em>';
    html += '</div>';
    //关闭弹出层
    $(obj).parents('.addLabelWrap').find('.addLabelInput').hide();
    //清空值
    $(obj).parent().parent().find("input[type=text]").val("");
    var lengths = $(obj).parent().parent().parent().parent().find(".pop-info").length;
    if (lengths == 9) {
        $(obj).parent().parent().parent().find("button").hide();
    }
    //选中的规则项值文字内容
    var ptext = $(obj).parent().parent().parent().parent().find(".selectSpecificationListDiv").find("select option:selected").text();
    //选中的规则项ID值
    var pid = $(obj).parent().parent().parent().parent().find(".selectSpecificationListDiv").find("select option:selected").val();
    for (var i = 0; i < selectSpec.length; i++) {
        if (selectSpec[i].specId == pid) {
            var items = selectSpec[i].specItems;
            for (var y = items.length - 1; y >= 0; y--) {
                if (items[y].specName == name) {
                    alert_common("规格值" + name + "已存在");
                    return;
                }
            }
        }
    }
    var count = tableColl(pid, ptext, specId, name);
    if (count != 1) {
        $(obj).parent().parent().parent().parent().find(".addLabelWrap").before(html);
    }
}
//删除规格值
function removeSpecificationVal(obj, specId) {
    //删除值
    var selectVal = $(obj).parent().parent().find(".selectSpecificationListDiv").find("select option:selected").text();
    var selectOptionVal = $(obj).parent().parent().find(".selectSpecificationListDiv").find("select option:selected").val();
    var name = $(obj).prev().html();
    for (var h = tblArr.length - 1; h >= 0; h--) {
        if (tblArr[h]['ids'].indexOf(specId + "-" + name) != -1) {
            tblArr.splice(h, 1);
        }
    }
    for (var i = selectSpec.length - 1; i >= 0; i--) {
        if (selectSpec[i].specId == selectOptionVal) {
            var items = selectSpec[i].specItems;
            for (var y = items.length - 1; y >= 0; y--) {
                if (items[y].specId == specId) {
                    items.splice(y, 1);
                    needClear = 1;
                }
            }
            break;
        }
    }
    preCombineV2();
    /*生成表格*/
    createTbl();
    //显示添加值按钮
    $(obj).parent().parent().find("button").show();
    $(obj).parent().remove();

}
//公用操作Table,添加规格值
/**
 * 给SKU添加值
 * @param pid 选择规格ID
 * @param pText 选择规格Text
 * @param id 填写的SKU规格值生成的ID
 * @param name 填写的SKU规格值
 */
function tableColl(pid, pName, id, name) {
    needClear = 0;
    var newMap = {};
    /*代表添加大项*/
    if (id == 0) {
        newMap['specName'] = pName;
        newMap['specId'] = pid;
        newMap['specItems'] = new Array();
        selectSpec.push(newMap);
    } else {
        for (var i = 0; i < selectSpec.length; i++) {
            if (selectSpec[i].specId == pid) {
                newMap['pid'] = pid;
                newMap['pName'] = pName;
                newMap['specName'] = name;
                newMap['specId'] = id;
                if (selectSpec[i].specItems.length == 0) {
                    needClear = 1;
                }
                selectSpec[i].specItems.push(newMap);
                break;
            }
        }
    }
    preCombineV2();
    if (resultBk.length > 50) {
        alert_common("最多只能生成50条sku!");
        return 1;
    }
    /*生成表格*/
    createTbl();
}
/*生成表格*/
function createTbl() {
    /*需要清除表格和tblArr*/
    if (needClear == 1) {
        tblArr = new Array();
        $("#tblSimpleSku tbody").html("");
        /*重新生成表头*/
        createSpecCol();
    }
    /*0不存在；1存在*/
    var isExists = 0;
    for (var i = 0; i < resultBk.length; i++) {
        isExists = 0;
        var newObj = resultBk[i];
        for (var j = 0; j < tblArr.length; j++) {
            if (newObj["ids"] == tblArr[j]["ids"]) {
                isExists = 1;
                break;
            }
        }
        /*已经存在了*/
        if (isExists == 1) {
            continue;
        }
        doCreateTbl(newObj);
    }
}
function doCreateTbl(newObj) {
    tblArr.push(newObj);
    var index = "";
    var trHtml = "<tr>";
    var val = $('#bigUnitId option:selected').val();
    for (var i = 0; i < newObj['specItems'].length; i++) {
        if (val != -1) {
            if (i == 0) {
                trHtml += "<td rowspan='2'> <input name='Fruit' checked type=\"checkbox\"></td>";
            }
            trHtml += "<td width='10%' rowspan='2' class='specnum dyAttr skuVal' specNum=" + newObj['specItems'][i].specId + ">" + "<span class='specNameText'>" + newObj['specItems'][i].specName + "</span>" + "</td>";
        } else {
            if (i == 0) {
                trHtml += "<td> <input name='Fruit' checked type=\"checkbox\"></td>";
            }
            trHtml += "<td width='10%' class='specnum dyAttr skuVal' specNum=" + newObj['specItems'][i].specId + ">" + "<span class='specNameText'>" + newObj['specItems'][i].specName + "</span>" + "</td>";
        }
        index += newObj['specItems'][i].pid + "_" + newObj['specItems'][i].specId + "_";
    }
    trHtml += "<td>小单位</td>";
    trHtml += "<td name='tdPriceSingle'><input id=\"priceSingle\" name=\"priceSingle\" type=\"text\" class=\"w-150 text-center form-control input-xs\" value=\"\" maxlength=\"9\" onkeyup=\"this.value=this.value.replace(/^(\\-)*(\\d+)\\.(\\d\\d).*$/,'$1$2.$3')\"></td>";
    trHtml += "<td name='tdBid_price_ladder' style=\"display: none\"><a name='bid_price_ladder' ladderPriceData='' id=" + index + " class=\"modify\" href=\"javascript:void(0);\" onclick=\"javascript:jtjBidPrice(this)\">未设置</a></td>";
    trHtml += "<td><input id=\"retailprice\" name=\"retailprice\" type=\"text\" maxlength=\"9\" class=\"w-150 text-center form-control input-xs\" onkeyup=\"this.value=this.value.replace(/^(\\-)*(\\d+)\\.(\\d\\d).*$/,'$1$2.$3')\" value=\"\"></td>";
    trHtml += "<td><input id=\"smallUnitCodeSingle\" name=\"smallUnitCodeSingle\" type=\"text\" class=\"w-150 text-center form-control input-xs\" value=\"\" maxlength=\"20\"></td>";
    trHtml += "<td><input id=\"goodsStockSingle\" name=\"goodsStockSingle\" type=\"text\" maxlength=\"7\" class=\"w-150 text-center form-control input-xs\" onkeyup=\"this.value=this.value.replace(/\\D/g,'')\" onafterpaste=\"this.value=this.value.replace(/\\D/g,'')\" value=\"\"></td>";
    trHtml += "<td><input id=\"goodsNo\" name=\"goodsNo\" type=\"text\" class=\"w-150 text-center form-control input-xs\" value=\"\" maxlength=\"20\"></td>";

    if (val != -1) {
        trHtml += "<tr id='bigunittr'>";
    } else {
        trHtml += "<tr id='bigunittr' style='display: none'>";
    }
    trHtml += "<td>大单位</td>";
    trHtml += "<td><input id=\"big_priceSingle\" name=\"big_priceSingle\" type=\"text\" class=\"w-150 text-center form-control input-xs\" value=\"\" maxlength=\"9\" onkeyup=\"this.value=this.value.replace(/^(\\-)*(\\d+)\\.(\\d\\d).*$/,'$1$2.$3')\"></td>";
    trHtml += "<td><input id=\"big_retailprice\" name=\"big_retailprice\" type=\"text\" class=\"w-150 text-center form-control input-xs\" value=\"\" maxlength=\"9\" onkeyup=\"this.value=this.value.replace(/^(\\-)*(\\d+)\\.(\\d\\d).*$/,'$1$2.$3')\"></td>";
    trHtml += "<td><input id=\"big_unit_code\" name=\"big_unit_code\" type=\"text\" class=\"w-150 text-center form-control input-xs\" value=\"\" maxlength=\"20\"></td>";
    trHtml += "<td></td>";
    trHtml += "<td></td>";
    trHtml += "</tr>";

    trHtml += "</tr>";
    $("#tblSimpleSku tbody").append(trHtml);
    changeTidupriceStyle();
}
function createSpecCol() {
    /*先将表头恢复*/
    var nameIndex = $('#tblSimpleSku thead th[name="dw"]').index();
    for (var i = 0; i < nameIndex; i++) {
        $('#tblSimpleSku thead th').eq(0).remove();
    }
    $("<th width='11%'> <label> <input id='all' type='checkbox'>启用SKU </label> </th>").insertBefore($("th[name='dw']"));
    for (var i = 0; i < selectSpec.length; i++) {
        if (selectSpec[i].specItems.length == 0) {
            continue;
        }
        var selectName = selectSpec[i].specName;
        var selectId = selectSpec[i].specId;
        $("th[name='dw']").each(function() {
            $("<th width='10%' class=\"dyAttr skuTitle\" specNum=" + selectId + ">" + selectName + "</th>").insertBefore(this);
        });
    }
}
function preCombineV2() {
    resultBk = new Array();
    combineV2(0, {});
}
function combineV2(index, current) {
    if (index < selectSpec.length - 1) {
        var thisItem = selectSpec[index];
        var items = thisItem.specItems;
        if (items.length == 0) {
            combineV2(index + 1, current);
        }
        for (var i = 0; i < items.length; i++) {
            if (!items[i]) continue;
            var newMap = {};
            newMap = $.extend(true, newMap, current);
            if (typeof(newMap['specItems']) == 'undefined') {
                newMap['specItems'] = new Array();
                newMap['specItems'].push(items[i]);
            } else {
                newMap['specItems'].push(items[i]);
            }
            if (typeof(newMap['ids']) == 'undefined') {
                newMap['ids'] = items[i]['specId'] + "-" + items[i]['specName'];
            } else {
                newMap['ids'] = newMap['ids'] + "-" + items[i]['specId'] + "-" + items[i]['specName'];
            }
            combineV2(index + 1, newMap);
        }
    } else if (index == selectSpec.length - 1) {
        var thisItem = selectSpec[index];
        var items = thisItem.specItems;

        if (items.length == 0) {
            pushToResultBk(current);
        }
        for (var i = 0; i < items.length; i++) {
            if (!items[i]) continue;
            var newMap = {};
            newMap = $.extend(true, newMap, current);
            if (typeof(newMap['specItems']) == 'undefined') {
                newMap['specItems'] = new Array();
                newMap['specItems'].push(items[i]);
            } else {
                newMap['specItems'].push(items[i]);
            }
            if (typeof(newMap['ids']) == 'undefined') {
                newMap['ids'] = items[i]['specId'] + "-" + items[i]['specName'];
            } else {
                newMap['ids'] = newMap['ids'] + "-" + items[i]['specId'] + "-" + items[i]['specName'];
            }
            pushToResultBk(newMap);
        }
    }
}
function pushToResultBk(obj) {
    if (typeof(obj["ids"]) != 'undefined') {
        resultBk.push(obj);
    }
}
//添加规格项
function addSpecificationItems(obj) {
    //异步获取动态规格属性名称
    $.ajax({
        type: "post",
        url: basePathJs + "/addgoods/specificationItem?r=" + Math.random(),
        data: {},
        success: function(d) {
            if (d.code == 1) {
                if (d.data != null) {
                    var html = addSpecificationItemsHtml(d.data);
                    $(obj).parent().parent().find(".clearLineDiv").before(html);
                    var itemWraplength = $(".itemWrap").length;
                    if (itemWraplength == 5) {
                        $(".specificationItem").hide()
                    }
                }
            } else {
                alert_common(d.msg);
            }
        },
        complete: function() {

        }
    });

}
//拼接HTML代码
function addSpecificationItemsHtml(items) {
    // var html = '<div class="itemWrap">';
    var html = '<div class="itemWrap">';
    html += '<div class="alert alert-default alert-dismissable selectSpecificationListDiv">';
    html += '<select class="form-control pull-left w-100" lastChoice="-1" onchange="javascript:specificationChange(this);">';
    html += '<option value="-1">请选择</option>';
    for (var i = 0; i < items.length; i++) {
        if (items[i].name != '净含量') {
            html += '<option value="' + items[i].id + '">' + items[i].name + '</option>';
        }
    }
    html += '</select>';
    html += '<button type="button" aria-hidden="true" data-dismiss="alert" class="pull-right" type="button" onclick="javascript:removeSpecification(this);" style="background:none;border:none"><em class="icon-16 icon-erro"></em></button>';
    html += '<div class="clearfix"></div></div>';
    html += '<div class="form-group inline relative p-xxs m-r addLabelWrap">';
    html += '<button type="button" class="btn btn-success btn-xs" onclick="javascript:popSpecificationValDiv(this);">+规格值</button>';
    html += '<div class="addLabelInput" style="display: none">';
    html += '<div class="w-200 pull-left">';
    html += '<input type="text" class="form-control"/></div>';
    html += '<div class="pull-left m-l-md">';
    html += '<button type="button" class="btn btn-primary" onclick="javascript:addSpecificationVal(this);">确定</button>';
    html += '<button type="button" class="btn btn-default m-l btnQX" onclick="javascript:closeSpecificationVal(this);">取消</button>';
    html += '</div></div></div><div class="clearfix"></div>';
    return html;
}
//规格选择事件
var oldspecificationVal;
function specificationChange(obj) {
    //1\如果是重复的规格项，应该过滤掉不能添加，这个方法添加的都是数组里面没有的规格项
    //2\原来的规格项应该清空。tblArr也应该清空。
    //记录下上一次选择的值
    var lastChoice = $(obj).attr('lastChoice');
    var specificationVal = $(obj).find("option:selected").val();
    var specificationText = $(obj).find("option:selected").text();
    //请选择 删除列
    if (specificationVal == -1) {
        return;
    }
    for (var i = 0; i < selectSpec.length; i++) {
        if (selectSpec[i].specId == specificationVal) {
            alert_common(specificationText + "已存在");
            $(obj).find("option[value = '" + lastChoice + "']").attr("selected", "selected");
            return;
        }
    }
    if (specificationVal != oldspecificationVal) {
        needClear = 1;
        //走到这说明和之前选择的不一样
        // 删除添加的值
        $(obj).parent().parent().find(".pop-info").remove();
        $(obj).parent().parent().find("button").show();
        var x;
        for (var i = 0; i < selectSpec.length; i++) {
            if (selectSpec[i].specId == lastChoice) {
                x = i;
                var items = selectSpec[i].specItems;
                for (var y = items.length - 1; y >= 0; y--) {
                    for (var h = tblArr.length - 1; h >= 0; h--) {
                        if (tblArr[h]['ids'].indexOf(items[y].specId + "-" + items[y].specName) != -1) {
                            tblArr.splice(h, 1);
                        }
                    }
                }
                selectSpec.splice(i, 1);
            }
        }
        var newMap = {};
        newMap['specName'] = specificationText;
        newMap['specId'] = specificationVal;
        newMap['specItems'] = new Array();
        if (x == undefined) {
            selectSpec.push(newMap);
        } else {
            selectSpec.splice(x, 0, newMap);
        }
        preCombineV2();
        /*生成表格*/
        createTbl();
    } else {
        oldspecificationVal = specificationVal;
    }
    $(obj).attr('lastChoice', specificationVal);
}
//删除规格项
function removeSpecification(obj) {
    //获取当前规格项的值
    var specificationVal = $(obj).parent().find("select option:selected").val();
    //var specificationText = $(obj).parent().find("select option:selected").text();
    for (var i = 0; i < selectSpec.length; i++) {
        // for (var i = selectSpec.length-1; i >=0 ; i--) {
        if (selectSpec[i].specId == specificationVal) {
            var items = selectSpec[i].specItems;
            for (var y = items.length - 1; y >= 0; y--) {
                for (var h = tblArr.length - 1; h >= 0; h--) {
                    if (tblArr[h]['ids'].indexOf(items[y].specId + "-" + items[y].specName) != -1) {
                        tblArr.splice(h, 1);
                    }
                }
            }
            selectSpec.splice(i, 1);
        }
    }
    needClear = 1;
    preCombineV2();
    /*生成表格*/
    createTbl();
    //移除添加的规格项层
    $(obj).parent().parent().remove();
    $(".specificationItem").show();

}
function loseHashCode(str) {
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash += char;
    }
    return hash;
}
$("#all").live('click',
    function() {
        if (this.checked) {
            $("#tblSimpleSku :checkbox").prop("checked", true);
        } else {
            $("#tblSimpleSku :checkbox").prop("checked", false);
        }
    });

$("#tblSimpleSku :checkbox").live('click',
    function() {
        var chknum = $("#tblSimpleSku :checkbox").size(); //选项总个数
        var chk = 0;
        $("#tblSimpleSku :checkbox").each(function() {
            if ($(this).prop("checked") == true) {
                chk++;
            }
        });
        if (chknum == chk) { //全选
            $("#all").prop("checked", true);
        } else { //不全选
            $("#all").prop("checked", false);
        }
    });
//只有小单位应该功能
function unitPriceSettingSku(type) {
    //1 应用到全部SKU
    //2 应用到未填写SKU
    //取小单位阶梯价的值
    var ladderpricedata = $("#aSmallUnitLadderPrice").attr("ladderpricedata");
    var tdList = $("#smallUnitSetting").children().children().find("tr").find("td");
    var unitPriceVal = tdList.eq(0).find("input[type=text]").val();
    var retailPriceVal = tdList.eq(2).find("input[type=text]").val();
    var smallUnitCodeSingleVal = tdList.eq(3).find("input[type=text]").val();
    var goodsStockSingleVal = tdList.eq(4).find("input[type=text]").val();
    var goodsNoVal = tdList.eq(5).find("input[type=text]").val();
    var trList = $("#tblSimpleSku tr");
    for (var i = 0; i < trList.length; i++) {
        if (type == 1) {
            if (ladderpricedata != "") {
                trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata", ladderpricedata);
                trList.eq(i).find("a[name=bid_price_ladder]").text("修改");
            }
            if (unitPriceVal != "") {
                trList.eq(i).find("input[name=priceSingle]").val(unitPriceVal);
            }
            if (retailPriceVal != "") {
                trList.eq(i).find("input[name=retailprice]").val(retailPriceVal);
            }
            if (smallUnitCodeSingleVal != "") {
                trList.eq(i).find("input[name=smallUnitCodeSingle]").val(smallUnitCodeSingleVal);
            }
            if (goodsStockSingleVal != "") {
                trList.eq(i).find("input[name=goodsStockSingle]").val(goodsStockSingleVal);
            }
            if (goodsNoVal != "") {
                trList.eq(i).find("input[name=goodsNo]").val(goodsNoVal);
            }
        }
        if (type == 2) {
            if (ladderpricedata != "") {
                if (trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata") == "") {
                    trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata", ladderpricedata);
                    trList.eq(i).find("a[name=bid_price_ladder]").text("修改");
                }
            }
            if (unitPriceVal != "") {
                if (trList.eq(i).find("input[name=priceSingle]").val() == "") {
                    trList.eq(i).find("input[name=priceSingle]").val(unitPriceVal);
                }
            }
            if (retailPriceVal != "") {
                if (trList.eq(i).find("input[name=retailprice]").val() == "") {
                    trList.eq(i).find("input[name=retailprice]").val(retailPriceVal);
                }
            }
            if (smallUnitCodeSingleVal != "") {
                if (trList.eq(i).find("input[name=smallUnitCodeSingle]").val() == "") {
                    trList.eq(i).find("input[name=smallUnitCodeSingle]").val(smallUnitCodeSingleVal);
                }
            }
            if (goodsStockSingleVal != "") {
                if (trList.eq(i).find("input[name=goodsStockSingle]").val() == "") {
                    trList.eq(i).find("input[name=goodsStockSingle]").val(goodsStockSingleVal);
                }
            }
            if (goodsNoVal != "") {
                if (trList.eq(i).find("input[name=goodsNo]").val() == "") {
                    trList.eq(i).find("input[name=goodsNo]").val(goodsNoVal);
                }
            }
        }
    }
    $("#smallUnitSetting input[type='text']").each(function() {
        $(this).val("");
    });
}
//大单位应该功能
function ladderPriceSettingSku(type) {
    //1 应用到全部SKU
    //2 应用到未填写SKU
    //取小单位阶梯价的值
    var ladderpricedata = $("#aBigUnitLadderPrice").attr("ladderpricedata");

    var smallTdList = $("#bigUnitSetting").children().children().find("tr").eq(0).find("td");
    var smallunitPriceVal = smallTdList.eq(1).find("input[type=text]").val();
    var smallretailPriceVal = smallTdList.eq(3).find("input[type=text]").val();
    var smallsmallUnitCodeSingleVal = smallTdList.eq(4).find("input[type=text]").val();
    var smallgoodsStockSingleVal = smallTdList.eq(5).find("input[type=text]").val();
    var smallgoodsNoVal = smallTdList.eq(6).find("input[type=text]").val();

    var bigTdList = $("#bigUnitSetting").children().children().find("tr").eq(1).find("td");
    var bigunitPriceVal = bigTdList.eq(1).find("input[type=text]").val();
    var bigretailPriceVal = bigTdList.eq(2).find("input[type=text]").val();
    var bigsmallUnitCodeSingleVal = bigTdList.eq(3).find("input[type=text]").val();

    var trList = $("#tblSimpleSku tr");
    for (var i = 0; i < trList.length; i++) {
        if (type == 1) {
            if (ladderpricedata != "") {
                trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata", ladderpricedata);
                trList.eq(i).find("a[name=bid_price_ladder]").text("修改");
            }
            if (smallunitPriceVal != "") {
                trList.eq(i).find("input[name=priceSingle]").val(smallunitPriceVal);
            }
            if (smallretailPriceVal != "") {
                trList.eq(i).find("input[name=retailprice]").val(smallretailPriceVal);
            }
            if (smallsmallUnitCodeSingleVal != "") {
                trList.eq(i).find("input[name=smallUnitCodeSingle]").val(smallsmallUnitCodeSingleVal);
            }
            if (smallgoodsStockSingleVal != "") {
                trList.eq(i).find("input[name=goodsStockSingle]").val(smallgoodsStockSingleVal);
            }
            if (smallgoodsNoVal != "") {
                trList.eq(i).find("input[name=goodsNo]").val(smallgoodsNoVal);
            }
            if (bigunitPriceVal != "") {
                trList.eq(i).find("input[name=big_priceSingle]").val(bigunitPriceVal);
            }
            if (bigretailPriceVal != "") {
                trList.eq(i).find("input[name=big_retailprice]").val(bigretailPriceVal);
            }
            if (bigsmallUnitCodeSingleVal != "") {
                trList.eq(i).find("input[name=big_unit_code]").val(bigsmallUnitCodeSingleVal);
            }
        }
        if (type == 2) {
            if (ladderpricedata != "") {
                if (trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata") == "") {
                    trList.eq(i).find("a[name=bid_price_ladder]").attr("ladderpricedata", ladderpricedata);
                    trList.eq(i).find("a[name=bid_price_ladder]").text("修改");
                }
            }
            if (smallunitPriceVal != "") {
                if (trList.eq(i).find("input[name=priceSingle]").val() == "") {
                    trList.eq(i).find("input[name=priceSingle]").val(smallunitPriceVal);
                }
            }
            if (smallretailPriceVal != "") {
                if (trList.eq(i).find("input[name=retailprice]").val() == "") {
                    trList.eq(i).find("input[name=retailprice]").val(smallretailPriceVal);
                }
            }
            if (smallsmallUnitCodeSingleVal != "") {
                if (trList.eq(i).find("input[name=smallUnitCodeSingle]").val() == "") {
                    trList.eq(i).find("input[name=smallUnitCodeSingle]").val(smallsmallUnitCodeSingleVal);
                }
                trList.eq(i).find("input[name=smallUnitCodeSingle]").val(smallsmallUnitCodeSingleVal);
            }
            if (smallgoodsStockSingleVal != "") {
                if (trList.eq(i).find("input[name=goodsStockSingle]").val() == "") {
                    trList.eq(i).find("input[name=goodsStockSingle]").val(smallgoodsStockSingleVal);
                }
            }
            if (smallgoodsNoVal != "") {
                if (trList.eq(i).find("input[name=goodsNo]").val() == "") {
                    trList.eq(i).find("input[name=goodsNo]").val(smallgoodsNoVal);
                }
            }
            if (bigunitPriceVal != "") {
                if (trList.eq(i).find("input[name=big_priceSingle]").val() == "") {
                    trList.eq(i).find("input[name=big_priceSingle]").val(bigunitPriceVal);
                }
            }
            if (bigretailPriceVal != "") {
                if (trList.eq(i).find("input[name=big_retailprice]").val() == "") {
                    trList.eq(i).find("input[name=big_retailprice]").val(bigretailPriceVal);
                }
            }
            if (bigsmallUnitCodeSingleVal != "") {
                if (trList.eq(i).find("input[name=big_unit_code]").val() == "") {
                    trList.eq(i).find("input[name=big_unit_code]").val(bigsmallUnitCodeSingleVal);
                }
            }
        }
    }
    $("#bigUnitSetting input[type='text']").each(function() {
        $(this).val("");
    });
}

$("#hideattr").live('click',
    function() {
        var bigUnitId = $('#bigUnitId option:selected').val();
        if (this.checked) {
            var trList = $("#tblSimpleSku tr");
            for (var i = 0; i < trList.length; i++) {
                if (trList.eq(i).find("input[name=Fruit]").prop("checked") == false) {
                    $(trList.eq(i)).hide();
                    if (bigUnitId != -1) {
                        $(trList.eq(i + 1)).hide();
                    }
                }
            }
        } else {
            var trList = $("#tblSimpleSku tr");
            for (var i = 0; i < trList.length; i++) {
                if (trList.eq(i).find("input[name=Fruit]").prop("checked") == false) {
                    $(trList.eq(i)).show();
                    if (bigUnitId != -1) {
                        $(trList.eq(i + 1)).show();
                    }
                }
            }
        }
    });