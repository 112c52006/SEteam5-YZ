<template>
    <div ref="editable">
      <a style="display:block;color:blue" @click="click">{{value}}</a>
      <div v-if="isPopup" class="vue-popUpSmall" :style="popPosition">
        <slot/>
        <slot name="footer">
          <div class="text-center">
            <div class="button">
              <input type="button" value="submit" class="btn_refresh refresh_roll tool_goal_submit" @click="$emit('submit')"
              />
            </div>
            <div class="button">
              <input type="button" value="Cancel" class="btn_refresh refresh_roll" @click="cancel" />
            </div>
          </div>
        </slot>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import Vue from "vue";
  export default {
    name: 'editable',
    props: {
      value: {
        type: [Number, String]
      },
      position: {
        type: String,
        default: '0'
      }
    },
    data() {
      return {
        isPopup: false
      }
    },
    computed: {
      popPosition() {
        return `margin-left:${this.position}`
      }
    },
    methods: {
      close() {
        this.isPopup = false
      },
      click() {
        this.isPopup = !this.isPopup
      },
      cancel() {
        this.isPopup = false
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .vue-popUpSmall {
    position: absolute;
    background-color: #e6e6e6;
    border: 4px solid #b9b9b9;
    color: #000000;
    padding: 5px;
    max-height: 300px;
    z-index: 1;
  }
  
  td {
    border: 0;
    padding: 2px;
  }
  .button {
    display: inline;
    margin: 2px;
  }
  </style>