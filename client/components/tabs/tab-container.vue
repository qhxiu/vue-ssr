<script lang="jsx">
export default {
  props: {
    panes: {
      type: Array,
      required: true
    }
  },
  render () {
    console.log(this.panes)
    // vue每个节点创建一个虚拟dom，虚拟dom会判断props和自己声明的data有没有变化，如果props和data的对比过程没有任何变化的话，就不会渲染
    const content = this.panes.map(pane => {
      return pane.active ? pane.$slots.default : null
    })
    console.log(content)
    return (
      <div class="tab-content">
        {content}
      </div>
    )
  }
}
</script>
