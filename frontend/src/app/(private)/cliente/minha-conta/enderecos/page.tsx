import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";
import { Plus, Edit, Trash2 } from "lucide-react";

interface AddressResponse {
   data: Address[];
}

interface Address {
   id: number;
   name: string;
   street: string;
   city: string;
   state: string;
   zipCode: string;
}

const addresses = [
   {
      id: 1,
      name: "Casa",
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
   },
   {
      id: 2,
      name: "Trabalho",
      street: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "04567-890",
   },
];

export default async function AddressesPage() {
   let enderecos: Address[] = [];
   try {
      enderecos = await api
         .get("http://localhost:3001/enderecos")
         .then((res: AddressResponse) => res.data)
         .catch(() => {
            return [];
         });
   } catch (err) {
      enderecos = addresses;
   }

   return (
      <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-start px-20">
         <div className="w-full px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Meus Pedidos</h1>
            <Button>
               <Plus className="mr-2" size={16} />
               Adicionar Endereço
            </Button>
         </div>
         <div className="grid w-full grid-cols-1 gap-4 px-4 md:grid-cols-3">
            {enderecos.map(address => (
               <Card key={address.id}>
                  <CardHeader>
                     <CardTitle>{address.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>{address.street}</p>
                     <p>
                        {address.city}, {address.state}
                     </p>
                     <p>{address.zipCode}</p>
                     <div className="mt-4 flex space-x-2">
                        <Button variant="outline" size="sm">
                           <Edit className="mr-2" size={16} />
                           Editar
                        </Button>
                        <Button variant="outline" size="sm">
                           <Trash2 className="mr-2" size={16} />
                           Excluir
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}
