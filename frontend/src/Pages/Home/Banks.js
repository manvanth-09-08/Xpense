import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addBankAccount, deleteBankAccount } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";

const Banks = () => {
    const [banks, setBanks] = useState(null);
    const [show,setShow] = useState(false);
    const [email,setEmail] = useState(null)

    const [bankName,setBankName] = useState("");
    const [bankBalance,setBankBalance] = useState(0);

    const [index,setIndex] = useState(null);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      };

    const resetBankDetails = ()=>{
        setBankName("");
        setBankBalance(0);
        setIndex(null);
    }

    const handleBankNameChange = (e)=>{
        setBankName(e.target.value)
    }

    const handleBankBalanceChange = (e)=>{
        setBankBalance(e.target.value)
    }

    const handleAddBankBtnOpen = ()=>{
        resetBankDetails();
        setShow(true)
    }

    const handleAddBankBtnClose = ()=>{
        setShow(false)
    }

    const handleDeleteBank = async()=>{
        try{
            console.log(email,bankName,bankBalance,index)
            const responseData = await deleteBankAccount(email,bankName,bankBalance,index)
            if(responseData.success){
                const user = JSON.parse(localStorage.getItem("user"));
                let bankAccount = user.bankAccount;
                bankAccount.splice( index,1)
                const userAux = {...user, bankAccount : bankAccount}
                localStorage.setItem("user",JSON.stringify(userAux));
                resetBankDetails();
                toast.success(responseData.message, toastOptions);
            }else{
                toast.error(responseData.message, toastOptions);
            }
        }catch(err){
            
            console.log(err)
        }
    }

    const handleBankAccountClick = (bankName,accountBalance,index)=>{
        console.log(index)
        setBankName(bankName);
        setBankBalance(accountBalance);
        setIndex(index)
    }

    const handleSubmit= async()=>{
        try{
            const responseData = await addBankAccount(email,bankName,bankBalance)
            if(responseData.success){
                const user = JSON.parse(localStorage.getItem("user"));
                let bankAccount = user.bankAccount;
                bankAccount.push( {bankName: bankName, accountBalance: bankBalance})
                const userAux = {...user, bankAccount : bankAccount}
                localStorage.setItem("user",JSON.stringify(userAux));
                
                resetBankDetails();                
                handleAddBankBtnClose();
                fetchBanks();
                toast.success(responseData.message, toastOptions);
            }else{
                toast.error(responseData.message, toastOptions);
                console.log("hehehehehe")
            }
            
        }catch(err){
            console.log(err)
        }
    }

    const fetchBanks = ()=>{
        if(localStorage.getItem("user")){
        const user = JSON.parse(localStorage.getItem("user"));
        setBanks(user.bankAccount)
        setEmail(user.email)
        }
    }

    useEffect(() => {
            fetchBanks();        
    }, [index])

    return (
        <>
        <div className="banks">
            {banks && banks.length === 0 ? "" :
                 (<div>
                     {banks && banks.map((bank,index)=>{
                        return <Button className="bankNames md-5" variant="secondary" onClick={()=>handleBankAccountClick(bank.bankName,bank.accountBalance,index)}>{bank.bankName} : {bank.accountBalance}</Button>
                    })}
                </div>)}
            <div className="bankContainerBtn">
                <Button variant="primary" onClick={handleAddBankBtnOpen}>
                    Add Bank
                </Button>
            </div>
            <div className="bankContainerBtn">
                <Button variant="primary" onClick={handleDeleteBank}>
                    Delete Bank
                </Button>
            </div>
        </div>

        <Modal show={show} onHide={handleAddBankBtnClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Bank Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Bank Name</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          placeholder="Enter Bank Name"
                          value={bankName}
                          onChange={handleBankNameChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Current Balance</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder="Enter your current balance"
                          value={bankBalance}
                          onChange={handleBankBalanceChange}
                        />
                      </Form.Group>

                      

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddBankBtnClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
        </>

       
    )
}

export default Banks;