import cloneDeep from "lodash/cloneDeep"
import { CanvasMoteur } from "./index"
import { Edge } from "../type"

 type Data = {
    // 画布中已有的图形和线
    shapes: any[]
    edges: Edge[]
}

export interface DataCenter {
    activeKey: number
    /**
     * 数据栈-最大存储100条数据
     */
    stack: Data[]
    data: Data
    needRecode: boolean

    shouldRecode(): void
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

export function createDataCenter(canvasMoteur: CanvasMoteur) {
    const dataCenter: DataCenter = {
        activeKey: 0,
        stack: [],
        data: {
            shapes: [],
            edges: []
        },
        needRecode: false,

        shouldRecode() {
            dataCenter.needRecode = true
        },

        recordData() {
            if (!dataCenter.shouldRecode) {
                return
            }
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

            dataCenter.needRecode = false
        },

        // TODO: found bud Fix it
        undo() {
            if (dataCenter.activeKey > 0) {
                dataCenter.activeKey -= 1
            } else {
                return
            }
            dataCenter.data = cloneDeep(dataCenter.stack[dataCenter.activeKey])
            
            canvasMoteur.render()
        },
        
        redo() {
            if (dataCenter.activeKey < dataCenter.stack.length - 1) {
                dataCenter.activeKey += 1
            } else {
                return
            }
            dataCenter.data = cloneDeep(dataCenter.stack[dataCenter.activeKey])
            canvasMoteur.render()
        }
    }

    return dataCenter
}