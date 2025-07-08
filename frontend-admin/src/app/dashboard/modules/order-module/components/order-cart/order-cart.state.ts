import {
  computed,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { OrderService } from '../../order.service';
import { lastValueFrom } from 'rxjs';
import { BaseState } from 'app/shared/store/base.state';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';

export interface ICartState {
  cartItems: CartItem[];
  discount: number;
  subTotal: number;
  total: number;
  totalQuantity: number;
  quantityItems: number;
  shipment: number;
  paymentMethods: any[]; // Alterando para múltiplos métodos de pagamento
  deliveryType: any; // Adicionando deliveryType ao estado
  client: any; // Adicionando client ao estado
  loading: boolean; // Adicionando loading para satisfazer BaseModuleState
  error: any; // Adicionando error para satisfazer BaseModuleState
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
export class CartState extends BaseState<ICartState> {
  private orderService = inject(OrderService);

  protected state: WritableSignal<ICartState> = signal({
    cartItems: [],
    discount: 0,
    subTotal: 0,
    total: 0,
    totalQuantity: 0,
    quantityItems: 0,
    shipment: 0,
    paymentMethods: [], // Alterando para múltiplos métodos de pagamento
    deliveryType: 'retirada', // Adicionando deliveryType ao estado inicial
    client: null, // Adicionando client ao estado inicial
    loading: false, // Inicializando loading
    error: null, // Inicializando error
    finishing: false, // Adicionando finishing ao estado inicial
  });

  public cartItems = computed(() => this.state().cartItems);
  public discount = computed(() => this.state().discount);
  public shipment = computed(() => this.state().shipment);
  public subTotal = computed(() => this.state().subTotal);
  public total = computed(() => this.state().total);
  public totalQuantity = computed(() => this.state().totalQuantity);
  public quantityItems = computed(() => this.state().quantityItems);
  public paymentMethods = computed(() => this.state().paymentMethods);
  public deliveryType = computed(() => this.state().deliveryType);
  public client = computed(() => this.state().client);

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

  public setDeliveryType(deliveryType: any) {
    this.state.update(state => ({
      ...state,
      deliveryType,
    }));
  }

  public clearDeliveryType() {
    this.state.update(state => ({
      ...state,
      deliveryType: null,
    }));
  }

  public addPaymentMethod(paymentMethod: any) {
    this.state.update(state => {
      // Verifica se o método já existe
      const existingIndex = state.paymentMethods.findIndex(
        pm => pm.id === paymentMethod.id
      );

      if (existingIndex === -1) {
        // Se não existe, adiciona com valor inicial
        const paymentMethodWithValue = {
          ...paymentMethod,
          value: paymentMethod.value || 0,
        };
        return {
          ...state,
          paymentMethods: [...state.paymentMethods, paymentMethodWithValue],
        };
      } else {
        // Se já existe, remove
        return {
          ...state,
          paymentMethods: state.paymentMethods.filter(
            pm => pm.id !== paymentMethod.id
          ),
        };
      }
    });
  }

  public updatePaymentMethodValue(paymentMethodId: string, value: number) {
    this.state.update(state => ({
      ...state,
      paymentMethods: state.paymentMethods.map(pm =>
        pm.id === paymentMethodId ? { ...pm, value } : pm
      ),
    }));
  }

  public removePaymentMethod(paymentMethodId: string) {
    this.state.update(state => ({
      ...state,
      paymentMethods: state.paymentMethods.filter(
        pm => pm.id !== paymentMethodId
      ),
    }));
  }

  public clearPaymentMethods() {
    this.state.update(state => ({
      ...state,
      paymentMethods: [],
    }));
  }

  getRemainingAmount(): number {
    const total = this.state().total;
    const paidAmount = this.state().paymentMethods.reduce(
      (sum, pm) => sum + (pm.value || 0),
      0
    );
    return Math.max(0, total - paidAmount);
  }

  public isPaymentMethodSelected(paymentMethodId: string): boolean {
    return this.state().paymentMethods.some(pm => pm.id === paymentMethodId);
  }

  public setClient(client: any) {
    this.updateState('client', client);
  }

  public clearClient() {
    this.updateState('client', null);
  }

  async checkout(data: any): Promise<ApiResponse> {
    this.setLoading(true);
    return await lastValueFrom(this.orderService.createOrder(data))
      .then((response: any) => {
        this.resetCart();
        this.setLoading(false);
        return response;
      })
      .catch((error: any) => {
        this.setError(error);
        this.setLoading(false);
        throw error; // Re-throw the error to handle it in the component
      })
      .finally(() => this.setLoading(false));
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
