<template>
  <section class="real-app">
    <div class="tab-container">
      <tabs :value="filter" @change="handleChangeTab">
        <tab :label="tab" :index="tab" v-for="tab in stats" :key="tab"></tab>
      </tabs>
    </div>
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下来要做什么？"
      @keyup.enter="handleAdd"
    />
    <item
      :todo="todo"
      v-for="todo in filteredTodo"
      :key="todo.id"
      @deleteTodo="deleteTodo"
      @toggle="toggleTodoState"
    />
    <helper :filter="filter" :todos="todos" @clearAllCompleted="clearAllCompleted" />
  </section>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Item from './item.vue'
import Helper from './helper.vue'
export default {
  metaInfo: {
    title: 'Todo App'
  },
  data () {
    return {
      filter: 'all',
      stats: ['all', 'active', 'completed']
    }
  },
  components: {
    Item,
    Helper
  },
  computed: {
    ...mapState(['todos']),
    filteredTodo () {
      if (this.filter === 'all') {
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter(todo => todo.completed === completed)
    }
  },
  // asyncData在vue里不会被执行
  asyncData ({ store, router }) {
    if (store.state.user) {
      return store.dispatch('fetchTodos')
    }
    router.replace('/login')
    return Promise.resolve()
  },
  mounted () {
    this.fetchTodos()
  },
  created () {},
  methods: {
    ...mapActions(['fetchTodos', 'addTodo', 'deleteTodo', 'updateTodo', 'deleteAllCompleted']),
    handleAdd (e) {
      const content = e.target.value.trim()
      if (!content) {
        this.$notify({
          content: '必须输入要做的内容'
        })
        return
      }
      const todo = {
        content,
        completed: false
      }
      this.addTodo(todo)
      e.target.value = ''
    },
    clearAllCompleted () {
      // this.todos = this.todos.filter(todo => !todo.completed)
      this.deleteAllCompleted()
    },
    handleChangeTab (value) {
      this.filter = value
    },
    toggleTodoState (todo) {
      this.updateTodo({
        id: todo.id,
        todo: Object.assign({}, todo, {
          completed: !todo.completed
        })
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .real-app
    width 600px
    margin 0 auto
    box-shadow 0 0 5px #666
.add-input
    position relative
    margin 0
    width 100%
    font-size 24px
    font-family inherit
    font-weight inherit
    line-height 1.4em
    border none
    outline none
    color inherit
    box-sizing border-box
    font-smoothing antialiased
    padding 16px 16px 16px 36px
    border none
    box-shadow inset 0 -2px 1px rgba(0, 0, 0, 0.03)
.tab-container {
  padding 0 15px
}
</style>
