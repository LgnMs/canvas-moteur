import { componentTag, componentType, createComponent } from "../common"
import { HTMLComponent, IHTMLComponentOptions } from "./htmlComponent";

export class Grid extends HTMLComponent {
    constructor(options: IHTMLComponentOptions) {
        super({
            ...options,
            type: componentType.Grid,
            tag: componentTag.HTML
        });

        
        this.style = {
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '',
            gridAutoRows: '',
            gridTemplateAreas: '',
            gridArea: '',
            ...options.style
        };
    }

    public static new = createComponent<IHTMLComponentOptions, Grid>(Grid);
}

export const createGrid = Grid.new;