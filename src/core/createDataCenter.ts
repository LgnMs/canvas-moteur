/**
 * 存储画布数据，提供撤销，重做等工鞥
 */

import cloneDeep from "lodash/cloneDeep"
import { Canvas } from "./crateCanvasApi"

 type Data = {
    // 画布中已有的图形和线
    shaps: any[]
    edges: any[]
}

export interface DataCenter {
    activeKey: number
    /**
     * 数据栈-最大存储100条数据
     */
    stack: Data[]
    data: Data
    canvas: Canvas

    /**
     * 添加、删除、移动完毕执行此操作
     */
    recordData(): void
    /**
     * 撤销
     */
    undo(): void
    /**
     * 重做
     */
    redo(): void
}

export function createDataCenter(canvas: Canvas) {
    const dataCenter: DataCenter = {
        activeKey: 0,
        stack: [],
        data: {
            shaps: [],
            edges: []
        },
        canvas,

        recordData() {
            if (dataCenter.activeKey < dataCenter.stack.length - 1) {
                dataCenter.stack.splice(dataCenter.activeKey + 1)
                dataCenter.activeKey += 1
            } else if (dataCenter.stack.length === 100) {
                dataCenter.stack.pop()
                dataCenter.activeKey = 99
            } else {
                dataCenter.activeKey = dataCenter.stack.length
            }
    
            dataCenter.stack.push(cloneDeep(dataCenter.data))
        },

        undo() {
            if (dataCenter.activeKey > 0) {
                dataCenter.activeKey -= 1
            } else {
                return
            }
            dataCenter.data = cloneDeep(dataCenter.stack[dataCenter.activeKey])
            
            // render(canvas, dataCenter)
        },
        
        redo() {
            if (dataCenter.activeKey < dataCenter.stack.length - 1) {
                dataCenter.activeKey += 1
            } else {
                return
            }
            dataCenter.data = cloneDeep(dataCenter.stack[dataCenter.activeKey])
            // render(canvas, dataCenter)
        }
    }

    return dataCenter
}