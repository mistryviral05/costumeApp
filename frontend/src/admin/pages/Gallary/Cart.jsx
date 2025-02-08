import React from 'react'
import GallaryNavbar from './GallaryNavbar'





const Item = ()=>(
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm light:border-gray-700 light:bg-gray-800 md:p-6">
    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <a href="#" className="shrink-0 md:order-1">
            <img className="h-20 w-20 light:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg" alt="imac image" />
            <img className="hidden h-20 w-20 light:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-light.svg" alt="imac image" />
        </a>

        <label htmlFor="counter-input" className="sr-only">Choose quantity:</label>
        <div className="flex items-center justify-between md:order-3 md:justify-end">
            <div className="flex items-center">
                <button type="button" id="decrement-button" data-input-counter-decrement="counter-input" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 light:border-gray-600 light:bg-gray-700 light:hover:bg-gray-600 light:focus:ring-gray-700">
                    <svg className="h-2.5 w-2.5 text-gray-900 light:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                </button>
                <input type="text" id="counter-input" data-input-counter className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 light:text-white" placeholder="" value="2" required />
                <button type="button" id="increment-button" data-input-counter-increment="counter-input" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 light:border-gray-600 light:bg-gray-700 light:hover:bg-gray-600 light:focus:ring-gray-700">
                    <svg className="h-2.5 w-2.5 text-gray-900 light:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                </button>
            </div>
            <div className="text-end md:order-4 md:w-32">
                <p className="text-base font-bold text-gray-900 light:text-white">$1,499</p>
            </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
            <a href="#" className="text-base font-medium text-gray-900 hover:underline light:text-white">PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, Keyboard layout INT</a>

            <div className="flex items-center gap-4">
                <button type="button" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline light:text-gray-400 light:hover:text-white">
                    <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                    </svg>
                    Add to Favorites
                </button>

                <button type="button" className="inline-flex items-center text-sm font-medium text-red-600 hover:underline light:text-red-500">
                    <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                    </svg>
                    Remove
                </button>
            </div>
        </div>
    </div>
</div>
);


const Cart = () => {
    return (
        <div>
            <GallaryNavbar />
            <section className="bg-white py-8 antialiased light:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl font-semibold text-gray-900 light:text-white sm:text-2xl"> Cart</h2>

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                            <div className="space-y-6">
                               <Item/>
                               <Item/>
                               <Item/>
                               <Item/>
                               <Item/>
                               
                            </div>

                        </div>

                        <div className="bg-gray-50 p-6 w-full rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Give to Another Person</h3>
                            <form  className="space-y-4 ">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
                                    <input
                                        type="text"
                                        // value={newRenter.name}
                                        // onChange={(e) => setNewRenter({ ...newRenter, name: e.target.value })}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Numbert</label>
                                    <input
                                        type="text"
                                        // value={newRenter.contact}
                                        // onChange={(e) => setNewRenter({ ...newRenter, contact: e.target.value })}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email address</label>
                                    <input
                                        type="text"
                                        // value={newRenter.contact}
                                        // onChange={(e) => setNewRenter({ ...newRenter, contact: e.target.value })}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Addresh</label>
                                    <input
                                        type="text"
                                        // value={newRenter.contact}
                                        // onChange={(e) => setNewRenter({ ...newRenter, contact: e.target.value })}
                                        required
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-950 transition">
                                    Give Other Person
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Cart
