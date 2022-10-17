import { render } from "../examples/demo1";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div>canvas UI</div>

    <div>
      临时测试
      <div id="example1" style="border: 1px solid red; width: 500px; height: 500px"></div>
    </div>
  </div>
`

render();

