'use client'
import { Product, ProductOptions } from '@/config/type'
import { useCartStore } from '@/utils/store'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'

const ProductPrice = ({ product }: { product: Product }) => {
  const { addToCart } = useCartStore()


  const [selectedOptions, setSelectedOptions] = useState<number>(0)
  const [productPrice, setProductPrice] = useState(product.price)
  const [quantity, setQuantity] = useState<number>(1)
  const [isAdded, setIsAdded] = useState<boolean>(false);


  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      price: product.price,
      quantity: quantity,
      title: product.title,
      image: product.img,
      ...(product.options?.length && { optionTitle: product.options[selectedOptions].type })
    })
    setIsAdded(true)
    toast.success("Berhasil menambahkan ke keranjang!")
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAdded(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isAdded]);



  useEffect(() => {
    setProductPrice(product.options?.length
      ?
      +product.options[selectedOptions].additionalPrice + +product.price
      :
      product.price)

    return () => { }
  }, [quantity, productPrice, product.price, selectedOptions])

  return (
    <div className="right flex flex-col flex-1 w-full">
      <h1 className="text-4xl font-semibold">{product.title}</h1>
      <p>{product.desc}</p>
      <h3 className="font-semibold text-xl">{productPrice}</h3>
      <div className="flex flex-row gap-5">
        {product?.options?.map((item: ProductOptions, idx: number) => (
          <div key={item.type} className="p-2 ">
            <Button onClick={() => setSelectedOptions(idx)} className="font-semibold bg-amber-900 capitalize" disabled={selectedOptions === idx}>
              {item.type}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-1 justify-between gap-5 items-center">
        <div className="flex flex-row w-full justify-between items-center">
          <span>Quantity</span>
          <div className="flex flex-row gap-5 items-center">
            <Button onClick={() => setQuantity((prev) => prev <= 1 ? prev : prev - 1)}>-</Button>
            <span>{quantity}</span>
            <Button onClick={() => setQuantity((prev) => prev + 1)}>+</Button>
          </div>
        </div>

        <Button onClick={handleAddToCart} disabled={isAdded}>
          {isAdded ? "Ditambahkan ke keranjang!" : "Tambahkan ke keranjang"}
        </Button>
      </div>
    </div >
  )
}

export default ProductPrice