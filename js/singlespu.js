/*大项集合*/
var specArr = new Array();				
/*已被选出的大项*/
var specBySelect = new Array();
/*是否是相同规格大项*/
var isSameSpec = new Array();
var tempisSameSpec = [];
/*选出的大项集合 里面是小项集合*/
var selectSpec = new Array();
/*增加“多规格”数目标示*/
var indexSpec = 1;		
/*保存所有的skuId，在保存的时候筛选出已删除的*/
var allSkuIdForUpdate = "";		
/*商品分类集合*/
var catArray = new Array();
var resultBk = new Array();
/*最终生成的规格表格元素集合*/
var tblArr = new Array();	
/*0不需要，1需要。a:首次选择大项中的小项；b:删除一个不为空的大项(包括变更)；c:删除小项后大项为空。*/
var needClear = 0;			
/*修改模式，多规格模式下，接收所有的sku*/
var specArrForUpdate = "";
/*为了判断品牌结果是否有效*/
var brandArray = new Array();
/*为了判断分类结果是否有效*/
var categoryArray = new Array();
var basePathJs = 'http://zbgoods.zhangheyun.cn';
var basePath = 'http://zbgoods.zhangheyun.cn';
/*
 * 初始化验证规则
 * */
$(function () {
	/*$.validator.addMethod("isDecimal", function(value, element) {
		return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);
	}, "只能包含数字、小数点字符");
	$.validator.addMethod("isIntContainZero", function(value, element) { 
		return this.optional(element) || (/^[-\+]?\d+$/.test(value) && parseInt(value)>=0);
	}, "整数必须大于或等于0"); */
	
});

/**
 * SPU与SKU公共组件
 */
var COMMON = {
	dropdown_ulwarp : function() {
		$("#product_classWarp").bind("click", function() {
			$(".dropdown_ulwarp").show();
            $(".slimScrollDiv").css({"z-index":"99"})
		})
		$(".li_1 em.plus").live('click', function()	{
			$(this).addClass("minus").removeClass("plus");
			$(this).parent("p").siblings("dl").show();
		})
		$(".dropdown_ulwarp dl dt em.plus").live('click', function() {
			$(this).addClass("minus").removeClass("plus");
			$(this).parent("dt").siblings("dd").show();
		})
		$(".li_1 em.minus").live('click', function()	{
			$(this).addClass("plus").removeClass("minus");
			$(this).parent("p").siblings("dl").hide();
			$(this).parent("p").siblings("dl").find("dd").hide();
			$(this).parents("p").siblings("dl").find("em").addClass("plus").removeClass("minus");
		})
		$(".dropdown_ulwarp dl dt em.minus").live('click', function() {
			$(this).addClass("plus").removeClass("minus");
			$(this).parent("dt").siblings("dd").hide();
		})
		$(".dropdown_ulwarp dl dd p").live('click', function() {
			$("#product_class_text").val("");
			var p_value=$(this).html();
			$("#product_class_text").val(p_value);
            $(".dropdown_ulwarp").hide();
		})
		//console.log($jQuery183.fn.jquery);
        $('.dropdown_ulwarp').slimScroll({
            height:'300px',
            width:'250px',
            alwaysVisible: false
    	});
        $(".slimScrollDiv").css({"position":"absolute","top":"32px"})
	},
	/*修改模式下，初始化界面元素*/
	initialForUpdate : function() {
    	if (updateSpuId > 0) {
    		if (isMul == 1) {		//多规格
    			specArrForUpdate = eval(vsingleSku);
        	}
    		var _brandId = vbrandId;
    		var _brandName = vbrand_name; 
    		brandArray.push({
                "id": _brandId,
                "name": _brandName
            });
    		
    		$("#brandId").val(_brandId);
    		$("#brand").val(_brandName);
    	    var _idImport = vis_import;
    	    //isImport
    	    $("#isImport").val(_idImport); 
    	    var _smallUnitId = vsmall_unit_id;
    	    var _smallUnitName = vsmall_unit_name;
    	    $("#smallUnitId").val(_smallUnitId);
    	    $("#smallUnitName").val(_smallUnitName);
    	    
    	    var _bigUnitId = vbig_unit_id;
    	    var _bigUnitName = vbig_unit_name;
    	    $("#bigUnitId").val(_bigUnitId);
    	    $("#bigUnitName").val(_bigUnitName);
    	    
    	    var _saleUnit = vsale_unit;
    	    $("#saleUnit").val(_saleUnit);
    	    
    	    //minOrderNum
    	    var _minOrderNum = vmin_order_num;
    	    $("#minOrderNum").val(_minOrderNum);
    	    
    	    var lis= $("#imgUl");
            var noMainImg = vother_image;
            var mainPicObj = new Object();
            mainPicObj.dataUrl = vmain_image;
            mainPicObj.imgServerUrl = imgUrl + "/" + vmain_image;
            var img$ = createMainPic(mainPicObj);
            lis.append(img$);
            var noMainImgArr = noMainImg.split("|");
            for(var i = 0; i < noMainImgArr.length; i++){
            	var noMainPicObj = new Object();
            	if(trim(noMainImgArr[i]) == ''){
            		continue;
            	}
            	noMainPicObj.dataUrl = noMainImgArr[i];
            	noMainPicObj.imgServerUrl = imgUrl + "/" + noMainImgArr[i];
            	var img$ = createNoMainPic(noMainPicObj);
            	lis.append(img$);
            }
            /*如果图片大于0张则显示主图文字*/
        	if(lis[0].children.length > 0) {
        		$('.goodsTitle').show();
        	}
            /*当图片大于4时上传控件隐藏*/
            if (lis[0].children.length > 4) {
        		$('.addImgItem').hide();
        	}
            
            var _stock_prompt = vstock_prompt;
            $("#stockPrompt").val(_stock_prompt);
            
            var _saleType = vsale_type;
            var _saleLbl = "input[name='saleType'][value='" + _saleType + "']";
            $(_saleLbl).attr("checked",true);
            
            var _returnType = vreturn_type;
            $("#returnType").val(_returnType);
            
            //orderLimitNum
            var _orderLimitNum = vorder_limit_num;
            $("#orderLimitNum").val(_orderLimitNum);
            
            //serviceContent
            var _serviceContent = vservice_content;
            $("#serviceContent").val(_serviceContent);
            //商品分类
            var data_id_val = vdata_id_val;
            $("#product_class_text").attr('data-id', data_id_val);
            $("#product_class_text").val(vcat_three_name);
            categoryArray.push(vcat_three_name);
    	}
    },
    /*验证条形码*/
    isBarCode : function(s) {
    	if(s.length > 13){
    		alert("条形码长度大于13位!");
    		return false;
    	}
    	/*条形码是12为，验证数字*/
        var reg = new RegExp(/^[0-9]{12}$/);
        /*exec()用于检索字符串中的正则表达式的匹配，substring：提取字符串*/
        if (reg.exec(s.substring(0, 12)))
            return true;
        else{
        	alert("条形码格式不正确，请检查是否存在字母!");
            return false;
        }
    },
    checkBarCode : function(code) {
    	if (!COMMON.isBarCode(code)) {
            return false;
        }
    	var cacluNum = COMMON.doCheckBarCode(code);
    	var lastNum = code.substr(code.length-1);
    	if(cacluNum != lastNum){
    		alert("验证条形码的格式出错!");
    		return false;
    	}
    	return true;
    },
    doCheckBarCode : function(s) {
        var a = 0;
        var b = 0;
        var c = 0;
        var d = 0;
        var e = 0;
        for (var i = 1; i <= 12; i++) {
            var sc = parseInt(s[i - 1]);
            if (i <= 12 && i % 2 == 0) {
                a += sc;
            }
            else if (i <= 11 && i % 2 == 1) {
                b += sc;
            }
        }
        c = a * 3;
        d = b + c;
        if (d % 10 == 0)
            e = d - d;
        else
            e = d + (10 - d % 10) - d;
        return e;
    },
    /*验证表单数据*/
    validateData : function(formId) {
    	if ($("#imgMain").val() == '') {
    		$("#imgError").html("<div style='color:#F00'>图片不能为空!</div> ");
    		return;
    	} else {
        	return $("#"+formId).validate({
        		rules : {
        			spuName : {
        				required : true
        			},
        			brand : {
        				required : true 
        			},
        			product_class_text : {
        				required : true
        			},
        			smallUnitId : {
        				required : true,
        				min : 0
        			},
        			saleUnit : {
        				required : true
        			},
        			minOrderNum : {
        				required : true
        			},
        			/*price : {
        				required : true,
        				isDecimal:true
        			},
        			goodsStock : {
        				required : true,
        				isIntContainZero:true
        			},*/
        			smallUnitCode : {
        				required : true
        			},
        			bigUnitCode : {
        				required : true
        			},
        			unitTransfer : {
        				required : true,
        				isIntContainZero:true
        			},
        			/*goodsNo : {
        				required : true
        			},*/
        			bigUnitCode : {
        				required : true
        			},
        			orderLimitNum:{
        				isIntContainZero:true
        			}
        		},
        		messages : {
        			spuName : "请输入商品名称",
        			brand : {required:"请输入商品品牌"},
        			product_class_text : "请选择商品分类",
        			smallUnitId : "请选择小单位",
        			saleUnit : "请选择销售单位",
        			minOrderNum : "请输入最小起订量",
        			//price : {required:"请输入商品批发价",isDecimal:"请输入数字"},
        			//goodsStock : {required:"请输入商品库存",isIntContainZero:"请输入数字"},
        			smallUnitCode : "请输入小单位条形码",
        			bigUnitCode : "请输入大单位条形码",
        			unitTransfer : {required:"请输入单位换算值",isIntContainZero:"请输入数字"},
        			//goodsNo : "请输入货品编码",
        			orderLimitNum:{isIntContainZero:"只能是正整数和0"}
        		}
        	});
    	}
    }
}

