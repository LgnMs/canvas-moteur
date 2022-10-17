import { demo1 } from "../examples/demo1";

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div>
    <div>canvas UI</div>
    <div>
        临时测试
        <div id="example1" style="border: 1px solid red; width: 500px; height: 500px"></div>
    </div>
  </div>
`

demo1(app);

