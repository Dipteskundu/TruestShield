"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Unlock,
} from "lucide-react";

interface Block {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  reason: string;
  blockedAt: string;
  expiresAt: string | null;
  resolvedAt: string | null;
  resolvedByName: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [liftingId, setLiftingId] = useState<string | null>(null);

  const fetchBlocks = (page: number) => {
    setLoading(true);
    api
      .get("/api/admin/chatbot/blocks", { params: { page, limit: 20 } })
      .then(({ data }) => {
        setBlocks(data.data.blocks);
        setPagination(data.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlocks(1);
  }, []);

  const handleLiftBlock = async (blockId: string) => {
    setLiftingId(blockId);
    try {
      await api.post(`/api/admin/chatbot/blocks/${blockId}/lift`);
      setBlocks((prev) =>
        prev.map((b) =>
          b._id === blockId
            ? { ...b, resolvedAt: new Date().toISOString() }
            : b
        )
      );
    } catch {
      // Ignore
    } finally {
      setLiftingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive">
          <ShieldAlert className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blocked Users</h1>
          <p className="text-sm text-muted-foreground">
            Users restricted from using the AI Assistant
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShieldAlert className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No blocked users</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Reason
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Blocked At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Expires
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((block) => (
                    <tr
                      key={block._id}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{block.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {block.userEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {block.reason}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground">
                          {new Date(block.blockedAt).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground">
                          {block.expiresAt
                            ? new Date(block.expiresAt).toLocaleString()
                            : "Permanent"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {block.resolvedAt ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!block.resolvedAt && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={liftingId === block._id}
                            onClick={() => handleLiftBlock(block._id)}
                            className="gap-1.5"
                          >
                            {liftingId === block._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Unlock className="h-3.5 w-3.5" />
                            )}
                            Lift
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
                total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchBlocks(pagination.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchBlocks(pagination.page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
