import axios from "axios";
import { loginAPI, addNewBankAccount, deleteExistingAccount,getBankDetails, deleteExistingCategory, addNewCategory, updateExistingCategory } from "./ApiRequest";
import { Category } from "../Pages/Bank/Category";

export const logIn = async(email,password)=>{
    try{
        const { data } = await axios.post(loginAPI, {
            email,
            password,
          });
      
          console.log(data)
          return data;
    }catch(err){
        console.log("errors : ",err)
        return err.response.data
    }
}

export const addBankAccount = async(email, bankName,accountBalance)=>{
    try{
        const {data} = await axios.post(addNewBankAccount,{
            email, bankName,accountBalance
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

export const deleteBankAccount = async(email,bankName,accountBalance,index)=>{
    try{
        const {data} = await axios.post(deleteExistingAccount,{
            email, bankName,accountBalance, index
        });
        return data;
    }catch(err){
        console.log(err);
        return err.response.data
    }
}

export const getBankDetail = async(email)=>{
    try{
        const {data} = await axios.post(getBankDetails,{
            email
        })
        return data;
    }catch(err){
        console.log(err);
        return err.response.data
    }
}

export const deleteCategory= async(email,category,index)=>{
    try{
        const {data} = await axios.post(deleteExistingCategory,{
            email, category, index
        });
        return data;
    }catch(err){
        console.log(err);
        return err.response.data
    }
}

export const addCategory = async(email, category)=>{
    try{
        const {data} = await axios.post(addNewCategory,{
            email, category
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

export const updateCategory = async(email, category, previousCategoryName) =>{
    try{
        const {data} = await axios.post(updateExistingCategory,{
            email, categoryName:category,previousCategoryName
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

