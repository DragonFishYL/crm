define(['jquery','layui','bootstrap', 'backend', 'table', 'form', 'jstree','selectpage','cookie'], function ($, undefined, Backend, Table, Form, undefined) {

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
                $.cookie('Contact1',null);
                layui.use(['element','form','laydate','layer','table'], function(){
                    var element = layui.element;
                    var form = layui.form;
                    var laydate = layui.laydate;
                    var layer = layui.layer;
                    var table = layui.table;
                    var JsonData = $.cookie('Contact1');
                        //   添加联系人
                        $("#addContacts").click(function(){
                        var ContactsDatas = [];
                        var ContactsData = {};
                        var is_exist = "";
                        ContactsData['relationship'] = $("#Contacts_relationship").val();
                        ContactsData['phone'] = $("#Contacts_phone").val();
                        ContactsData['email'] = $("#Contacts_email").val();
                        ContactsData['weChat'] = $("#Contacts_weChat").val();
                        ContactsData['country'] = $("#Contacts_country").val();
                        ContactsData['province'] = $("#Contacts_province").val();
                        ContactsData['city'] = $("#Contacts_city").val();
                        ContactsData['code'] = $("#Contacts_zip_code").val();
                        ContactsData['address'] = $("#Contacts_address").val();
                        if(ContactsData['relationship'] !="" && ContactsData['phone'] !="") {
                            $("#contacts-table").show();
                            var Contact1s = $.cookie('Contact1');
                            if(Contact1s != 'null'){
                                var Contact1ss = JSON.parse(Contact1s);
                                for (var i = 0; i < Contact1ss.length; i++) {
                                     if(Contact1ss[i]['relationship'] == ContactsData['relationship']) {
                                        is_exist = "1";
                                     }
                                    
                                }
                                if(is_exist == "1") {
                                    layer.msg("存在与客户关系相同的联系人")
                                }else{
                                    Contact1ss.push(ContactsData);
                                    var json1 = JSON.stringify(Contact1ss);
                                    $.cookie('Contact1', json1);
                                    var resData = JSON.parse(json1);
                                    var resHtml = "";
                                    for (var q = 0; q < resData.length; q++) {
                                        var relationship = RelationalTransformation(resData[q]['relationship']);
                                        resHtml+='<tr>'
                                        resHtml+='<td>'+relationship+'</td>';
                                        resHtml+='<td>'+resData[q]['phone']+'</td>';
                                        resHtml+='<td>'+resData[q]['email']+'</td>';
                                        resHtml+='<td>'+resData[q]['country']+'</td>';
                                        resHtml+='<td>'+resData[q]['province']+'</td>';
                                        resHtml+='<td>'+resData[q]['city']+'</td>';
                                        resHtml+='<td><a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del" id="contactsDel'+q+'">删除</a></td>';
                                        resHtml+='</tr>'
                                    }
                                    $("#tableData").html(resHtml);
                                    $("#Contacts_relationship option[value='']").attr("selected", true);
                                    $("#Contacts_phone").val("");
                                    $("#Contacts_email").val("");
                                    $("#Contacts_weChat").val("");
                                    $("#Contacts_country option[value='']").attr("selected", true);
                                    $("#Contacts_province option[value='']").attr("selected", true);
                                    $("#Contacts_city option[value='']").attr("selected", true);
                                    $("#Contacts_zip_code").val("");
                                    $("#Contacts_address").val("");
                                    form.render();

                                }
                            }else{
                                ContactsDatas.push(ContactsData)
                                var jsons = JSON.stringify(ContactsDatas);
                                $.cookie('Contact1', jsons);
                                var resData = JSON.parse(jsons);
                                var resHtml = "";
                                for (var q = 0; q < resData.length; q++) {
                                    var relationship = RelationalTransformation(resData[q]['relationship']);
                                    resHtml+='<tr>'
                                    resHtml+='<td>'+relationship+'</td>';
                                    resHtml+='<td>'+resData[q]['phone']+'</td>';
                                    resHtml+='<td>'+resData[q]['email']+'</td>';
                                    resHtml+='<td>'+resData[q]['country']+'</td>';
                                    resHtml+='<td>'+resData[q]['province']+'</td>';
                                    resHtml+='<td>'+resData[q]['city']+'</td>';
                                    resHtml+='<td><a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del" id="contactsDel'+q+'">删除</a></td>';
                                    resHtml+='</tr>'
                                }
                                $("#tableData").html(resHtml);
                                $("#Contacts_relationship option[value='']").attr("selected", true);
                                $("#Contacts_phone").val("");
                                $("#Contacts_email").val("");
                                $("#Contacts_weChat").val("");
                                $("#Contacts_country option[value='']").attr("selected", true);
                                $("#Contacts_province option[value='']").attr("selected", true);
                                $("#Contacts_city option[value='']").attr("selected", true);
                                $("#Contacts_zip_code").val("");
                                $("#Contacts_address").val("");
                                form.render();
                            }
                            
                        }else{
                            layer.msg('请输入与客户的关系、联系电话')
                        }
                        console.log($.cookie('Contact1'));
                    })
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
                        ,done: function(value, date, endDate){
                            var ages = jsGetAge(value);
                            if(ages < 0) {
                                $("#Patient_age").val("");
                                form.render();
                                layer.msg('请输入正确的出生日期');
                            }else{
                                $("#Patient_age").val(ages);
                                form.render();
                            }

                          }
                      });
                    laydate.render({
                        elem: '#Physical_examination_birthday'
                        ,done: function(value, date, endDate){
                            var ages = jsGetAge(value);
                            if(ages < 0) {
                                $("#Physical_examination_age").val("");
                                form.render();
                                layer.msg('请输入正确的出生日期');
                            }else{
                                $("#Physical_examination_age").val(ages);
                                form.render();
                            }

                          }
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
                            $(".Patient-box").hide();
                            $("#is_PhysicalExamination").val('1');
                        }else{
                            $(".Physical-box").hide();
                            $(".Patient-box").show();
                            $("#is_PhysicalExamination").val('');
                        }
                      }); 
                    //监听客户记录类型
                    form.on('select(customer_type)', function(data){
                    var recordHtml = '<option value=""></optioin>';
                        if(data.value != '6') {
                            var data = {'id':data.value};
                            var url = 'customer/selRecord';
                            $.get(url,data,function(msg){
                              for (var i = 0; i < msg.length; i++) {
                                  recordHtml+='<option value="'+msg[i].id+'">'+msg[i].name+'</optioin>' ;
                              }
                              $("#customer_channel").empty().append(recordHtml);
                              form.render('select');
                            })
                        }
                        
                      }); 
                      //监听疾病大类
                      form.on('select(Patient_major_diseases)', function(data){
                         var diseaseSecondHtml = '<option value=""></optioin>';
                         var id = data.value;
                         if(id != "") {
                         var url2 = 'customer/diseaseSel';
                         var data = {'id':id,'type':'1'};
                         $.post(url2,data,function(msg){
                             for (var i = 0; i < msg.length; i++) {
                                diseaseSecondHtml+='<option value="'+msg[i].id+'">'+msg[i].name+'</optioin>' ;
                             }
                             $("#Patient_disease_subgroup").empty().append(diseaseSecondHtml);
                             form.render('select');
                         })
                        }else{
                            $("#Patient_disease_subgroup").empty();
                            $("#Patient_name_of_disease").empty();
                            form.render('select');
                        }
                      });
                      //监听疾病小类
                      form.on('select(Patient_disease_subgroup)', function(data){
                        var diseaseNameHtml = '<option value=""></optioin>';
                        var id = data.value;
                        if(id != "") {
                            var url2 = 'customer/diseaseSel';
                            var data = {'id':id,'type':'2'};
                            $.post(url2,data,function(msg){
                                console.log(msg)
                                for (var i = 0; i < msg.length; i++) {
                                   diseaseNameHtml+='<option value="'+msg[i].id+'">'+msg[i].name+'</optioin>' ;
                                }
                                $("#Patient_name_of_disease").empty().append(diseaseNameHtml);
                                form.render('select');
                            })
                        }else{
                            $("#Patient_name_of_disease").empty();
                            form.render('select');
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
                                    $("#Contacts_province").html('<option selected value="'+msg.Province+'">'+msg.Province+'</optioin>');
                                    $("#Contacts_city").html('<option selected value="'+msg.City+'">'+msg.City+'</optioin>');
                                    $("#Contacts_zip_code").val(msg.PostCode);
                                    form.render();
                              })
                          }
                        })
                      });
                  });
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
                //关系转换
                function RelationalTransformation($str) {
                    if($str == '1'){
                        var relationship = "子女";
                    }else if($str == '2') {
                        var relationship = "父母";
                    }else if($str == '3') {
                        var relationship = "兄弟";
                    }else if($str == '4') {
                        var relationship = "兄妹";
                    }else if($str == '5') {
                        var relationship = "姐弟";
                    }else if($str == '6') {
                        var relationship = "姐妹";
                    }else if($str == '7') {
                        var relationship = "配偶";
                    }else if($str == '8') {
                        var relationship = "朋友";
                    }else if($str == '9') {
                        var relationship = "其他";
                    }
                    return relationship;
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