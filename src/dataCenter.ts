import cloneDeep from "lodash/cloneDeep";
import { Draw, Edge, ShapTypeMap } from "./core";

type Data = {
    shaps: ShapTypeMap[]
    edges: Edge[]
}
export class DataCenter {
    activeKey: number
    /**
     * 数据栈-最大存储100条数据
     */
    stack: Data[]
    data!: Data
    draw: Draw

    constructor(draw: Draw) {
        this.draw = draw;
        this.activeKey = 0
        this.data = {
            shaps: [...draw.shaps],
            edges: [...draw.edges]
        }
        this.stack = [this.data]

        this.draw.onRendered((shouldRecodeData: boolean) => {
            if (shouldRecodeData) {
                this.recordData()
            }
        })
    }

    static install(draw: Draw) {
        return new DataCenter(draw)
    }

    /**
     * 添加、删除、移动完毕执行此操作
     */
    recordData() {
        const { draw } = this

        if (this.activeKey < this.stack.length - 1) {
            this.stack.splice(this.activeKey + 1)
            this.activeKey += 1
        } else if (this.stack.length === 100) {
            this.stack.pop()
            this.activeKey = 99
        } else {
            this.activeKey = this.stack.length
        }

        const data = {
            shaps: cloneDeep(draw.shaps),
            edges: cloneDeep(draw.edges)
        }
        this.data = data

        this.stack.push(data)
        console.log(this.activeKey, this)
    }

    /**
     * 撤销
     */
    undo() {
        if (this.activeKey > 0) {
            this.activeKey -= 1
        } else {
            return
        }
        this.data = cloneDeep(this.stack[this.activeKey])
        this.draw.shaps = cloneDeep(this.data.shaps)
        this.draw.edges = cloneDeep(this.data.edges)
        this.draw.render(false)

        console.log(this.activeKey, this)
    }

    /**
     * 重做
     */
    redo() {
        if (this.activeKey < this.stack.length - 1) {
            this.activeKey += 1
        } else {
            return
        }
        this.data = cloneDeep(this.stack[this.activeKey])
        this.draw.shaps = cloneDeep(this.data.shaps)
        this.draw.edges = cloneDeep(this.data.edges)
        this.draw.render(false)
    }
}