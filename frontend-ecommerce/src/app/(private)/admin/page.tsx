import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "@/components/layout/admin/metrics-card";
import { StatsChart } from "@/components/layout/admin/stats-chart";
import { VaultTable } from "@/components/layout/admin/vault-table";
import { ChevronDown } from "lucide-react";

export default function AdminPage() {
   // 13 de Ago, 2023 - 18 de Ago, 2023
   let todayDate = new Date();
   let today = todayDate.getDate();
   let month = todayDate.getMonth();
   let year = todayDate.getFullYear();
   let startDate = new Date(year, month, today);
   let startDateString = startDate.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });

   return (
      <>
         <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
               <h1 className="text-2xl font-bold">Visão Geral</h1>
               <div className="text-sm text-muted-foreground">
                  {startDateString}
               </div>
            </div>
            <Button variant="outline" className="gap-2">
               Rede Ethereum
               <ChevronDown className="h-4 w-4" />
            </Button>
         </div>
         <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
               title="Seu Saldo"
               value="R$ 74.892"
               change={{
                  value: "R$ 1.340",
                  percentage: "-2.1%",
                  isPositive: false,
               }}
            />
            <MetricsCard
               title="Seus Depósitos"
               value="R$ 54.892"
               change={{
                  value: "R$ 1.340",
                  percentage: "+13.2%",
                  isPositive: true,
               }}
            />
            <MetricsCard
               title="Rendimento Acumulado"
               value="R$ 20.892"
               change={{
                  value: "R$ 1.340",
                  percentage: "+1.2%",
                  isPositive: true,
               }}
            />
         </div>
         <Card className="mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
               <h2 className="text-lg font-semibold">Estatísticas Gerais</h2>
               <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                     Hoje
                  </Button>
                  <Button size="sm" variant="ghost">
                     Última semana
                  </Button>
                  <Button size="sm" variant="ghost">
                     Último mês
                  </Button>
                  <Button size="sm" variant="ghost">
                     Últimos 6 meses
                  </Button>
                  <Button size="sm" variant="ghost">
                     Ano
                  </Button>
               </div>
            </div>
            <StatsChart />
         </Card>
         <div className="mt-6">
            <VaultTable />
         </div>
      </>
   );
}