/*
 * SPU组件
 * */
var SPU = {
	/*商品品牌*/
	brandList : function() {
		var brandName = $("#brand").val();
		$("#brand").bsSuggest({
			indexId: 1,             /*data.value 的第几个数据，作为input输入框的内容*/
		    indexKey: 1,            /*data.value 的第几个数据，作为input输入框的内容*/
		    allowNoKeyword: true,   /*是否允许无关键字时请求数据。为 false 则无输入时不执行过滤请求*/
		    /*multiWord: true,      //以分隔符号分割的多关键字支持*/
		    /*separator: ",",       //多关键字支持时的分隔符，默认为空格*/
		    getDataMethod: "url",   /*获取数据的方式，总是从 URL 获取*/
		    showHeader: false,      /*显示多个字段的表头*/
		    autoDropup: true,       /*自动判断菜单向上展开*/
		    effectiveFieldsAlias:{brandName: "业务员名称"},
		    url: /*basePathJs + */"/single/getbrandname?brandName=",
		    fnProcessData: function(result) {
		        var index, len, data = {value: []};
		        if(! result || ! result.data || ! result.data.length) {
		            return false;
		        } 
		        len = result.data.length; 
		        for (index = 0; index < len; index++) {
		            data.value.push({
		                "id": result.data[index].id,
		                "name": result.data[index].name
		            });
		        }
		        brandArray = data.value;
		        return data;
		    }
		}).on('onDataRequestSuccess', function (e, result) {
			$('td[data-name="id"]').hide();
	    	$('td[data-name="name"]').css({"text-align":"left"});
		    //console.log('onDataRequestSuccess: ', result);
		}).on('onSetSelectValue', function (e, keyword, data) {
		    //console.log('onSetSelectValue: ', keyword, data);
		    $("#brandId").val(data.id); 
		}).on('onUnsetSelectValue', function () {
		    //console.log("onUnsetSelectValue");
		    $("#brandId").val(""); 
		});
	},
	/*分类改变事件*/
	categoryChange : function() {
		/*商品分类选择框的输入改变事件*/
		$('#product_class_text').bind('input propertychange', function() {
			var thisVal = $(this).val();
			var pArr = $("p");
			var dataIdAttr = "";
			for(var i =0; i <=pArr.length;i++){
				if(typeof($(pArr[i]).attr('value')) != 'undefined'){
					var _tmpData = $(pArr[i]).attr('value');
					var _tempDataArr = _tmpData.split("&");
					if(_tempDataArr.length == 6){
						if(_tempDataArr[5] == thisVal){
							dataIdAttr = _tmpData;
						}
					}
				}
			}
			if(dataIdAttr == ''){
				$('#product_class_text').attr('data-id','');
				$('#catAll').val('');
			}else{
				$('#product_class_text').attr('data-id',dataIdAttr);
			}
		});
	},
	/*商品分类*/
	/*categoryList : function() {
		/!*var url = /!*basePathJs + *!/"/category/listcate";*!/
		var url = 'json/listcate.json';
		$.get(url,function(d){
			$("#cateDiv").html("");
			var htmlCate = "";
			if(d.code == 1){
				catArray = d.data;
				
				if(catArray.length > 0){
					htmlCate += "<ul>";
					for(var i = 0; i < catArray.length; i++){
						var firstCate = catArray[i];
						htmlCate += "<li>";
						htmlCate += "<p class='li_1' value= " + firstCate.id + "><em class='minus'></em>" + firstCate.name + "</p>";
						/!*二级*!/
						var secondArr = firstCate.cglist;
						if(secondArr.length > 0){
							for(var j = 0; j < secondArr.length; j++){
								htmlCate += "<dl>";
								var secondCate = secondArr[j];
								htmlCate += "<dt value=" + secondCate.id + "><em class='minus'></em>" + secondCate.name + "</dt>";
								/!*三级*!/
								var thirdArr = secondCate.cglist;
								if(thirdArr.length > 0){
									htmlCate += "<dd>";
									for(var h = 0; h < thirdArr.length; h++){
										/!*三级分类*!/
										categoryArray.push(thirdArr[h].name);
										htmlCate += "<p value="+ firstCate.id + "&" + firstCate.name + "&" + secondCate.id + "&" + secondCate.name + "&" + thirdArr[h].id + "&" + thirdArr[h].name + ">" + thirdArr[h].name;
									}
									htmlCate += "</dd>";
								}
								htmlCate += "</dl>";
							}
						}
						htmlCate += "</li>";
					}
					htmlCate += "</ul>";
				}
			}
			
			$("#cateDiv").html(htmlCate);
			$(".li_1 em.minus").parent("p").siblings("dl").hide();
			$(".li_1 em.minus").parent("p").siblings("dl").find("dd").hide();
			$(".li_1 em.minus").parents("p").siblings("dl").find("em").addClass("plus").removeClass("minus");
			$(".li_1 em.minus").addClass("plus").removeClass("minus");
		});
	},*/
	uploadimg : function() {
	    $('#uploadify').uploadify({
	        swf: basePath + '/js/plugins/uploadify/uploadify.swf',
	        uploader: 'http://upload.zhtxw.cn/UploadImage.ashx',
	        //显示参数
	        height: 39,
	        width: 159,
	        buttonText: "上传图片",
	        buttonCursor: "hand",
	        buttonClass: "browser btn-primary",
	        //规则参数
	        fileSizeLimit: "5000KB",
	        fileTypeExts: "*.jpg;*.jpeg;*.png;*.gif;*.bmp;",
	        fileTypeDesc: "请选择 jpg、jpeg、png、gif、bmp 文件",
	        fileSizeLimit: "5MB",
	        multi: true,
	        queueID: 'fileQueue',//队列id,用来展示上传进度的
	        removeTimeout: 1,
	        //选择异常事件
	        onSelectError: function (file, errorCode, errorMsg) {
	            if (errorCode == -110) {
	                //重写图片过大提示
	                this.queueData.errorMsg = "图片太大了，请选择5M以下大小的图片";
	            }
	            else {
	                this.queueData.errorMsg = "请选择正确的图片文件";
	            }
	        },
	        //上传成功事件
	        onUploadSuccess: function (file, data, response) {
	        	$('.goodsTitle').show();
	        	$("#imgError").html('');
	        	$jQuery183("#uploadify").uploadify('cancel', '*');
	            var obj = eval('(' + data + ')');
	            /*判断通栏尺寸*/
	            if (obj.code == 2) {
	                $(".ggyl_ad_img").hide();
	                return;
	            }
	            //$("#logoUrl").val(obj.dataUrl); //存入上传图片地址
	            var lis= $("#imgUl");
	            var img$;
	            if(lis[0] == 'undefined' || lis[0].children.length == 0){		//还没有添加主图
		            img$ = createMainPic(obj);
	            }else{
	            	img$ = createNoMainPic(obj, lis[0].children.length);
	            }
	            $("#imgUl").append(img$);
	            /*当图片大于4时上传控件隐藏*/
	            if (lis[0].children.length > 4) {
            		$('.addImgItem').hide();
            	}
	        },
	    });
	    $("object[id*=SWFUpload]").css({"width":"159px","height":"39px"});
	}
}

