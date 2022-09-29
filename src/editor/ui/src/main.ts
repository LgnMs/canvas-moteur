import { renderHtml } from "../examples/renderer"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div>canvas UI</div>

    <div>
      临时测试
      <div id="example1"></div>
    </div>
  </div>
`

renderHtml(document.querySelector("#example1")!);