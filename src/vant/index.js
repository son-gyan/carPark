// 导入自己需要的组件
import { Grid, GridItem , Button,Swipe, SwipeItem ,Lazyload,Dialog,Toast,Popup,NavBar,Tabbar,TabbarItem,List,Search,Icon,
  Field,Picker,DatetimePicker,ImagePreview,Tag,Form,Col, Row,Card,Divider,Tab, Tabs,Empty } from 'vant'
const vant = {
  install: function (Vue) {
    Vue.use(Grid)
    Vue.use(GridItem)
    Vue.use(Button)
    Vue.use(Swipe)
    Vue.use(SwipeItem)
    Vue.use(Lazyload)
    Vue.use(Dialog)
    Vue.use(Toast)
    Vue.use(Popup)
    Vue.use(NavBar)
    Vue.use(Tabbar)
    Vue.use(TabbarItem)
    Vue.use(List)
    Vue.use(Search)
    Vue.use(Icon)
    Vue.use(Field)
    Vue.use(Picker)
    Vue.use(DatetimePicker)
    Vue.use(ImagePreview)
    Vue.use(Tag)
    Vue.use(Form)
    Vue.use(Col)
    Vue.use(Row)
    Vue.use(Card)
    Vue.use(Divider)
    Vue.use(Tab)
    Vue.use(Tabs)
    Vue.use(Empty)
  }
}
export default vant