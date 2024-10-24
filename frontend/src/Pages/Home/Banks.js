import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { addBankAccount, deleteBankAccount } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import AnimatedSection from "../../utils/AnimatedSection";

const Banks = ({banks}) => {
    return (
        <>
        <Container >
        <div className="banks">
            {banks && banks.length === 0 ? "" :
                 (<div>
                     {banks && banks.map((bank,index)=>{
                        return (
                        <AnimatedSection transitionType="animate__bounceInDown">
                        <Button className="bankNames md-5" variant="secondary">{bank.bankName} : {bank.accountBalance}</Button>
                        </AnimatedSection>
                        )
                    })}
                </div>)}

        </div>

        </Container>
        </>

       
    )
}

export default Banks;