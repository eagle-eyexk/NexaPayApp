import React from "react";
import { useListNodes, getListNodesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, Activity, Globe2 } from "lucide-react";

export default function Nodes() {
  const { data: nodes, isLoading } = useListNodes({ query: { queryKey: getListNodesQueryKey() } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Global Node Network</h2>
          <p className="text-muted-foreground">Real-time status of Helix Protocol routing and validator nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border-border/50 bg-card">
              <CardHeader className="pb-2"><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))
        ) : nodes?.map((node) => (
          <Card key={node.id} className="border-border/50 bg-card hover:border-primary/30 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-mono flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                {node.id.substring(0, 12)}
              </CardTitle>
              <div className={`h-2 w-2 rounded-full ${node.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-destructive'}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Globe2 className="h-3 w-3" /> Region</span>
                  <span className="font-medium">{node.region}</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Load</span>
                    <span className="font-mono">{node.currentLoad}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${node.currentLoad > 80 ? 'bg-destructive' : node.currentLoad > 50 ? 'bg-yellow-500' : 'bg-primary'}`} 
                      style={{ width: `${node.currentLoad}%` }} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Health</span>
                    <span className="font-mono">{node.health}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${node.health < 80 ? 'bg-destructive' : 'bg-green-500'}`} 
                      style={{ width: `${node.health}%` }} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
