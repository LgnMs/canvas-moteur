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
        backgroundColor: 'green',
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