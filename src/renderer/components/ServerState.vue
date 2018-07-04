<template>
<div class="server-state">
  <div>
    <i class="m-magtool"></i>
  </div>
  <div class="label">
    SERVER
  </div>
</div>
</template>
<script>
export default {
  name: 'ServerState'
}
</script>
<style scoped>
.server-state {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}
.label {
  font-size: 21px;
  margin-top: 5px;
  color: #555;
  text-shadow: 0 1px 0 rgba(255, 255, 255, .4);
}
.m-magtool:before {
  font-size: 42px;
  color: #555;
  text-shadow: 0 1px 0 rgba(255, 255, 255, .4);
}
</style>
