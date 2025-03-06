import React, {  useState } from 'react';
import Form from '../../../admin/components/cart/Form';
import Item from '../../../admin/components/cart/Item'


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