/*
 * SPU组件
 * */
var SKU = {
	/*界面初始化时，读取规格首选项，以备选择多规格时使用*/
	listSpec : function() {
		/*$.get(/!*basePathJs +*!/ "/specifications/listbypid?specName=&pid=0&r=" + Math.random(), "", function(d) {
			if(d.code == 1){
				specArr = d.data;
				/!*多规格*!/
				if(isMul == 1){
					SKU.initialMultiSpec();
	        	}
			}
		});*/
		$.get('json/listbypid.json', "", function(d) {
			if(d.code == 1){
				specArr = d.data;
				/*多规格*/
				if(isMul == 1){
					SKU.initialMultiSpec();
				}
			}
		});
	},
	/*初始化SKU相关事件*/
	eventInit : function() {
		$('#addSpec').click(function(){
			if($('.sGoods').length < 3 ){
				SKU.addMultiSpec();
			}else if($('.sGoods').length <= 3){
				SKU.addMultiSpec();
				$('#addSpec').hide();
			}else{
				$('#addSpec').hide();
			}
		});
		
        $(".bg-fa .alert .close").click(function() {
            $(this).parents('.bg-fa').hide();
        });
        $('.setSpecCheck').click(function() {
            SKU.specCheck();
        });
        $(".addLabelWrap a").click(function(enevt) {
            $(this).parent('.addLabelWrap').find('.addLabelInput').show();
            event.stopPropagation();
        });
        $('.addLabelInput .btnQX').click(function() {
            $(this).parents('.addLabelWrap').find('.addLabelInput').hide();
        })
        /*按客户单价指定添加超市*/
        $('.jsdown-menu li input[type="checkbox"]').each(function() {
            $(this).attr("data-id", "0");
        });
	},
	/*单、多规格切换*/
	specCheck : function() {
        var ischeck = $('.setSpecCheck').attr('checked');
        if (ischeck == undefined) {
            $('.setSpec').hide();
            $('.noSetSpec').show();
            $('#isMultiSpec').val(0);
        } else {
    		$('.setSpec').show();
            $('.noSetSpec').hide();
            $('#isMultiSpec').val(1);
        }
       
    },
    /*批量设置规格*/
    batchConf : function() {
    	/*$("input[name='price']").each(
    		function(){
    			$(this).val($("#confPrice").val());
    		}
    	)
    	$("input[name='goodsStock']").each(
    		function(){
    			$(this).val($("#confGoodsStock").val());
    		}
    	) */
    	$("input[name='smallUnitCode']").each(
    		function(){
    			$(this).val($("#confSmallUnitCode").val());
    		}
    	) 
    	$("input[name='bigUnitCode']").each(
    		function(){
    			$(this).val($("#confBigUnitCode").val());
    		}
    	) 
    	$("input[name='unitTransfer']").each(
    		function(){
    			$(this).val($("#confUnitTransfer").val());
    		}
    	) 
    },
    bigSelectChange : function(index,doThis) {
    	var nowPId = $("#specSlect" + index + " option:selected").val();
		var nowPName = $("#specSlect" + index + " option:selected").text();
		var tempNewArr = new Array();
		tempNewArr[0] = nowPId;
		tempNewArr[1] = nowPName;
		/*判断大项下有没有小项，有小项就是在改变，没有小项的就是在添加*/
		if ($(doThis).parents('.itemWrap').find('.labelBox').length != 0) {
			var count = 1;
			for (var i = 0; i < isSameSpec.length; i++) {
				if (isSameSpec[i][1] == nowPName) {
					count++;
					console.log(isSameSpec)
				}
			}
			if (count > 1) {
				alert("不可以填写重复规格！");
				/*大项对应在索引*/
				var _isSameSpecIndex = $(doThis).parents('.sGoods').index();
				/*把大项的选择回到改变之前*/
				$(doThis).val(isSameSpec[_isSameSpecIndex][0]);
			}else{
				/*删除记录中对应的索引项*/
				var _isSameSpecIndex = $(doThis).parents('.sGoods').index();
				isSameSpec.splice(_isSameSpecIndex, 1);
				var _thisClose = $(doThis).parents('.alert-dismissable').find('.close');
				/*删除对应的大项*/
				SKU.removeBigSpec(_thisClose);
				/*添加一项大项*/
				SKU.addMultiSpec(0,$(doThis).val(),nowPId);
			}
		}else{
			/*判断在改变的时候时不时请选择*/
			if(nowPId != -1){
				/*不是请选择在就是在改变，加进数组*/
				isSameSpec.push(tempNewArr);
			}else{
				/*是请选择在就是在添加*/
				var _isSameSpecIndex = $(doThis).parents('.sGoods').index();
				$(doThis).val(isSameSpec[_isSameSpecIndex][0]);
			}
			/*判断重复*/
			var count = 0;
			for (var i = 0; i < isSameSpec.length; i++) {
				if (isSameSpec[i][1] == nowPName) {
					count++;
				}
			}
			if (count > 1) {
				alert("不可以填写重复规格！");
				var _isSameSpecIndex = $(doThis).parents('.sGoods').index();
				/*如果原来不是请选择，就是在改变*/
				if($(doThis).attr('data-default') != -1){
					/*改变重复了，把改变之前在值给填回去*/
					$(doThis).val(isSameSpec[_isSameSpecIndex][0]);
				}else{
					/*如果原来是请选择，就是在增加，重复在变回请选择*/
					$(doThis).val(-1);
				}
				isSameSpec.pop();
			}
			/*如果原来不是请选择，数组也没用重复，就是在改变添加*/
			if($(doThis).attr('data-default') != -1 && count <= 1){
				var _isSameSpecIndex = $(doThis).parents('.sGoods').index();
				/*删除记录中对应的索引项*/
				isSameSpec.splice(_isSameSpecIndex, 1);
				/*把新改变在储存起来*/
				var tempNewArr1 = [];
				tempNewArr1[0] = nowPId;
				tempNewArr1[1] = nowPName;
				/*把储存起来在新改变的，放进当前改变在位置，保证数组里面在顺序和大项在顺序一致*/
				isSameSpec.splice(_isSameSpecIndex, 0,tempNewArr1);
				/*因为在最开始在时候把改变的加进数组最后面了，所以这里把改变在塞进数组响应在位置了，这样数组中就会有两项是改变后的，和大项相对应在索引一项，最后一项，这两个椒重复的，所以删除最后一项*/
				isSameSpec.pop();
				/*判断有没有改变成功*/
				if($(doThis).attr('data-default') != -1){
					/*改变成功了，把数组中相对应项的值给填回去*/
					$(doThis).val(isSameSpec[_isSameSpecIndex][0]);
				}else{
					/*改变失败了，变回请选择*/
					$(doThis).val(-1);
				}
			}else{
				if(count <= 1){
					/*把data-default值变成改变后的值*/
					$(doThis).attr('data-default',nowPId);
				}
			}
			$("#bigBtn" + index).attr("pid", nowPId);
		    SKU.addSelectSpecArr(nowPId, nowPName, 0, '');
		}
		
    },
    /*修改模式下，初始化多规格*/
    initialMultiSpec : function() {
    	$('.setSpecCheck').trigger("click");
    	SKU.specCheck();
    	/*先将大项拼装出来。specArrForUpdate为后台返回的所有SKU信息*/
    	for (var m = 0; m < specArrForUpdate.length; m++) {
    		var itemArr = specArrForUpdate[m]['colLists'];
    		var pid = 0;
    		var isDo = 0;
    		for (var n = 0; n < itemArr.length; n++) {
    			pid = itemArr[n]['pid'];
    			for (var k = 0; k < specBySelect.length; k++) {
    				if(pid == specBySelect[k].id){
    					isDo = 1;
    					break;
    				}
    			}
    			if (isDo == 0) {
    				itemArr[n]['indexSpec'] = indexSpec;
    				SKU.addMultiSpec(0, pid);
    			}
    		}
    	}
    	/*处理未赋值'indexSpec'值的小项*/
    	for (var m = 0; m < specArrForUpdate.length; m++) {
    		var itemArr = specArrForUpdate[m]['colLists'];
    		for (var n = 0; n < itemArr.length; n++){
    			if (typeof(itemArr[n]['indexSpec']) == 'undefined') {
    				var isFind = 0;
    				for (var h = 0; h < specArrForUpdate.length; h++) {
    					var itemArrInner = specArrForUpdate[h]['colLists'];
    					for (var k = 0; k < itemArrInner.length; k++){
    						if (typeof(itemArrInner[k]['indexSpec']) != 'undefined' && itemArrInner[k]['pid'] == itemArr[n]['pid']){
    							itemArr[n]['indexSpec'] = itemArrInner[k]['indexSpec'];
    							isFind = 1;
								break;
							}
						}
    					if (isFind == 1) {
    						break;
						}
					}
    			}
    		}
    	}
    	/*拼装小项和sku表格列头*/
    	for (var m = 0; m < specArrForUpdate.length; m++) {
    		var itemArr = specArrForUpdate[m]['colLists'];
    		var pid = 0;
    		for (var n = 0; n < itemArr.length; n++) {
    			var _tmpIndex = itemArr[n]['indexSpec'];
    			pid = itemArr[n]['pid'];
    			var btnId = "#btnConfirm_" + _tmpIndex;
    			var addLblId = "#addLabel" + _tmpIndex;
    			$(addLblId).attr("data-name", itemArr[n]['specId']);
    			$(addLblId).attr("data-id", itemArr[n]['specName']);
    			SKU.confirmSpec(_tmpIndex, $(btnId));
    		}
    	}
    	
    	// 清除表体内容与清空tblArr元素
    	$("#multiSpecTbl tbody").html("");
    	tblArr = [];
    	
    	for (var m = 0; m < specArrForUpdate.length; m++) {
    		var itemArr = specArrForUpdate[m]['colLists'];
    		skuObjForUpdate = {'isUpdate':1};
    		skuObjForUpdate['skuIdSingle'] = specArrForUpdate[m]['sku_id'];
    		
    		/*拼接出所有要修改的多规格SKUID*/
    		allSkuIdForUpdate += specArrForUpdate[m]['sku_id'] + ",";
    		
    		skuObjForUpdate['goods_no'] = specArrForUpdate[m]['goods_no'];
    		skuObjForUpdate['goods_stock'] = specArrForUpdate[m]['goods_stock'];
    		skuObjForUpdate['price'] = specArrForUpdate[m]['price'];
    		skuObjForUpdate['small_unit_code'] = specArrForUpdate[m]['small_unit_code'];
    		skuObjForUpdate['unit_transfer'] = specArrForUpdate[m]['unit_transfer'];
    		skuObjForUpdate['big_unit_code'] = specArrForUpdate[m]['big_unit_code'];
    		var _ids = "";
    		for (var n = 0; n < itemArr.length; n++) {
    			if( n != 0){
    				_ids += "-" + itemArr[n]['specId'] + "-" + itemArr[n]['specName'];
    			}else{
    				_ids = itemArr[n]['specId'] + "-" + itemArr[n]['specName'];
    			}
    		}
    		for (var i = 0; i < resultBk.length; i++) {
    			isExists = 0;
    			var newObj = resultBk[i];
    			if (newObj["ids"] == _ids) {
    				
    				SKU.doCreateTbl(newObj);
    				break;
    			}
    		}
    	}
    },
    /*添加多规格大项*/
    addMultiSpec : function(selectBigSpec, bigSelectItem,defaultIndex) {
		var addThis=$('#addSpec');
		var selPid = 0;
		if(typeof(bigSelectItem) != 'undefined'){
			selPid = bigSelectItem;
		}
	    /*找出未被使用了的*/
		var specNoUse = new Array();
		/*规格名下拉列表*/
		for (var i = 0;i < specArr.length; i++) {
			specNoUse.push(specArr[i]);
		}
		var _defaultIndex = -1;
		if(defaultIndex){
			_defaultIndex = defaultIndex;
		}
		var defaultPId = 0;
		var specStr = "<div class='itemWrap m-t-md sGoods'>";
			specStr += "<div class='alert alert-default alert-dismissable'>";
	    	specStr += "<select class='form-control pull-left w-100 specSlect' data-default="+ _defaultIndex +" id='specSlect" + indexSpec + "' onchange='SKU.bigSelectChange(" + indexSpec + ",this)'>";
	    	specStr += "<option value='-1'>-请选择-</option>";
	    	
    	for (var i = 0; i < specNoUse.length; i++) {
    		/*添加模式*/
    		if (selPid == 0) {			
				specStr += "<option value=" + specNoUse[i].id + ">" + specNoUse[i].name + "</option>";
    		} else {
    			/*修改模式*/
				if (selPid == specNoUse[i].id) {
					specBySelect.push(specNoUse[i]);
					defaultPId = specNoUse[i].id;
					specStr += "<option value=" + specNoUse[i].id + " selected>" + specNoUse[i].name + "</option>";
					/*初始化把默认在大项加入数组*/
					var tempNewArr = new Array();
					tempNewArr[0] = specNoUse[i].id;
					tempNewArr[1] = specNoUse[i].name;
					isSameSpec.push(tempNewArr);
				} else {
					specStr += "<option value=" + specNoUse[i].id + ">" + specNoUse[i].name + "</option>";
				}
			}
		}
		specStr += "</select>";
		specStr += "<button id='bigBtn" + indexSpec + "' pid=" + defaultPId + " class='close pull-right m-t-xs' type='button'><em class='icon-16 icon-erro'></em></button>";
		specStr += "<div class='clearfix'></div>";
		specStr += "</div>";
		specStr += "<div class='form-group inline relative p-xxs m-r addLabelWrap'>";
		specStr += "<a href='javascript:;' class='pull-left m-t-sm'>+规格值</a>";
		specStr += "<div class='addLabelInput' style='display: none;width:380px'>";
		specStr += "<div class='w-200 pull-left'>";
		specStr += "<input type='text' class='form-control addLabelClass ' maxlength='20' id='addLabel" + indexSpec + "'>";
		specStr += "</div>";
	    	specStr += "<div class='pull-left m-l-md'><button id='btnConfirm_" + indexSpec + "' class='btn btn-primary btnQD' onclick='SKU.confirmSpecAdd(" + indexSpec + ",this)'>确定</button><button class='btn btn-default m-l btnQX'>取消</button></div>";
		specStr += "</div></div></div>";
		
		$(specStr).insertBefore($(addThis).parents('.itemWrap'));
		/*设置商品多规格条目*/
	    $('.alert.alert-default').hover(function(){
	        $(this).find('.close').show()
	    },function(){
	        $(this).find('.close').hide()
	    });
	    $('.close').off('click');
	    // 删除大项与小项事件
		$('.close').live('click',function() {
	    	SKU.removeBigSpec(this);
	    	if($('.sGoods').length < 4){
				$('#addSpec').show();
			};
		});
		$(".addLabelWrap a").live('click',function(event){
			if($(this).parent('.addLabelWrap').siblings('.alert-dismissable').find('.specSlect').val()==-1){
	        	return;
	        }else{
	        	$(this).parent('.addLabelWrap').find('.addLabelInput').show();
	        };
	        $(this).parent('.addLabelWrap').find('.addLabelClass').val('');
	        event.stopPropagation();
	    });
		$('.addLabelInput .btnQX').live('click',function(){
	        $(this).parents('.addLabelWrap').find('.addLabelInput').hide();
	    });
	    $('.addLabelInput .btnQD').live('click',function(){
	        $(this).parents('.addLabelWrap').find('.addLabelInput').hide();
	    });
	    
		var pHtmlId = '#specSlect' + indexSpec;
	    var pid = $(pHtmlId+ " option:selected").val();
	    var pName = $(pHtmlId+ " option:selected").text();
    	/*SKU.initbsSuggest(indexSpec,pid);*/
    	/*添加大项*/
    	SKU.addSelectSpecArr(pid,pName, 0, '');
		indexSpec++;
		
		if ($('.sGoods').length == specArr.length) {
			$('#addSpec').parents('.itemWrap').hide();
		};
    },
    /*生成表格*/
    createTbl : function() {
    	/*需要清除表格和tblArr*/
    	if(needClear == 1){		
    		tblArr = new Array();
    		$("#multiSpecTbl tbody").html("");
    		/*重新生成表头*/
    		SKU.createSpecCol();
    	}
    	/*0不存在；1存在*/
    	var isExists = 0;
    	for (var i = 0; i < resultBk.length; i++) {
    		isExists = 0;
    		var newObj = resultBk[i];
    		for(var j = 0; j < tblArr.length; j++){
    			if(newObj["ids"] == tblArr[j]["ids"]){
    				isExists = 1;
    				break;
    			}
    		}
    		/*已经存在了*/
    		if(isExists == 1){	
    			continue;
    		}
    		SKU.doCreateTbl(newObj);
    	}
    },
    doCreateTbl : function(newObj) {
    	tblArr.push(newObj);
    	var trHtml = "<tr>";
    	for (var i = 0; i < newObj['specItems'].length; i++) {
    		trHtml += "<td width='10%' class='specnum' specNum=" + newObj['specItems'][i].specId + ">" +"<span class='specNameText'>"+ newObj['specItems'][i].specName + "</span>"+"</td>";
    	}
    	if (skuObjForUpdate['isUpdate'] == 1) {
    		/*trHtml += "<td name='pifajiaTd'><input id='skuIdSingle"+newObj['ids']+"' name='skuIdSingle' type='hidden' class='w-60 text-center form-control input-xs' value='" + skuObjForUpdate['skuIdSingle'] + "'>" +
    				"<input id='price"+newObj['ids']+"' name='price' type='text' class='w-60 text-center form-control input-xs inputSpec' value='" + skuObjForUpdate['price'] + "'></td>";
    		trHtml += "<td><input id='goodsStock"+newObj['ids']+"' name='goodsStock' type='text' class='w-60 text-center form-control input-xs inputSpec' value='" + skuObjForUpdate['goods_stock'] + "'></td>";*/
    		trHtml += "<td><input id='smallUnitCode"+newObj['ids']+"' name='smallUnitCode' type='text' class='w-150 text-center form-control input-xs inputSpec' value='" + skuObjForUpdate['small_unit_code'] + "'></td>";
    		trHtml += "<td>" +
    						"<input id='bigUnitCode"+newObj['ids']+"' name='bigUnitCode' type='text' class='w-150 text-center form-control input-xs inputSpec' value='" + skuObjForUpdate['big_unit_code'] + "'>" +
    					"</td>";
    		trHtml += "<td><input id='unitTransfer"+newObj['ids']+"' name='unitTransfer' type='text' class='w-60 text-center form-control input-xs inputSpec' value='" + skuObjForUpdate['unit_transfer'] + "'></td>";
    		//trHtml += "<td><input id='goodsNo"+newObj['ids']+"' name='goodsNo' type='text' class='w-60 text-center form-control input-xs inputSpec' value='" + skuObjForUpdate['goods_no'] + "'></td>";
    	} else {
    		/*trHtml += "<td name='pifajiaTd'><input id='skuIdSingle"+newObj['ids']+"' name='skuIdSingle' type='hidden' class='w-60 text-center form-control input-xs' value=''>" +
    				"<input id='price"+newObj['ids']+"' name='price' type='text' class='w-60 text-center form-control input-xs inputSpec'></td>";
    		trHtml += "<td><input id='goodsStock"+newObj['ids']+"' name='goodsStock' type='text' class='w-60 text-center form-control input-xs inputSpec'></td>";*/
    		trHtml += "<td><input id='smallUnitCode"+newObj['ids']+"' name='smallUnitCode' type='text' class='w-150 text-center form-control input-xs inputSpec'></td>";
    		trHtml += "<td>" +
    						"<input id='bigUnitCode"+newObj['ids']+"' name='bigUnitCode' type='text' class='w-150 text-center form-control input-xs inputSpec'>" +
    					"</td>";
    		trHtml += "<td><input id='unitTransfer"+newObj['ids']+"' name='unitTransfer' type='text' class='w-60 text-center form-control input-xs inputSpec'></td>";
    		//trHtml += "<td><input id='goodsNo"+newObj['ids']+"' name='goodsNo' type='text' class='w-60 text-center form-control input-xs inputSpec'></td>";
    	}
    	trHtml += "</tr>";
    	$("#multiSpecTbl tbody").append(trHtml);
    	skuObjForUpdate['isUpdate'] = 0;
    },
    /*添加规格*/
    confirmSpecAdd : function(indexSpec, docThis) {
    	var pHtmlId = '#specSlect' + indexSpec;
    	/*添加规格小项的元素数量*/
    	var tindex = tblArr.length + 1;
    	var specName = $("#addLabel"+indexSpec).val();
    	/*父ID*/
    	var pid = $(pHtmlId+ " option:selected").val();
    	var ptext = $(pHtmlId+ " option:selected").text();
    	var specId = loseHashCode(specName);
		var specStr = "<div class='form-group pull-left inline relative p-xxs m-r' name='smallSpec" + indexSpec + "'>";
			specStr += "<div class='labelBox' pId = "+ pid + " specId=" + specId+">" + specName + "</div>";
	    	specStr += "<em class='delItmeImg' pId = "+ pid +" specId=" + specId +" specName=" + specName + " onclick='SKU.removeSmallSpec(this, "+specId+")'></em></div>";
	    	var count = 0;
	    	$('.labelBox').each(function(){
	    		if($(this).text() == specName){
	    			count++
	    		}
	    	});
	    	if(specName != '' && count < 1){
    	    	$(specStr).insertBefore($(docThis).parents(".addLabelWrap"));
    	    	/*添加小项*/
    	    	SKU.addSelectSpecArr(pid, ptext, specId, specName);
    	    }
    	
    	$(this).parents('.addLabelWrap').find('.addLabelInput').hide();
    },
    /*添加规格*/
    confirmSpec : function(indexSpec, docThis) {
    	$('.addLabelClass').val('');
		var pHtmlId = '#specSlect' + indexSpec;
		var specId = $("#addLabel" + indexSpec).attr("data-name");
		/*不需要添加，之前已经添加*/
		if (isExist($(pHtmlId+ " option:selected").val(),$("#addLabel" + indexSpec).attr("data-name")) == 1) {
	    	return;		
		}
		$("#addLabel" + indexSpec).attr("data-id");
		$("#addLabel" + indexSpec).attr("data-name");
	    	
		var specStr = "<div class='form-group pull-left inline relative p-xxs m-r' name='smallSpec" + indexSpec + "'>";
			specStr += "<div class='labelBox' pId = " + $(pHtmlId+ " option:selected").val() + " specId=" + specId + ">" + $("#addLabel" + indexSpec).attr("data-id") + "</div>";
	    	specStr += "<em class='delItmeImg' pId = " + $(pHtmlId+ " option:selected").val() + " specId=" + specId + " specName=" + $("#addLabel" + indexSpec).attr("data-id") + " onclick='SKU.removeSmallSpec(this, "+specId+")'></em></div>";
	    	$(specStr).insertBefore($(docThis).parents(".addLabelWrap"));
	
    	//添加小项
    	SKU.addSelectSpecArr($(pHtmlId+ " option:selected").val(), $(pHtmlId+ " option:selected").text(), specId,$("#addLabel" + indexSpec).attr("data-id"));
    	$(this).parents('.addLabelWrap').find('.addLabelInput').hide();
    },
    /*添加选择的规格属性*/
    addSelectSpecArr : function(pid, pName, id, name) {
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
		preCombineV2(0, {});
    	/*生成表格*/
    	SKU.createTbl();
    },
    /*删除大项后，将该大项再添回到备选项中*/
    removeFromSpecBySelect : function(pid) {
    	for (var i = 0; i < specBySelect.length; i++) {
    		if (specBySelect[i]['id'] == pid) {
    			specBySelect.splice(i, 1);
    		}
    	}
    },
    createSpecCol : function() {
    	/*先将表头恢复*/
		var nameIndex = $('#multiSpecTbl thead th[name="xdwtxm"]').index();
	    for (var i=0; i < nameIndex; i++) {
			$('#multiSpecTbl thead th').eq(0).remove();
		}
    	/*console.log(nameIndex);*/
    	for (var i = 0; i < selectSpec.length; i++) {
    		if (selectSpec[i].specItems.length == 0) {
    			continue;
    		}
		    var selectName = selectSpec[i].specName;
		    var selectId = selectSpec[i].specId;
	    	$("th[name='xdwtxm']").each(function() {
				$("<th width='10%' specNum=" + selectId + ">"+selectName + "</th>").insertBefore(this);
			});
    	}
    },
    /*删除大项*/
    removeBigSpec : function(btnThis) {
    	SKU.doRemoveBigSpec($(btnThis).attr("pid"),btnThis);
    	SKU.removeFromSpecBySelect($(btnThis).attr("pid"));
    	$(btnThis).parents('.sGoods').remove();
    },
    doRemoveBigSpec : function(pid,btnThis) {
    	needClear = 0;
    	for(var j in isSameSpec){
    		for(var m in isSameSpec[j]){
    			if(isSameSpec[j][m] == $(btnThis).parents('.alert-dismissable').find('.specSlect').find('option:selected').text()){
        			isSameSpec.splice($.inArray(isSameSpec[j],isSameSpec),1);
        		}
    		}
    	}
    	for (var i = 0; i < selectSpec.length; i++) {
    		if (selectSpec[i].specId == pid) {
    			if (selectSpec[i].specItems.length > 0) {
    				SKU.removeSpecCol(pid);
    				/*需要清除表格*/
    				needClear = 1;
    			}
    			selectSpec.splice(i, 1);
    			break;
    		}
    	}
    	preCombineV2(0, {});
    	/*生成表格*/
    	SKU.createTbl();
    },
    /*删除小项*/
    removeSmallSpec : function(lblThis, specId) {
    	/*删除SKU行*/
    	SKU.doRemoveTrBySmallSpec(specId, $(lblThis).attr('specName'));
    	SKU.doRemoveSmallSpec($(lblThis).attr('pId'), specId);
    	$(lblThis).parent().remove();
    },
    doRemoveTrBySmallSpec : function(smallId, smallName) {
		$('.specnum').each(function(){
			if($(this).attr('specnum') == smallId){
				$(this).parents('tr').remove();
			}
			for(var h = 0; h < tblArr.length; h++){
				if(tblArr[h]['ids'].indexOf(smallId + "-" + smallName) != -1){
					tblArr.splice(h,1);
				}
			}
		});
		
    }, 
    doRemoveSmallSpec : function(pid, id) {
		needClear = 0;
		for (var i = 0; i < selectSpec.length; i++) {
			if (selectSpec[i].specId == pid) {
				for (var j = 0; j < selectSpec[i].specItems.length; j++) {
					if (selectSpec[i].specItems[j].specId == id) {
						selectSpec[i].specItems.splice(j, 1);
						break;
					}
				}
				if (selectSpec[i].specItems.length == 0) {
	    				SKU.removeSpecCol(pid);
	    				/*需要清除表格*/
	    				needClear = 1;		
				}
				break;
			}
		}
		preCombineV2(0, {});
    	/*生成表格*/
    	SKU.createTbl();
    },
    removeSpecCol : function(pid) {
    	$("th[specNum='" + pid + "']").remove();
    }
}

