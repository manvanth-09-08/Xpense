import React, { createContext, useReducer } from 'react';

export const appState = {
    banks:null,
    categories:null,
    loading:false,
    addCategoryModal : false,
    addBankModal : false,
    reload:false,
}

export const appReducer = (state,action)=>{
    switch(action.type){
        case "banks":return {...state,banks:action.payload};

        case "deleteBankAccount" : {
            let bankAccount = state.banks;
            bankAccount.splice( bankAccount.findIndex((bank)=>bank.bankName===action.payload),1)
            return{
                ...state,
                banks:bankAccount,
            }
        }
        
        case "addBankAccount":{
            let bankAccount = state.banks;
            bankAccount.push({ bankName: action.payload.bankName, accountBalance: action.payload.bankBalance })
            return{
                ...state,
                banks:bankAccount,
            }
        }
            


        case "categories" : return {...state,categories:action.payload};

        case "loading" : return {...state,loading:action.payload};

        case "addCategoryModal" : return {...state,addCategoryModal:action.payload};

        case "addBankModal" : return {...state,addBankModal:action.payload};

        case "reload" : return{...state, reload:!state.reload}

    }
}

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [data, dispatch] = useReducer(appReducer, appState);

    return (
        <AppContext.Provider value={{ data, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};