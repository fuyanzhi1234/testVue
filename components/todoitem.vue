<template>
    <li>{{ toDo }}</li>
</template>

<script>
export default {
  props:{
      toDo:{
        type: String,
        default: 'xx'
      }
    }
}
</script>

