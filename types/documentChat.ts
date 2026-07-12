export interface DocumentChatMessage {
  _id: string;
  sessionId: string;
  documentId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  citedNodeIds: string[];
  citedNodes: CitedNode[];
  navigationReasoning: string | null;
  confidence: "high" | "medium" | "low";
  nodesFound: boolean;
  createdAt: string;
}

export interface CitedNode {
  nodeId: string;
  title: string;
  pageStart: number;
  pageEnd: number;
  path: string;
}

export interface DocumentChatSession {
  _id: string;
  documentId: string;
  userId: string;
  title: string;
  messageCount: number;
  lastMessageAt: string;
  lastMessagePreview: string;
  createdAt: string;
}

export interface DocumentChatResponse {
  success: boolean;
  sessionId: string;
  answer: string;
  citedNodes: CitedNode[];
  confidence: "high" | "medium" | "low";
  nodesFound: boolean;
}
