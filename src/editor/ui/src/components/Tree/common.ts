export interface ITreeNode {
    name: string,
    icon?: string,
    active: boolean,
    childrens: ITreeNode[],
    data: any
}
