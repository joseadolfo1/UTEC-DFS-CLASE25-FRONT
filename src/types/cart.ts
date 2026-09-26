export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}
