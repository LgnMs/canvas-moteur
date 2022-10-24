export interface ITreeNode {
    name: string,
    icon?: string,
    active: boolean,
    isEdit: boolean,
    childrens: ITreeNode[],
    data: any
}
