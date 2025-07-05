export interface Payment {
    id?: number,
    value: number,
    typeId: string,
    statusId: string,
    orderId: number,
}

export interface PaymentType {
    name: string,
    label: string,
    createdAt: string,
    updatedAt: string
}