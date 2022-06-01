import { isFunction } from "../shared"
import { warn } from "../warning"

type PluginInstallFunction = (canvas: Canvas, ...options: any[]) => any

export type Plugin = {
    install: PluginInstallFunction
} | PluginInstallFunction

export interface Canvas {
    mount(el: string | HTMLElement): void
    unmount(): void
    use(plugin: Plugin, ...options: any[]): this
    addShapType(name: string, shap: any): this

    /**
     * 获取canvas context
     */
    getCtx(): CanvasRenderingContext2D

    shapTypes: { name: string, shap: any }[]

    el: HTMLCanvasElement
    width: number
    height: number
    _container: HTMLElement | null
    _context: CanvasContext
    _ctx: CanvasRenderingContext2D
}

export interface CanvasContext {
    canvas: Canvas
}

interface InitCanvasOptions {
    el: string | HTMLCanvasElement
    width?: number;
    height?: number;
}

export interface CanvasOptions extends InitCanvasOptions {}

function initCanvas(opts: InitCanvasOptions) {
    let canvas = null

    if (typeof opts.el === 'string') {
        canvas = document.querySelector(opts.el) as HTMLCanvasElement
    } else {
        canvas = opts.el
    }

    if (opts.width) {
        canvas.width = opts.width
    }
    if (opts.height) {
        canvas.height = opts.height
    }

    return canvas
}

function getCanvasContext(canvas: HTMLCanvasElement) {
    if (!canvas.getContext){
        throw new Error('浏览器不支持canvas')
    }
    return canvas.getContext('2d')!
}


export function createContext(): CanvasContext {
    return {
        canvas: null as any
    }
}

export function createCanvasApi(opts: CanvasOptions): Canvas {
    const context = createContext()
    const el = initCanvas(opts)
    const installedPlugins = new Set()

    const canvas: Canvas = (context.canvas = {
        el,
        width: opts.width || 500,
        height: opts.height || 500,
        _ctx: getCanvasContext(el),
        _container: null,
        _context: context,

        shapTypes: [],

        getCtx() {
            return canvas._ctx
        },

        mount(element?: string | HTMLElement) {
            let container: HTMLElement

            if (element === undefined) {
                if (!canvas.el.parentElement) {
                    warn(`请指定 el 参数`)
                    return
                }
                container = canvas.el.parentElement
            } else if (typeof element === 'string') {
                const node = document.querySelector(element)

                if (node) {
                    container = node as HTMLElement
                } else {
                    warn(`元素${element}未初始化`)
                    return
                }
            } else {
                container = element
            }

            if (element) {
                container?.appendChild(canvas.el)
            }

            this._container = container
        },

        unmount() {
            if (!canvas._container) {
                warn(`canvas没有被挂载`)
                return
            }
            canvas._container.removeChild(canvas.el)
        },

        addShapType(name, shap) {
            canvas.shapTypes.push({ name, shap })

            return canvas
        },

        use(plugin, ...options) {
            if (installedPlugins.has(plugin)) {
                warn(`插件已经注册过了`)
            } else if (isFunction(plugin)) {
                installedPlugins.add(plugin)
                plugin(canvas, ...options)
            } else if (isFunction(plugin.install)) {
                installedPlugins.add(plugin.install)
                plugin.install(canvas, ...options)
            }
            return canvas
        }
    })

    return canvas
}
