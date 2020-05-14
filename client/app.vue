<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <button @click="notify"></button>
    <!-- <notification content="test notification"/> -->
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'
import Todo from './views/todo/todo.vue'

export default {
  metaInfo: {
    title: 'qhx\'s Todo App'
  },
  components: {
    Header,
    Footer,
    Todo
  },
  data () {
    return {}
  },
  mounted () {

  },
  methods: {
    notify () {
      // eslint-disable-next-line no-debugger
      debugger
      this.$notify({
        content: 'test $notify',
        btn: 'close'
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
