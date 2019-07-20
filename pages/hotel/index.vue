<template>
  <div style="padding:50px;">
     <div id="container" style="width:500px; height:500px;"></div>
  </div>
</template>

<script>

export default {
  mounted(){

      // 页面加加载之后执行
    window.onLoad  = function(){
        // 生成地图.container是显示地图的div的id
        var map = new AMap.Map('container', {
            zoom:11,//放大级别
            center: [118.8718107, 31.32846821],//中心点坐标，经纬度
            viewMode:'3D'//使用3D视图
        });

        // 创建一个 Marker 实例：
        var marker = new AMap.Marker({
            //content: "<div style='width:20px; height:20px; background:red;'>1</div>",
            position: new AMap.LngLat(118.8718107, 31.32846821),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: '北京'
        });

        map.add(marker);
    }

    // 地图的链接
    var key = "fc349821166279b8365299d22d7cf202"
    var url =  `https://webapi.amap.com/maps?v=1.4.15&key=${ key}&callback=onLoad`;
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
}
</script>

<style>

</style>
