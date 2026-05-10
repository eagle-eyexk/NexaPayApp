import React from "react";
import { useGetNetworkStats, useGetTransactionSummary, useGetActivityFeed, getGetNetworkStatsQueryKey, getGetTransactionSummaryQueryKey, getGetActivityFeedQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, ArrowUpRight, BarChart3, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetNetworkStats({ query: { queryKey: getGetNetworkStatsQueryKey() } });
  const { data: summary, isLoading: summaryLoading } = useGetTransactionSummary({ query: { queryKey: getGetTransactionSummaryQueryKey() } });
  const { data: feed, isLoading: feedLoading } = useGetActivityFeed({ limit: 5 }, { query: { queryKey: getGetActivityFeedQueryKey({ limit: 5 }) } });

  const formatMoney = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold font-mono">{formatMoney(stats.totalVolume)}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold font-mono">{stats.totalTransactions.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Settlement</CardTitle>
            <Clock className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            {statsLoading || !stats ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold font-mono">{stats.avgSettlementMs}ms</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {summaryLoading || !summary ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold font-mono">{(summary.successRate * 100).toFixed(1)}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-1 border-border/50 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Network Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {feed?.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                    <div className={`mt-0.5 rounded-full p-1.5 ${
                      event.severity === 'error' ? 'bg-destructive/20 text-destructive' :
                      event.severity === 'warning' ? 'bg-orange-500/20 text-orange-500' :
                      event.severity === 'success' ? 'bg-green-500/20 text-green-500' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {event.severity === 'error' ? <AlertTriangle className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Summary breakdown */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading || !summary ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-mono">{summary.completedCount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${(summary.completedCount / summary.totalCount) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Pending / Routing</span>
                    <span className="font-mono">{summary.pendingCount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(summary.pendingCount / summary.totalCount) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Failed / Disputed</span>
                    <span className="font-mono">{summary.failedCount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-destructive" style={{ width: `${(summary.failedCount / summary.totalCount) * 100}%` }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
