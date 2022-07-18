export type ProductPayment = {
  name: string;
  price: number;
  productBy: string;
};

export type ProductStripe = {
  product: ProductPayment;
  token: {
    id: string;
    email: string | null;
  };
};
