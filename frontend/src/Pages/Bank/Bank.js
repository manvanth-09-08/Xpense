import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteBankAccount } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";

export const Bank =()=>{
    const [banks,setBanks] = useState(null);
    const [email,setEmail] = useState(null)

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

    const handleDeleteBank = async(bankName,bankBalance,index)=>{
        try{
            console.log(email,bankName,bankBalance,index)
            const responseData = await deleteBankAccount(email,bankName,bankBalance,index)
            if(responseData.success){
                const user = JSON.parse(localStorage.getItem("user"));
                let bankAccount = user.bankAccount;
                bankAccount.splice( index,1)
                const userAux = {...user, bankAccount : bankAccount}
                localStorage.setItem("user",JSON.stringify(userAux));
                setBanks(bankAccount);
                toast.success(responseData.message, toastOptions);
            }else{
                toast.error(responseData.message, toastOptions);
            }
        }catch(err){
            
            console.log(err)
        }
    }

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user.bankAccount)
        setBanks(user.bankAccount);
        setEmail(user.email);
    },[localStorage.getItem("user")])

    return(
        <Container >
            <Table responsive="md" className="data-table">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Balance</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {console.log(banks)}
                    {banks && banks.map((bank,index)=> { 
                        return (<tr key={index}>
                            <td>{bank.bankName}</td>
                            <td>{bank.accountBalance}</td>
                            <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                    //   key={item._id}
                    //   id={item._id}
                    //   onClick={() => handleEditClick(item._id)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                    //   id={item._id}
                      onClick={() => handleDeleteBank(bank.bankName,bank.accountBalance,index)}
                    />
                    </div>
                    </td>
                        </tr>)
                    })}
                </tbody>
            </Table>
        </Container>
    )
}