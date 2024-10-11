import axios from "axios";
import { loginAPI, addNewBankAccount, deleteExistingAccount,getBankDetails } from "./ApiRequest";

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

