# canvas-moteur

更简单的进行图形绘制，以及一些利于构建流程图、关系图或其它应用的功能（例如对图形交互事件监听，拖拽图形，添加锚点，连接锚点等）

## 安装

```
$ npm install canvas-moteur
```

## 使用 

```javascript
import { Draw } from 'canvas-moteur'

const draw = new Draw({ el: 'canvas', isTranslate: true, isScale: true })

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

// 重置画布变换
function resetCanvasTransform() {
    draw.resetTransform()
}

// 撤销
function undo() {
    draw.dataCenter.undo()
}

// 重做
function redo() {
    draw.dataCenter.redo()
}

```

## 功能

### 基础功能
- [x] 绘制矩形、圆形
- [x] 绘制线条
- [x] 绘制图片
- [x] 绘制折线
- [x] 通过路径（Path）绘制自定义图形
- [ ] 更多可配置的样式属性

### 与编辑器相关的画布功能
- [x] 可以自由移动图形
- [x] 有图形的事件监听 （mouserover、mousedown、mouseleave等）
- [x] 可以相当简单的在图形中添加锚点
- [x] 可以自由的连接锚点，线的位置会随着图形的位置变化
- [ ] 框选
- [ ] 拉索选择
- [x] 撤销和重做功能
- [ ] 高亮相邻节点与线
- [ ] 上下文菜单
- [x] 移动画布
- [x] 缩放画布

### 高级功能
- [ ] 动画

