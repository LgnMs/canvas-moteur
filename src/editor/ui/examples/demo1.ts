import { loadPorject } from "editor/common/loadProject";
import { renderPage } from "editor/common/renderPage";

export async function render() {
    const data = await (() => import('../../../../demo/project1/.cm.json'))()
    const project = await loadPorject(data)
    renderPage(document.querySelector("#example1")!, project.getAllPages()[0])
}