function isExist(pid,id){
	for(var i = 0; i < selectSpec.length; i++){
		if(selectSpec[i].specId == pid){
			for(var j = 0; j < selectSpec[i].specItems.length; j++){
				if(selectSpec[i].specItems[j]['specId'] == id){
					return 1;
				}
			}
		}
	}
	/*没有添加过*/
	return 0;		
}

function preCombineV2(index,current){
	resultBk = new Array();
	combineV2(0, {});
}

function combineV2(index,current){
	if (index < selectSpec.length - 1) {
		var thisItem = selectSpec[index];
		var items = thisItem.specItems;
		if (items.length == 0) {
			combineV2(index + 1,current);
		}
		for (var i = 0; i < items.length; i++) {
			if (!items[i]) continue;
			var newMap = {};
			newMap = $.extend(true,newMap,current);
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
			combineV2(index + 1,newMap);
		}
	} else if (index == selectSpec.length -1) {
		var thisItem = selectSpec[index];
		var items = thisItem.specItems; 
		
		if (items.length == 0) {
			pushToResultBk(current);
		}
		for (var i = 0; i < items.length; i++) {
			if(!items[i])continue;
			var newMap = {};
			newMap = $.extend(true,newMap,current);
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

function combine(index, current){
    if (index < selectSpec.length - 1){
        var specItem = selectSpec[index];
        var keya = specItem.specName;
        var items = specItem.specItems;
        if(items.length==0){
            combine( index + 1, current);
        }
        for (var i = 0; i < items.length; i++){
            if(!items[i])continue;
            var newMap = {};
            newMap = $.extend(newMap,current);
            newMap[keya] = items[i];
            combine( index + 1, newMap);
        }
    }else if (index == selectSpec.length - 1){
        var specItem = selectSpec[index];
        var keya = specItem.specName;
        var items = specItem.specItems;
        if(items.length==0){
            result.push(current);
        }
        for (var i = 0; i < items.length; i++){
            if(!items[i])continue;
            var newMap = {};
            newMap = $.extend(newMap,current);
            newMap[keya] = items[i];
            result.push(newMap);
        }
    }
}

var skuObjForUpdate = {'isUpdate':0};

/*去左右空格;*/
function trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}

/*清空数据*/
function clearForm() {
	KindEditor.html('#editor', '');
	$(':input', '#spuForm')
	.not(':button, :submit, :reset, :hidden')
	.val('')
	.removeAttr('checked')  
	.removeAttr('selected');
	/*清除上传图片*/
	$('#imgUl li').remove();
	$('.goodsTitle').hide();
	/*把大单位初始化为箱*/
	$("#bigUnitId ").get(0).selectedIndex = 2;
}

/*验证多规格是否为空*/
function verifySpec() {
	var res = true;
		if ($('.setSpecCheck').is(':checked')) {
			$("#multiSpecTbl tr td .specNameText").each(function() {
	    	if ($(this).text() == '') {
	    		res = false;
	    	}
		});
		$("#multiSpecTbl tr td input.inputSpec").each(function() {
			if ($(this).val() == '') {
				res = false;
			}
		});
	}
	return res;
}

/*起定量添加*/
function addInput(){
	var minOrderNum = $("#minOrderNum").val();
	$("#minOrderNum").val(++minOrderNum);
}
/*起定量减少*/
function decInput(){
	var minOrderNum = $("#minOrderNum").val();
	if (minOrderNum <= 1) {
		minOrderNum = 2;
	}
	$("#minOrderNum").val(--minOrderNum);
}
/*验证起定量*/
function verifyMinOrderNum() {
	var minOrderNum = $("#minOrderNum").val();
	var parnt = /^[1-9]\d*?$/;
    if (!parnt.exec(minOrderNum)) {
    	$("#minOrderNum").val('1');
    }
}

function goback() {
	window.history.go(-1);
}

function changeSmallUnitId(val) {
	$("#smallUnitName").val(val);
}

function changeBigUnitId(val) {
	$("#bigUnitName").val(val);
}

function loseHashCode(str) {
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash += char;
    }
    return hash;
}

function isBrand() {
	var bool = false;
	for (var i = 0; i < brandArray.length; i++) {
		if ($("#brand").val() == brandArray[i]['name']) {
			bool = true;
			break;
		}
	}
	return bool;
}

function isCategory() {
	var bool = false;
	for (var i = 0; i < categoryArray.length; i++) {
		if ($("#product_class_text").val() == categoryArray[i]) {
			bool = true;
			break;
		}
	}
	return bool;
}