    //设置重复任务
        $('#repeatSet').on('click',function(){
            $("#setRepeat").modal('show'); //展示设置重复任务弹出层
            $(".nav-stacked").hide(); //隐藏UI弹出层

            //动态设置月的天数
            var html = '';
            for(var i=1;i<=mGetDate();i++){
                html+='<option value="'+i+'号">'+i+'号</option>'
            }
            $("#monthDays").append(html);

            //默认隐藏
            $('.frequency').hide();
            $('.frequencyWeek').hide();
            $('.frequencyday').hide();
            $('.end').hide();

            //默认选择结束日期单选
            $('#never').attr("checked",true);
            $('.repetitionNum').attr("disabled",true);
            $('.endDate').attr("disabled",true);

            //判断选择重复类型
            $("#repeat_mode").change(function(){
                var static = $("#repeat_mode").val();
                switch (static){
                    case "从不重复" :
                            $('.frequency').hide();
                            $('.frequencyWeek').hide();
                            $('.frequencyday').hide();
                            $('.end').hide();
                    break;
                    case "天" :
                            $('.frequency').show();
                            $('.frequency').find(".day").text("天");
                            $('.frequencyWeek').hide();
                            $('.frequencyday').hide();
                            $('.end').show();
                    break;
                    case "周" :
                            $('.frequency').show();
                            $('.frequency').find(".day").text("周");
                            $('.frequencyWeek').show();
                            $('.frequencyday').hide();
                            $('.end').show();
                    break;
                    case "月" :
                            $('.frequency').show();
                            $('.frequency').find(".day").text("月");
                            $('.frequencyWeek').hide();
                            $('.frequencyday').show();
                            $('.end').show();
                    break;
                    default : 
                            $('.frequency').show();
                            $('.frequency').find(".day").text("年");
                            $('.frequencyWeek').hide();
                            $('.frequencyday').hide();
                            $('.end').show();
                }
                //默认隐藏显示
            })

            //判断结束时间单选
            $('#never').on('click',function(){
                //取消打钩
                $('#endTime').attr("checked", false);
                $('#repetition').attr("checked", false);

                //默认禁用
                $('.repetitionNum').attr("disabled",true);
                $('.endDate').attr("disabled",true);

                //添加类
                $(this).addClass("active").siblings().removeClass("active");
                //移除类
                $('#endTime').removeClass("active");
                $('#repetition').removeClass("active");

                 //展示不相关数据为空
                $('.repetitionNum').val('');
                $('.endDate').val('');

            });
            $('#endTime').on('click',function(){
                //默认打钩
                $('#never').attr("checked", false);
                $('#repetition').attr("checked", false);

                //默认禁用
                $('.repetitionNum').attr("disabled",true);
                $('.endDate').attr("disabled",false);

                //添加类
                $(this).addClass("active").siblings().removeClass("active");
                //取消类
                $('#never').removeClass("active");
                $('#repetition').removeClass("active");

                 //展示不相关数据为空
                $('.endDate').val('');
            });
            $('#repetition').on('click',function(){
                 //默认打钩
                $('#endTime').attr("checked", false);
                $('#never').attr("checked", false);
                
                //默认禁用
                $('.repetitionNum').attr("disabled",false);
                $('.endDate').attr("disabled",true);
                //添加类
                $(this).addClass("active").siblings().removeClass("active");
                //取消类
                $('#never').removeClass("active");
                $('#endTime').removeClass("active");
                //展示不相关数据为空
                $('.endDate').val('');
            });


            //请求任务重复数据查询接口
            var taskId = $('#repeatSet').attr("data-id");
            if(taskId!=''){showRepeatRules(taskId);}else{return false;}
        });

        //获取当月天数
        function mGetDate(){
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var d = new Date(year, month, 0);
            return d.getDate();
       }

       //重复任务展示
       function showRepeatRules(data){
            $.ajax({
                url:task+'task/repeat/showRepeatRules',
                type:'get',
                dataType:'json',
                async:false,
                data : {"taskId":data},
                success:function(data){
                    if(data.status==='success'){
                        //任务列名称展示
                        $('#setRepeatAdd').attr("data-id",data.data.result[0].id);

                        //数据展示列表
                        showDateRules(data.data.result[0]);
                        //修改保存按钮的描述
                        if(data.data.result[0].id){
                            $('#setRepeatAdd').text("修改");
                        }
                    }else{
                        $('#repeat_mode').val("从不重复");
                        $('#setRepeatAdd').text("保存");
                        spop({
                            template: '没有设置重复规则,请设置!',
                            autoclose: 2000
                        });
                    }
                },
                error: function(data){
                    spop({
                        template: '请求1失败!',
                        autoclose: 2000
                    });
                }
            });
       }

       //重复任务展示
       function showDateRules(data){

            //默认数据为空
            $('#repeat_mode').val('从不重复');
            $('#repeat_frequency').val('');
            $('#monthDays').val('1号');
            $('#endDate').val('');

            //根据重复方式展示数据
            if(data.repeat_mode =="天"){
                $('#repeat_mode').val(data.repeat_mode);
                $('.frequency').show();
                $('.end').show();
                $('#repeat_frequency').val((data.repeat_frequency).replace(/天/g, ''));
                $('.day').text("天");
            }else if(data.repeat_mode =="周"){
                $('#repeat_mode').val(data.repeat_mode);
                $('.frequency').show();
                $('.end').show();
                $('#repeat_frequency').val((data.repeat_frequency).replace(/周/g, ''));
                $('.day').text("周");
                $('.frequencyWeek').show();
                //周展示
                var weekday = data.reoeat_date.split(',');
                for(var i=0;i<weekday.length;i++){
                    if(weekday[i]=="周一"){
                        $('.one').prop('checked',true);
                    }else if(weekday[i]=="周二"){
                        $('.two').prop("checked",true);
                    }else if(weekday[i]=="周三"){
                        $('.three').prop("checked",true);
                    }else if(weekday[i]=="周四"){
                        $('.four').prop("checked",true);
                    }else if(weekday[i]=="周五"){
                        $('.five').prop("checked",true);
                    }else if(weekday[i]=="周六"){
                        $('.six').prop("checked",true);
                    }else{
                        $('.seven').prop("checked",true);
                    }
                }
            }else if(data.repeat_mode =="月"){
                $('#repeat_mode').val(data.repeat_mode);
                $('.frequency').show();
                $('.end').show();
                $('#repeat_frequency').val((data.repeat_frequency).replace(/月/g, ''));
                $('.day').text("月");
                $('.frequencyday').show();
                $('#monthDays').val(data.reoeat_date);
            }else if(data.repeat_mode =="年"){
                $('#repeat_mode').val(data.repeat_mode);
                $('.frequency').show();
                $('.end').show();
                $('#repeat_frequency').val(data.repeat_frequency);
                $('.day').text("年");
            }else{
                $('#repeat_mode').val(data.repeat_mode);
                $('#repeat_frequency').val((data.repeat_frequency).replace(/年/g, ''));
            }

            //更具结束方式展示数据
            if(data.end_way!=''){
                if(data.end_way == "不结束"){
                    $('#never').attr("checked", true);
                }else{
                    //判断日期
                    var DATE_FORMAT = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
                    if(DATE_FORMAT.test(data.end_way)){
                        $('#endTime').attr("checked", true);
                        $('#endTime').parent().parent().find('#endDate').val(data.end_way);
                        $('#endTime').parent().parent().find('#endDate').attr("disabled",false);
                    }else{
                        $('#repetition').attr("checked", true);
                        $('#repetition').parent().parent().find('#endDate').val((data.end_way).replace(/次/g, ''));
                        $('#repetition').parent().parent().find('#endDate').attr("disabled",false);
                    }
                }
            }
       };

 
      

        //点击保存按钮
        $('#setRepeatAdd').on('click',function(){
            var taskId = $(this).attr("data-taskId"),    //获取任务id
                companyId = $(this).attr("data-companyId"),
                id = $(this).attr("data-id");
            
            var repeat_mode = $('#repeat_mode').val();  //获取重复类型
            if(!id){
                if(repeat_mode =="从不重复"){
                    var data = {
                        "id" : id,
                        "companyId" : companyId,
                        "taskId" : taskId,
                        "repeat_mode" :repeat_mode,
                        "repeatFrequency" :'',
                        "reoeatDate" : '',
                        "endWay" : ''
                    };
                    insertRepeatRules(data,taskId);
                }else{
                    insertRepeatRules(repeat(),taskId);
                }
            }else{
                if(repeat_mode =="从不重复"){
                    var data = {
                        "id" : id,
                        "companyId" : companyId,
                        "taskId" : taskId,
                        "repeat_mode" :repeat_mode,
                        "repeatFrequency" :'',
                        "reoeatDate" : '',
                        "endWay" : ''
                    };
                    updateRepeatRules(data,taskId);
                }else{
                    updateRepeatRules(repeat(),taskId);
                }
            }

            //获取重复数据
            function repeat(){
                var repeat_frequency = $('#repeat_frequency').val();  //获取重复频率
                if(repeat_frequency==''){       //判断重复频率不能为空
                    spop({
                        template:  '重复频率不能为空!',
                        autoclose: 2000
                    });
                    return false;
                }

                var week_day = [];  //一周设置的天数
            
                //获取设置一周的天数
                $(".week input[type=checkbox]").each(function(){
                    if($(this).is(':checked')){
                        week_day.push($(this).val());
                    }
                });  
                var days = week_day.join(","); //数组转换为字符串以“,”区分
                var monthDays = $('#monthDays').val(); //获取当前月的第几天
               

                var reoeat_date =''; //重复时间
                //判断选择的是周，或者月
                if(repeat_mode =="周"){
                    //判断一周选择的天数
                    if(days==''){
                        spop({
                            template:  '选择日期不能为空!',
                            autoclose: 2000
                        });
                        return false;
                    }
                    reoeat_date = days;
                    repeat_frequency = repeat_frequency;
                }else if(repeat_mode == "月"){
                    if(monthDays==''){
                        spop({
                            template:  '选择日期不能为空!',
                            autoclose: 2000
                        });
                        return false;
                    }
                    reoeat_date = monthDays;
                    repeat_frequency = repeat_frequency;
                }else if(repeat_mode == "天"){
                    reoeat_date = '';
                    repeat_frequency = repeat_frequency;
                }else if(repeat_mode == "年"){
                    reoeat_date = '';
                    repeat_frequency = repeat_frequency;
                }
                
                //结束时间判断
                var end_way = $('.active').parent().parent().find('#endDate').val();
                

                if(end_way==''){
                    spop({
                        template:  $('.active').parent().find('span').text()+'单选数据为空!',
                        autoclose: 2000
                    });
                    return false;
                }

                return  data = {
                    "id" : id,
                    "companyId" : companyId,
                    "taskId" : taskId,
                    "repeatMode" :repeat_mode,
                    "repeatFrequency" :repeat_frequency,
                    "reoeatDate" : reoeat_date,
                    "endWay" : isNumber(end_way)
                };

            }

            //判断是否是数字
            function isNumber(data) {         //验证是否为数字
                var patrn = /^(-)?\d+(\.\d+)?$/;
                if (patrn.exec(data)) {
                    return data;
                } else {
                    return data;
                }
            }


            
            //数据添加
            function insertRepeatRules(data,data2){
                 console.log(data);
                $.ajax({

                    url:'',
                    type:'get',
                    dataType:'json',
                    async:false,
                    data : data,
                    success:function(data){
                        if(data.status==='success'){
                            spop({
                                template: '保存成功!',
                                autoclose: 1000
                            });
                            showRepeatRules(data2);
                        }else{
                            spop({
                                template: '请求失败!',
                                autoclose: 1000
                            });
                        }
                    },
                    error: function(data){
                        spop({
                            template: '请求失败!',
                            autoclose: 1000
                        });
                    }
                });
            }

            //修改数据
            function updateRepeatRules(data,data2){
                console.log(data);
                $.ajax({
                    url:task+'task/repeat/updateRepeatRules',
                    type:'get',
                    dataType:'json',
                    async:false,
                    data : data,
                    success:function(data){
                        if(data.status==='success'){
                            spop({
                                template: '修改成功!',
                                autoclose: 1000
                            });
                            showRepeatRules(data2);
                        }else{
                            spop({
                                template: '请求失败!',
                                autoclose: 1000
                            });
                        }
                    },
                    error: function(data){
                        spop({
                            template: '请求失败!',
                            autoclose: 1000
                        });
                    }
                });
            }
        });