import React, { createContext, useReducer } from 'react';

export const appState = {
    banks:null,
    categories:null,
    loading:false,
    addCategoryModal : false,
    addBankModal : false,
    transactionModalVisibility : false,
    editValues:null,
    reload:false,
    fullAppRefresh :false,
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

        case "deleteCategory" : {
            let categories = state.categories;
            categories.splice( categories.findIndex((category)=>category.category===action.payload),1)
            return{
                ...state,
                categories:categories,
            }
        }

        case "addCategory" :{
            let categories = state.categories;
            categories.push({category : action.payload})
            return{
                ...state,
                categories:categories,
            }
        }



        case "loading" : return {...state,loading:action.payload};

        case "addCategoryModal" : return {...state,addCategoryModal:action.payload};

        case "addBankModal" : return {...state,addBankModal:action.payload};

        case "transactionModalVisibility" :return {...state,transactionModalVisibility:action.payload}

        case "editDetails" : return{...state,editValues:action.payload }

        case "reload" : return{...state, reload:!state.reload}

        case "fullAppRefresh" : return {...state, fullAppRefresh:!state.fullAppRefresh}

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