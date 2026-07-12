export interface TreeNode {
  _id: string;
  documentId: string;
  nodeId: string;
  parentId: string | null;
  title: string;
  summary: string;
  level: number;
  pageStart: number;
  pageEnd: number;
  path: string;
  crossRefs: string[];
  isLeaf: boolean;
  children?: TreeNode[];
}

export interface TreeData {
  tree: TreeNode[];
  flat: TreeNode[];
  nodeCount: number;
  leafCount: number;
}
