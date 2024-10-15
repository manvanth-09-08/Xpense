import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCategory } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";

export const Category =()=>{
    const [categories,setCategories] = useState(null);
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

    const handleDeleteCategory = async(category,index)=>{
        try{
            console.log(email,category,index)
            const responseData = await deleteCategory(email,category,index)
            if(responseData.success){
                const user = JSON.parse(localStorage.getItem("user"));
                let categories = user.categories;
                categories.splice( index,1)
                const userAux = {...user, categories : categories}
                localStorage.setItem("user",JSON.stringify(userAux));
                setCategories(categories);
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
        console.log(user.categories)
        setCategories(user.categories);
        setEmail(user.email);
    },[localStorage.getItem("user")])

    return(
        <Container fluid>
            <Table responsive="md" className="data-table">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {categories && categories.map((category,index)=> { 
                        return (<tr key={index}>
                            <td>{category.category}</td>
                            {/* <td>{bank.accountBalance}</td> */}
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
                      onClick={() => handleDeleteCategory(category.category,index)}
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