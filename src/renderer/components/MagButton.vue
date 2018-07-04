<template>
  <button class="mag-button" @click="$emit('click')" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'MagButton',
  // inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'disabled': (...args) => {
      console.log('wa disabled', args)
    }
  }
}
</script>

<style lang="stylus" scoped>
.mag-button 
  display: flex
  background: #D8D8D8
  color: #6A6A6A
  padding: 9px 14px
  min-width: 100px
  font: 300 18px 'Roboto-Condensed'
  text-shadow: 0 1px 0 rgba(255, 255, 255, .4)
  border-radius: 3px
  border: 1px solid #979797
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 1px 4px rgba(0, 0, 0, .25)
  transition: background .7s ease
  transition-property: background, box-shadow
  justify-content: center
  outline: none

  &:hover 
    background: #f8f8f8
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 1px 4px rgba(0, 0, 0, .25), 0 0 15px rgba(255, 255, 255, .33)

  &:active
    background: #999
    color: white

  &:disabled 
    color: #999
    box-shadow: none
    background: #C8C8C8
    border: 1px solid #888
</style>
