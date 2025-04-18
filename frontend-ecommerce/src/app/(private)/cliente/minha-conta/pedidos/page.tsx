import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { formatPrice, statusColorMap } from "@/lib/utils";

// Simulação de dados de pedidos
const orders = [
   {
      id: "1",
      date: "2023-05-15",
      total: 259.99,
      status: "Entregue",
      items: 3,
   },
   {
      id: "2",
      date: "2023-06-02",
      total: 124.5,
      status: "Em trânsito",
      items: 2,
   },
   {
      id: "3",
      date: "2023-06-10",
      total: 89.99,
      status: "Processando",
      items: 1,
   },
];

export default function OrdersPage() {
   return (
      <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-start px-20">
         <div className="w-full px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Meus Pedidos</h1>
            <Card className="w-full">
               <CardHeader>
                  <CardTitle>Histórico de Pedidos</CardTitle>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Nº do Pedido</TableHead>
                           <TableHead>Data</TableHead>
                           <TableHead>Total</TableHead>
                           <TableHead>Itens</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead>Ações</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {orders.map(order => (
                           <TableRow key={order.id}>
                              <TableCell>{order.id}</TableCell>
                              <TableCell>
                                 {new Date(order.date).toLocaleDateString(
                                    "pt-BR",
                                 )}
                              </TableCell>
                              <TableCell>{formatPrice(order.total)}</TableCell>
                              <TableCell>{order.items}</TableCell>
                              <TableCell>
                                 <Badge
                                    className={statusColorMap[order.status]}
                                 >
                                    {order.status}
                                 </Badge>
                              </TableCell>
                              <TableCell>
                                 <Button variant="outline" size="sm">
                                    <Eye className="mr-2" size={16} />
                                    Detalhes
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
