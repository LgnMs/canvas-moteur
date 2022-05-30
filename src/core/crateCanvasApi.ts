import { isFunction } from "../shared"

type PluginInstallFunction = (canvas: Canvas, ...options: any[]) => any

export type Plugin = {
    install: PluginInstallFunction
} | PluginInstallFunction
    
export interface Canvas {
    mount(el: string | HTMLElement): void
    unmount(): void
    use(plugin: Plugin, ...options: any[]): this
    addShapType(name: string, shap: any): this

    getCtx(): CanvasRenderingContext2D

    _el: HTMLCanvasElement
    _container: HTMLElement | null
    _context: CanvasContext
    _ctx: CanvasRenderingContext2D
}

export interface CanvasContext {
    canvas: Canvas
    // TODO: do it
    config: unknown
    shapTypes: { name: string, shap: any }[]
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
    if (canvas.getContext){
        return canvas.getContext('2d')!;
    } else {
        throw new Error('浏览器不支持canvas');
    }
}


export function createContext(): CanvasContext {
    return {
        canvas: null as any,
        config: {},
        shapTypes: [],
    }
}

export function createCanvasApi(opts: CanvasOptions): Canvas {

    const context = createContext()
    const el = initCanvas(opts)
    const installedPlugins = new Set()

    const canvas: Canvas = (context.canvas = {
        _el: el,
        _ctx: getCanvasContext(el),
        _container: null,
        _context: context,

        getCtx() {
            return canvas._ctx
        },

        mount(element?: string | HTMLElement) {
            let container: HTMLElement

            if (element === undefined) {
                if (!this._el.parentElement) {
                    throw new Error(`请指定 el 参数`)
                }
                container = this._el.parentElement
            } else if (typeof element === 'string') {
                const node = document.querySelector(element)

                if (node) {
                    container = node as HTMLElement
                } else {
                    throw new Error(`元素${element}未初始化`)
                }
            } else {
                container = element
            }

            if (element) {
                container?.appendChild(this._el)
            }

            this._container = container
        },

        unmount() {
            if (!this._container) {
                throw new Error(`canvas没有被挂载`)
            }
            this._container.removeChild(this._el)
        },

        addShapType(name, shap) {
            this._context.shapTypes.push({ name, shap })

            return canvas
        },

        use(plugin, ...options) {
            if (installedPlugins.has(plugin)) {
                throw new Error(`插件已经注册过了`)
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
