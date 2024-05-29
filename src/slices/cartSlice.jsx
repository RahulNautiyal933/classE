import { createSlice } from "@reduxjs/toolkit";
import toast, { Toaster } from "react-hot-toast";

const initialState={
    cart:localStorage.getItem("cart")
    ?JSON.parse(localStorage.getItem("cart"))
    :[],

    total: localStorage.getItem("total")
    ? JSON.parse(localStorage.getItem("total"))
    : 0,
  totalItems: localStorage.getItem("totalItems")
    ? JSON.parse(localStorage.getItem("totalItems"))
    : 0,
}


const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            const course=action.payload
            const index=state.cart.findIndex((item)=>item.id==course.id)

            // if course already present in cart return error
            if(index>=0){
                toast.error("Course already in cart")
                return
            }
            
            // if not present add course to cart
            state.cart.push(course)
            // update the total items and the total of the cart
            state.totalItems++;
            state.total+=course.price;

            // update to local storage
            localStorage.setItem("cart",JSON.stringify(state.cart));
            localStorage.setItem("totalItens",JSON.stringify(state.totalItems));
            localStorage.setItem("total",JSON.stringify(state.total));

            toast.success("Course added to cart");
        },
        
        removeFromCart:(state,action)=>{
        },

        resetCart:(state)=>{
            state.cart=[]
            state.totalItems=0
            state.total=0

            // update the localstorage
            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
        },
    },
})

export const{addToCart,removeFromCart,resetCart}=cartSlice.actions
export default cartSlice.reducer