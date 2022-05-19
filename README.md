# canvas-moteur

更简单的进行图形绘制，以及一些利于构建流程图、关系图或其它应用的功能（例如对图形交互事件监听，拖拽图形，添加锚点，连接锚点等）

## 安装

```
$ npm install canvas-moteur
```

## 使用 

```javascript
import { Draw } from 'canvas-moteur'

const draw = new Draw('canvas')

draw.addRect({
    x: 20,
    y: 10,
    width: 150,
    height: 100,
    anchors: ['left', 'right'],
    style: {
        backgroundColor: 'green'
    }
})  

draw.addCircle({
    x: 300,
    y: 400,
    r: 50,
    anchors: ['bottom', 'left'],
    style: {
        backgroundColor: 'red',
    }
})

draw.render();
```

## 功能

- [x] 绘制矩形、圆形
- [x] 绘制线条
- [x] 绘制图片
- [x] 绘制折线
- [ ] 通过路径（Path）绘制自定义图形

- [x] 可以自由移动图形
- [x] 有图形的事件监听 （mouserover、mousedown、mouseleave等）
- [x] 可以相当简单的在图形中添加锚点
- [x] 可以自由的连接锚点，线的位置会随着图形的位置变化
- [ ] 框选
- [ ] 拉索选择
- [ ] 撤销功能
- [ ] 高亮相邻节点与线
- [ ] 上下文菜单
- [ ] 移动画布
- [ ] 缩放画布

