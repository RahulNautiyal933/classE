import { createSlice } from "@reduxjs/toolkit";


//these are all the variables
const initialState={
    signupData:null,
    loading:false,
    token:localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,
};


//these are the functions for changing the values of the variables
const authSlice=createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setSignupData(state,value){
            state.signupData=value.payload;
        },
        setLoading(state,value){
            state.loading=value.payload;
        },
        setToken(state,value){
            state.token=value.payload;
        },
    },
})

export const{ setSignupData,setLoading,setToken}=authSlice.actions;
export default authSlice.reducer;