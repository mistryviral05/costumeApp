import React, { useState } from 'react';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import Form from '../../../admin/components/cart/Form';
import Item from '../../../admin/components/cart/Item'


// Mock data - replace with actual cart data in your implementation
const mockCartItems = [
    {
        id: 1,
        name: "Traditional Wedding Costume",
        size: "M",
        price: 89.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1594387972779-8d9871e5e178?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        name: "Modern Festival Attire",
        size: "L",
        price: 65.50,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=60"
    }
];

const CartPage = () => {
    const [cartId, setCartId] = useState(null)

    return (
        <div className=" ">
            <section className="bg-white py-8 antialiased light:bg-gray-900 md:py-10">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                            <div className="space-y-2">
                                <Item setCartId={setCartId} />
                            </div>

                        </div>
                        {/* form */}
                        < Form cartId={cartId} />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default CartPage;