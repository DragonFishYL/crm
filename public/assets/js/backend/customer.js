define(['jquery','layui','bootstrap', 'backend', 'table', 'form', 'jstree','selectpage'], function ($, undefined, Backend, Table, Form, undefined) {

    var Controller = {
        index: function () {
            layui.use('element', function(){
                var element = layui.element;
                
                //…
              });


        },
        add: function () {
            setTimeout(function(){
                $(".layui-form").css("display","block");
                },
             1000);
            Controller.api.bindevent();
            //tab选项卡
            $(function(){
                layui.use(['element','form','laydate','layer'], function(){
                    var element = layui.element;
                    var form = layui.form;
                    var laydate = layui.laydate;
                    var layer = layui.layer;
                    laydate.render({
                        elem: '#birthday'
                        ,done: function(value, date, endDate){
                            var ages = jsGetAge(value);
                            if(ages < 0) {
                                $("#customer_age").val("");
                                form.render();
                                layer.msg('请输入正确的出生日期');
                            }else{
                                $("#customer_age").val(ages);
                                form.render();
                            }

                          }
                      });
                    laydate.render({
                        elem: '#Patient_birthday'
                      });
                    laydate.render({
                        elem: '#Physical_examination_birthday'
                      });
                    laydate.render({
                        elem: '#Consultation_time' 
                        ,type: 'datetime'
                    });
                    laydate.render({
                        elem: '#Process_occurrence_time' 
                        ,type: 'datetime'
                    });
                    laydate.render({
                        elem: '#Process_next_time' 
                        ,type: 'datetime'
                    });
                    laydate.render({
                        elem: '#Patient_target_time' 
                        ,type: 'datetime'
                    });
                    laydate.render({
                        elem: '#Physical_examination_time' 
                        ,type: 'datetime'
                    });
                    //监听咨询项目
                    form.on('select(Consultation_project)', function(data){
                        if(data.value == '2' || data.value == '4') {
                            $(".Physical-box").show();
                        }else{
                            $(".Physical-box").hide();
                        }
                      }); 
                      $("#Contacts_phone").blur(function(){
                          var phone = $("#Contacts_phone").val();
                          var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
                          if(!reg.test(phone)){
                            layer.msg('请输入正确手机号码');
                          }else{
                              var phonesub = phone.substr(0,7);
                              var data = {'phone':phonesub};
                              var url = "customer/proviceCity";
                              $.post(url,data,function(msg){
                                    console.log(msg.Province)
                                    console.log(msg.City)
                                    $("#Contacts_province").html('<option selected value="'+msg.Province+'">'+msg.Province+'</optioin>');
                                    $("#Contacts_city").html('<option selected value="'+msg.City+'">'+msg.City+'</optioin>');
                                    $("#Contacts_zip_code").val(msg.PostCode);
                                    form.render();
                              })
                          }
                      })
                  });
              })
              //
              $(".shortcut-navigation ul li").click(function(){
                    $(".shortcut-navigation ul li a").removeClass('a-lick');
                    $(this).children('a').addClass("a-lick");
              })
                /*根据出生日期算出年龄*/
                function jsGetAge(strBirthday) {
                    var returnAge;
                    var strBirthdayArr = strBirthday.split("-");
                    var birthYear = strBirthdayArr[0];
                    var birthMonth = strBirthdayArr[1];
                    var birthDay = strBirthdayArr[2];

                    d = new Date();
                    var nowYear = d.getFullYear();
                    var nowMonth = d.getMonth() + 1;
                    var nowDay = d.getDate();

                    if (nowYear == birthYear) {
                        returnAge = 0;//同年 则为0岁
                    }
                    else {
                        var ageDiff = nowYear - birthYear; //年之差
                        if (ageDiff > 0) {
                            if (nowMonth == birthMonth) {
                                var dayDiff = nowDay - birthDay;//日之差
                                if (dayDiff < 0) {
                                    returnAge = ageDiff - 1;
                                }
                                else {
                                    returnAge = ageDiff;
                                }
                            }
                            else {
                                var monthDiff = nowMonth - birthMonth;//月之差
                                if (monthDiff < 0) {
                                    returnAge = ageDiff - 1;
                                }
                                else {
                                    returnAge = ageDiff;
                                }
                            }
                        }
                        else {
                            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
                        }
                    }

                    return returnAge;//返回周岁年龄

                }

        },
        edit: function () {
            Controller.api.bindevent();
                $('#selectPage').selectPage({
                    keyField : 'id',
                    data : 'auth/group/seldepartment',
                    eAjaxSuccess: function (d) {
                        var result;
                        if (d) result = d;
                        else result = undefined;
                        return result;
                    }
                });
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"), null, null, function () {
                    if ($("#treeview").size() > 0) {
                        var r = $("#treeview").jstree("get_all_checked");
                        $("input[name='row[rules]']").val(r.join(','));
                    }
                    return true;
                });

            },

        }
    };
    return Controller;
});