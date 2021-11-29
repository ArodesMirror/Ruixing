<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
.auto-img{
  display: block;
  width: 100%;
  height: 100%;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearflx::after{
  content: "";
  display: block;
  clear: both;
}
.text-eli{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
