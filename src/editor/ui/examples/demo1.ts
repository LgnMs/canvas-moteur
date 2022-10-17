import { loadPorject } from "editor/common/loadProject";
import { renderPage } from "editor/common/renderPage";

export async function demo1(container: HTMLDivElement) {
    const project = await loadPorject('/Users/liguang/Desktop/workSpace/MyProject/canvas-moteur/demo/project1/');

    renderPage(container, project.getAllPages()[0])
}