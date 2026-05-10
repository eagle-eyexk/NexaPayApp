import React from "react";
import { useListTransactions, getListTransactionsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export default function Transactions() {
  const { data: transactions, isLoading } = useListTransactions({ limit: 20 }, { query: { queryKey: getListTransactionsQueryKey({ limit: 20 }) } });

  const truncateAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Settling": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Routing": return "text-primary bg-primary/10 border-primary/20";
      case "Failed": return "text-destructive bg-destructive/10 border-destructive/20";
      case "Disputed": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/40 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/40 hover:bg-transparent">
                  <TableHead className="w-[100px] text-xs uppercase tracking-wider">ID</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Route</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider">Trust</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wider">Latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="border-border/40">
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-2 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : transactions?.map((tx) => (
                  <TableRow key={tx.id} className="border-border/40 font-mono text-sm hover:bg-muted/20">
                    <TableCell className="text-muted-foreground">{tx.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{truncateAddress(tx.sourceAddress)}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">{truncateAddress(tx.destinationAddress)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {tx.currency}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-sans font-medium border ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full ${tx.trustScore > 90 ? 'bg-green-500' : tx.trustScore > 70 ? 'bg-yellow-500' : 'bg-destructive'}`}
                          style={{ width: `${tx.trustScore}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {tx.latencyMs}ms
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
