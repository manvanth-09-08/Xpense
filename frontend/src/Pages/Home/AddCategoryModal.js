import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addBankAccount, addCategory, deleteBankAccount } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";


export const AddCategoryModal = ({addCategoryShow,handleAddNewCategory})=>{

    const [categories, setCategories] = useState(null);
    const [show,setShow] = useState(false);
    const [email,setEmail] = useState(null)

    const [category,setCategory] = useState("");

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



    const resetCategory = ()=>{
        setCategory("");
        setIndex(null);
    }

    const handleCategoryNameChange = (e)=>{
        setCategory(e.target.value)
    }





    const handleSubmit= async()=>{
        try{
            const responseData = await addCategory(email,category)
            if(responseData.success){
                const user = JSON.parse(localStorage.getItem("user"));
                let categories = user.categories;
                categories.push( {category})
                const userAux = {...user, categories : categories}
                localStorage.setItem("user",JSON.stringify(userAux));
                
                resetCategory();                
                handleAddNewCategory();
                fetchCategories();
                toast.success(responseData.message, toastOptions);
            }else{
                toast.error(responseData.message, toastOptions);
                console.log("hehehehehe")
            }
            
        }catch(err){
            console.log(err)
        }
    }

    const fetchCategories = ()=>{
        if(localStorage.getItem("user")){
        const user = JSON.parse(localStorage.getItem("user"));
        setCategories(user.categories)
        setEmail(user.email)
        }
    }

    useEffect(() => {
        fetchCategories();        
    }, [index])

    return (
        <Modal show={addCategoryShow} onHide={handleAddNewCategory} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Category Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          placeholder="Enter Category Name"
                          value={category}
                          onChange={handleCategoryNameChange}
                        />
                      </Form.Group>


                      

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddNewCategory}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
    )
}