import { computed, Injectable, signal, WritableSignal } from '@angular/core';

export interface CartState {
  cartItems: CartItem[];
  discount: number;
  subTotal: number;
  total: number;
  totalQuantity: number;
  quantityItems: number;
  shipment: number;
}

export interface CartItem {
  id: number;
  name: string;
  finalPrice: number;
  quantity: number;
  discountPercent: number;
  loading?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private state: WritableSignal<CartState> = signal({
    cartItems: [],
    discount: 0,
    subTotal: 0,
    total: 0,
    totalQuantity: 0,
    quantityItems: 0,
    shipment: 0,
  });

  public cartItems = computed(() => this.state().cartItems);
  public discount = computed(() => this.state().discount);
  public shipment = computed(() => this.state().shipment);
  public subTotal = computed(() => this.state().subTotal);
  public total = computed(() => this.state().total);
  public totalQuantity = computed(() => this.state().totalQuantity);
  public quantityItems = computed(() => this.state().quantityItems);

  constructor() {}

  public getCartData() {
    return this.state();
  }

  public setCartData(cartData: any) {
    this.state.set({
      ...cartData,
    });
  }

  public setCartItems(cartItems: CartItem[]) {
    this.state.update(state => ({
      ...state,
      cartItems,
    }));
    this.updateCartCalculations();
  }

  public addItem(item: CartItem) {
    const existingItem = this.state().cartItems.find(
      cartItem => cartItem.id === item.id
    );
    if (existingItem) {
      existingItem.quantity++;
      this.state.update(state => ({
        ...state,
        cartItems: state.cartItems.map(cartItem =>
          cartItem.id === item.id ? existingItem : cartItem
        ),
      }));
    } else {
      item.quantity = 1;
      this.state.update(state => ({
        ...state,
        cartItems: [...state.cartItems, { ...item }],
      }));
    }
    this.updateCartCalculations();
  }

  public removeItem(itemId: number | string) {
    this.state.update(state => ({
      ...state,
      cartItems: state.cartItems.filter(item => item.id !== itemId),
    }));
    this.updateCartCalculations();
  }

  public updateItemQuantity(
    itemId: number | string,
    quantity: number,
    isAdd: boolean
  ) {
    const cartItems = this.state().cartItems;
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    const item = cartItems[itemIndex];
    if (item) {
      if (isAdd) item.quantity += quantity;
      else item.quantity -= quantity;
      if (item.quantity <= 0) {
        cartItems.splice(itemIndex, 1);
      }
    }
    this.updateCartCalculations();
  }

  public setShipment(shipment: number) {
    this.state.update(state => ({
      ...state,
      shipment,
    }));
    this.updateTotalWithShipment();
  }

  private updateCartCalculations() {
    const cartItems = this.state().cartItems.map(item => ({
      ...item,
      discountPercent: item.discountPercent || 0,
      quantity: item.quantity || 0,
      finalPrice: item.finalPrice || 0,
    }));

    // Cálculo do subTotal
    const subTotal = cartItems
      .map(item => item.finalPrice * item.quantity)
      .reduce((total, itemSubtotal) => total + itemSubtotal, 0);

    // Cálculo do desconto
    const discount =
      cartItems
        .map(
          item =>
            ((item.finalPrice * item.discountPercent) / 100) * item.quantity
        )
        .reduce((total, itemDiscount) => total + itemDiscount, 0) || 0;

    // Cálculo do total
    const total =
      cartItems
        .map(item => {
          const itemSubtotal = item.finalPrice * item.quantity;
          const itemDiscount =
            ((item.finalPrice * item.discountPercent) / 100) * item.quantity;
          return itemSubtotal - itemDiscount;
        })
        .reduce((total, itemTotal) => total + itemTotal, 0) +
      this.state().shipment;

    // Cálculo da quantidade total
    const totalQuantity = cartItems
      .map(item => item.quantity)
      .reduce((total, quantity) => total + quantity, 0);

    // Quantidade de itens
    const quantityItems = cartItems.length;

    this.state.update(state => ({
      ...state,
      subTotal,
      discount,
      total,
      totalQuantity,
      quantityItems,
    }));
  }

  private updateTotalWithShipment() {
    this.state.update(state => ({
      ...state,
      total: state.subTotal - state.discount + state.shipment,
    }));
  }

  public resetCart() {
    this.state.update(state => ({
      ...state,
      cartItems: [],
      discount: 0,
      subTotal: 0,
      total: 0,
      totalQuantity: 0,
      quantityItems: 0,
    }));
  }
}
