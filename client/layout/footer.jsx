import '../assets/style/footer.styl'
export default {
  data () {
    return {
      author: 'qhx'
    }
  },
  render () {
    return (
      <div id="footer">
        <span>Written By {this.author}</span>
      </div>
    )
  }
}
