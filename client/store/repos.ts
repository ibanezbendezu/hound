import {create} from 'zustand'
import {persist} from "zustand/middleware";

type State = {
    cart: Array<any>,
    product: any,
}

type Actions = {
    setProduct: (params: { newProduct: any }) => void,
    addItemToCart: (params: { newItem: any }) => void,
    removeItemFromCart: (params: { itemIndex: number }) => void,
    emptyCart: () => void
}

const useCart = create(persist<State & Actions>(
    (set) => ({
        cart: [],
        product: {},
        openModal: false,
        setProduct: (params) => {
            const {newProduct} = params
            set((state) => {
                return {
                    ...state,
                    product: newProduct
                }
            })

        },
        addItemToCart: (params) => {
            const {newItem} = params
            set((state) => {
                const newCart = [...state.cart, newItem]
                return {
                    ...state,
                    cart: newCart
                }
            })
        },
        removeItemFromCart: (params) => {
            const {itemIndex} = params
            set((state) => {
                const newCart = state.cart.filter((element, elementIndex) => {
                    return elementIndex !== itemIndex
                })
                return {
                    ...state,
                    cart: newCart
                }
            })
        },
        emptyCart: () => {
            set((state) => {
                const newCart: never[] = []
                return {
                    ...state,
                    cart: newCart
                }
            })
        }
    }), {
        name: 'cart'
    }
));

export default useCart;
