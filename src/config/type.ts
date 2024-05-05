export type Product = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  options?: { title: string; additionalPrice: number }[];
};

export type Products = Product[];

export type MenuType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
}[];


export type OrderType = {
  id: string;
  userEmail: string;
  price: number;
  products: CartItemType[];
  status: string;
  createdAt: Date;
  intent_id?: string;
}

export type CartItemType = {
  id: string;
  title: string;
  image?: string;
  price: number;
  optionTitle?: string;
  quantity: number
}