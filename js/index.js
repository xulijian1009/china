$(function(){
    $.ajax({  
        type : "get",  
        async:false,  
        url : "https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5&_="+(new Date().getTime()),
        dataType : "jsonp",//数据类型为jsonp  
        jsonp: "callback",//服务端用于接收callback调用的function名的参数  
        success : function(data){  
            if(data.ret == 0){
                renderSummary(JSON.parse(data.data));
                var ChinaChartData  = getChinaData(JSON.parse(data.data));
                renderChinaMap(ChinaChartData);
                var henanChartData  = gethenanMapData(JSON.parse(data.data));
                renderhenanMap(shanxiChartData);
            }
        },  
        error:function(){  
            alert('fail');  
        }  
    });   
})

var renderSummary = function(data){
    $("#confirm-number").text(data.chinaTotal.confirm);
    $("#suspect-number").text(data.chinaTotal.suspect);
    $("#health-number").text(data.chinaTotal.heal);
    $("#dead-number").text(data.chinaTotal.dead);
    $("#confirm-add").text(data.chinaAdd.confirm);
    $("#suspect-add").text(data.chinaAdd.suspect);
    $("#health-add").text(data.chinaAdd.heal);
    $("#dead-add").text(data.chinaAdd.dead);
}

var getChinaData = function(data){
    console.log(data);
    var ChinaDataArray = data.areaTree[0].children;
    var chartData = {
        data:[],
        tooltipData:[],
        total: data.chinaTotal.confirm
    };
    for(var index in ChinaDataArray){
        chartData.data.push({
            name: ChinaDataArray[index].name,
            value: ChinaDataArray[index].total.confirm
        });
        chartData.tooltipData.push({
            name: ChinaDataArray[index].name,
            value: [
                {name:"确诊人数", value:ChinaDataArray[index].total.confirm},
                {name:"疑似病例", value:ChinaDataArray[index].total.suspect},
                {name:"治愈人数", value:ChinaDataArray[index].total.heal},
                {name:"死亡人数", value:ChinaDataArray[index].total.dead},
                {name:"当天新增确诊人数", value:ChinaDataArray[index].today.confirm},
                {name:"当天新增疑似病例", value:ChinaDataArray[index].today.suspect},
                {name:"当天新增治愈人数", value:ChinaDataArray[index].today.heal},
                {name:"当天新增死亡人数", value:ChinaDataArray[index].today.dead},
            ]
        })
    }
    console.log(chartData);
    return chartData;
}

var renderChinaMap = function(chartData){
    var data = chartData.data;
    var toolTipData = chartData.tooltipData;
    var myChart = echarts.init(document.getElementById('China'));
    var name_title = "中国疫情地图"
    var nameColor = "#fff"
    var name_fontFamily = '等线'
    var subname_fontSize = 15
    var name_fontSize = 18
    var mapName = 'china'
    
        
    var geoCoordMap = {};
   
    
    /*获取地图数据*/
    myChart.showLoading();
    var mapFeatures = echarts.getMap(mapName).geoJson.features;
    myChart.hideLoading();
    mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
    
    });
    
    // console.log("============geoCoordMap===================")
    // console.log(geoCoordMap)
    // console.log("================data======================")
    console.log(data)
    console.log(toolTipData)
    var max = 480,
        min = 9; // todo 
    var maxSize4Pin = 100,
        minSize4Pin = 20;
    
    var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
                res.push({
                    name: data[i].name,
                    value: geoCoord.concat(data[i].value),
                });
            }
        }
        return res;
    };
    option = {
        title: {
            text: name_title,
            x: 'center',
            textStyle: {
                color: nameColor,
                fontFamily: name_fontFamily,
                fontSize: name_fontSize
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                if (typeof(params.value)[2] == "undefined") {
                    var toolTiphtml = ''
                    for(var i = 0;i<toolTipData.length;i++){
                        if(params.name==toolTipData[i].name){
                            toolTiphtml += toolTipData[i].name+':<br>'
                            for(var j = 0;j<toolTipData[i].value.length;j++){
                                toolTiphtml+=toolTipData[i].value[j].name+':'+toolTipData[i].value[j].value+"<br>"
                            }
                        }
                    }
                    // console.log(toolTiphtml)
                    // console.log(convertData(data))
                    return toolTiphtml;
                } else {
                    var toolTiphtml = ''
                    for(var i = 0;i<toolTipData.length;i++){
                        if(params.name==toolTipData[i].name){
                            toolTiphtml += toolTipData[i].name+':<br>'
                            for(var j = 0;j<toolTipData[i].value.length;j++){
                                toolTiphtml+=toolTipData[i].value[j].name+':'+toolTipData[i].value[j].value+"<br>"
                            }
                        }
                    }
                    // console.log(toolTiphtml)
                    // console.log(convertData(data))
                    return toolTiphtml;
                }
            }
        },
        // legend: {
        //     orient: 'vertical',
        //     y: 'bottom',
        //     x: 'right',
        //     data: ['credit_pm2.5'],
        //     textStyle: {
        //         color: '#fff'
        //     }
        // },
        visualMap: {
            type: 'piecewise',
            pieces: [{
                    max: 9,
                    label: '1-9人',
                    color: '#ffaa85'
                },
                {
                    min: 10,
                    max: 99,
                    label: '10-99人',
                    color: '#ff7b69'
                },
                {
                    min: 100,
                    max: 999,
                    label: '100-999人',
                    color: '#bf2121'
                },
                {
                    min: 1000,
                    max: 9999,
                    label: '1000-9999人',
                    color: '#7f1818'
                },
                {
                    min: 10000,
                    label: '>10000人',
                    color: '#420b0b'
                },
            ],
            color: '#fff',
            textStyle: {
                color: '#fff',
            },
            visibility: 'off'
        },
        series: [{
                name: '散点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertData(data),
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fff',
                        areaColor: '#fff',
                        borderColor: '#fff',
                        label: {
                            show: true,
                            textStyle: {
                                color: "rgb(249, 249, 249)"
                            }
                        }
                    },
                    emphasis: {
                        areaColor: false,
                        borderColor: '#fff',
                        areaStyle: {
                            color: '#fff'
                        },
                        label: {
                            show: true,
                            textStyle: {
                                color: "rgb(249, 249, 249)"
                            }
                        }
                    }
                },
            },
            {
                type: 'map',
                map: mapName,
                geoIndex: 0,
                aspectScale: 0.75, //长宽比
                zoom: 1.23,
                showLegendSymbol: false, // 存在legend时显示
                label: {
                    normal: {
                        show: true
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                roam: false,
                itemStyle: {
                    normal: {
                        areaColor: '#031525',
                        borderColor: '#3B5077',
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: data
            }
    
        ]
    };
    myChart.setOption(option);
}
