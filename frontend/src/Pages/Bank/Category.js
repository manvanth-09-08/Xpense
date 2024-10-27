import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCategory } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import { AddCategoryModal } from "../Home/AddCategoryModal";
import { AppContext } from "../../components/Context/AppContext";

export const Category =(props)=>{
    const {data,dispatch} = useContext(AppContext)
    const [categories,setCategories] = useState(null);
    const [email,setEmail] = useState(null)
    const [addCategoryShow, setAddCategoryShow] = useState(false);
    const [category,setCategory] =useState(null)

    const handleAddNewCategory = (category) => {
        dispatch({type:"editDetails", payload:{edit:true,category}})
        dispatch({type:"addCategoryModal" , payload:true})
      }
    


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
                dispatch({type:"deleteCategory" , payload:category});
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
        setEmail(user.email);
    },[dispatch,data.reload])

    return(
        <Container  >
            <Table  className="data-table">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {data.categories && data.categories.map((category,index)=> { 
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
                    onClick={()=>handleAddNewCategory(category)}
                    />
                    {console.log("---> cat : ",category)}
                    
                   

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
            {data.addCategoryModal &&
            <AddCategoryModal />
       }
        </Container>
        
    )
}