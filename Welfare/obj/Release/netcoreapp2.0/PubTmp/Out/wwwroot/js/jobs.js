var job = function () {
    //页面数据
    var _pageData = {
        pageIndex: 1,
        city: "上海",
        key: ".net",
        isGetJobsByZL: true,
        isGetJobsByLP: true,
        isGetJobsByQC: true,
        isGetJobsByBS: true,
    };

    return {
        init: function () {
            this.pageInit();
            this.bindEvent();
        },
        //独立方法
        method: {
            //加载招聘信息
            loadJobsInfo: function (index) {
                var tempHtml = "";
                var source = "", salaryType = "月薪";
                $.ajax({
                    url: "/api/Welfare/GetAll?page=" + index,
                    data: "",
                    success: function (sData) {
                        console.log(sData);
                        for (var i = 0; i < sData.length; i++) {
                            var fuli = sData[i];
                            console.log(fuli.image)
                            tempHtml +=
                                '<article class="excerpt excerpt-' + i + 1 + '" >\
                                  <a target = "_blank" class="focus" href = "'+ fuli.detailsUrl + '" > <img data-src="' + fuli.image + '" alt="' + fuli.title + '" src="' + fuli.image + '" class="thumb" style="display: inline;"></a>\
                                    <header><a class="cat" href="http://fuliba.net/category/flhz">福利汇总<i></i></a> <h2><a target="_blank" href="'+ fuli.detailsUrl + '" title="' + fuli.title + '">' + fuli.title + '</a></h2></header>\
                                    <p class="meta"><time><i class="fa fa-clock-o"></i>'+fuli.date+'</time><a class="pc" href="'+ fuli.detailsUrl + '"><i class="fa fa-comments-o"></i>' + fuli.pinglun + '</a><a href="javascript:;" class="post-like" data-pid="50908"><i class="fa fa-thumbs-o-up"></i>赞(<span>' + fuli.zan +'</span>)</a></p>\
                                    <p class="note">'+ fuli.content +'</p>\
                                      </article >';
                        }
                        $(".dataDiv").append(tempHtml);
                    }
                });
            },
            //重置信息
            resetInfo: function () {
                _pageData.pageIndex = this.queryString("index") || 0;
                _pageData.city = $(".place_a.select_place_a").text();
                _pageData.key = $(".jobKey").val();
                _pageData.isGetJobsByZL = $(".isGetJobsByZL").prop("checked");
                _pageData.isGetJobsByLP = $(".isGetJobsByLP").prop("checked");
                _pageData.isGetJobsByQC = $(".isGetJobsByQC").prop("checked");
                _pageData.isGetJobsByBS = $(".isGetJobsByBS").prop("checked");
                _pageData.isGetJobsByLG = $(".isGetJobsByLG").prop("checked");
                $(".dataDiv").html("");
            },
            //加载详细信息
            loadDetailsInfo: function (ele, type, url) {
                var urlType = "";
                switch (type) {
                    case "智联":
                        urlType = "GetDetailsInfoByZL";
                        break;
                    case "猎聘":
                        urlType = "GetDetailsInfoByLP";
                        break;
                    case "前程":
                        urlType = "GetDetailsInfoByQC";
                        break;
                    case "BOSS":
                        urlType = "GetDetailsInfoByBS";
                        break;
                    case "拉勾":
                        urlType = "GetDetailsInfoByLG";
                        break;
                }

                $.ajax({
                    url: "/api/jobs/" + urlType + "?url=" + url,
                    success: function (sData) {
                        if (sData) {
                            var tempHtml = "";
                            tempHtml += "<div class='detailsSketch detailsBlock'>" + (sData.experience || "");
                            tempHtml += "&nbsp&nbsp|&nbsp&nbsp" + (sData.education || "") + "";
                            tempHtml += "&nbsp&nbsp|&nbsp&nbsp" + (sData.companyNature || "") + "";
                            tempHtml += "&nbsp&nbsp|&nbsp&nbsp" + (sData.companySize || "") + "</div>";
                            tempHtml += "<div class='detailsBlock'><div class='detailsBlock-title'>职位描述：</div>" + (sData.requirement || "").trim() + "</div>";
                            if (sData.companyIntroduction)
                                tempHtml += "<div class='detailsBlock'><div class='detailsBlock-title'>公司简介：</div>" + (sData.companyIntroduction || "").trim() + "</div>";
                            $(ele).html(tempHtml);
                        }
                    }
                });
            },
            //QueryString
            queryString: function (name) {
                var url = encodeURI(location.search); //获取url中"?"符后的字串
                var theRequest = new Object();
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                }
                return theRequest[name];
            }
        },
        //页面加载初始化
        pageInit: function () {

            var method = this.method;
            method.loadJobsInfo(_pageData.pageIndex);
            history.pushState(null, null, location.href.split("?")[0] + "?index=" + _pageData.pageIndex);//塞入历史记录，并改变当前url
        },
        //事件绑定
        bindEvent: function () {
            var method = this.method;
            //自动加载信息
            var autoLoad = function () {
                method.loadJobsInfo(_pageData.pageIndex);
                //if (event && event.clientX) //用来判断是否是鼠标点击触发
                history.pushState(null, null, location.href.split("?")[0] + "?index=" + _pageData.pageIndex);//塞入历史记录，并改变当前url
            };

            //重新加载
            var reloadLoad = function () {
                method.resetInfo();
                autoLoad();
            }
            //点击 更多区域
            $(".btn-moreplace").click(function () {
                $(".hid_place_div").toggle();
                $(".hid_place_div").css("position", "absolute")
                    .css("width", $(".mytableSelect").css("width"))
                    .css("left", $(".mytableSelect")[0].offsetLeft - 1);
            });

            //点击热门区域
            $(".place_a").click(function () {
                $(".place_a.select_place_a").removeClass("select_place_a");
                $(this).addClass("select_place_a");
                reloadLoad();
            });

            //点击其他区域
            $(".hid_place_a").click(function () {
                debugger
                $(".hid_place_div").hide();
                $(".place_a.select_place_a").removeClass("select_place_a");
                $(".temp_place_a").text($(this).text()).addClass("select_place_a");
                reloadLoad();
            });

            //点击重新查询
            $(".btn-query").click(function () {
                reloadLoad();
            });

            //回车搜索
            $(".jobKey").keydown(function (event) {
                if (event.keyCode == 13)
                    reloadLoad();
            });

            //点击复选框时
            $(":checkbox").click(function () {
                reloadLoad();
            });

            //点击选中(加载详情)
            $("html").on("click", ".jobinfo", function () {

                $(".detailsInfo").not($(this).next()).addClass("displayNone");

                if ($(this).next().hasClass("detailsInfo")) {
                    if ($(this).next().hasClass("displayNone"))
                        $(this).next().removeClass("displayNone");
                    else
                        $(this).next().addClass("displayNone");
                }
                else {
                    $(this).after("<div class='detailsInfo'><div class='loading'>正在加载...</div></div>");
                    var url = $(this).find(".positionName .info_url").prop("href");
                    //加载详情
                    method.loadDetailsInfo($(this).next(), $(this).find(".source").text(), url);
                }

                if (!$(this).hasClass("chosen"))
                    $(this).addClass("chosen");
            });

            //鼠标移出事件
            $("html").on("mouseout", ".jobinfo", function () {
                if ($(this).hasClass("mouseover"))
                    $(this).removeClass("mouseover");
            });

            //鼠标进入事件
            $("html").on("mouseover", ".jobinfo", function () {
                if (!$(this).hasClass("mouseover"))
                    $(this).addClass("mouseover");
            });

            if (history.pushState) {
                window.addEventListener("popstate", function () {
                });
            }

            //滚动条
            $(window).scroll(function () {
                var scrollTop = $(window).scrollTop();
                var top = $(document).height() - $(window).height() - scrollTop;
                if (top == 0) {
                    _pageData.pageIndex++;
                    autoLoad();
                }
            });
        }
    };
}();

//页面加载完成
$(function () {
    job.init();
});