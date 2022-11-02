export interface ITreeNode {
    name: string,
    icon?: string,
    active: boolean,
    parent: ITreeNode | null,
    childrens: ITreeNode[],
    data: any
}
