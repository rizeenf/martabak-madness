'use client'
import { Product } from '@/config/type'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/utils/store'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const CartItem = ({ product }: { product: Product }) => {
  const { img } = product
  const { removeFromCart } = useCartStore()


  console.log(img)
  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {img ? (
              <Image
                src={img}
                alt={product.title}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.title}
            </span>
            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {product.desc}
            </span>
            <div className="mt-2 text-xs text-muted-foreground">
              <button
                onClick={() => removeFromCart({
                  id: product.id,
                  price: product.price,
                  quantity: 1,
                  title: product.title,
                  image: product.img,
                })}
                className="flex items-center gap-1 group"
              >
                <X className="w-3 h-3 flex-shrink-0 group-hover:opacity-80" />
                <span className="group-hover:opacity-80">Remove</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartItem