import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addBankAccount, deleteBankAccount } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";

const Banks = ({banks}) => {
    return (
        <>
        <div className="banks">
            {banks && banks.length === 0 ? "" :
                 (<div>
                     {banks && banks.map((bank,index)=>{
                        return <Button className="bankNames md-5" variant="secondary">{bank.bankName} : {bank.accountBalance}</Button>
                    })}
                </div>)}

        </div>

        
        </>

       
    )
}

export default Banks;