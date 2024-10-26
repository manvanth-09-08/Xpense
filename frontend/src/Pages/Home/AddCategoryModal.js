import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addBankAccount, addCategory, deleteBankAccount, updateCategory } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";



export const AddCategoryModal = (props)=>{

    const [categories, setCategories] = useState(null);
    const [show,setShow] = useState(false);
    const [email,setEmail] = useState(null)

    const [category,setCategory] = useState(props.update?props.category.category :"");

    const [index,setIndex] = useState(null);
    const [nameAlreadyExistsError, setNameAlreadyExistsError] = useState(false)
    const [previousCategoryName,setpreviousCategoryName] = useState(props.update?props.category.category :"")
    
    
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
      const enteredCategoryName = e.target.value.trim().toLowerCase(); // Trim and normalize case for comparison

    // Check if the bank name already exists
    const categoryExists = categories && categories.some((category) => category.category.toLowerCase() === enteredCategoryName);

    if (categoryExists) {
      setNameAlreadyExistsError(true);  // Set error state if the name already exists
    } else {
      setNameAlreadyExistsError(false); // Clear error state if name is unique
    }

    setCategory(e.target.value.trim()); 

    }


    const handleUpdate = async()=>{
      const updatedCategory = category;
      try{
        const responseData = await updateCategory(email,category, previousCategoryName)
            if(responseData.success){
                const user = JSON.parse(localStorage.getItem("user"));
                let categories = user.categories;
                categories = categories.map((category)=>{
                  if(category.category === previousCategoryName)
                      category.category = updatedCategory;
                  return category;
              })
                const userAux = {...user, categories : categories}
                localStorage.setItem("user",JSON.stringify(userAux));
                
                resetCategory();                
                props.handleAddNewCategory();
                fetchCategories();
                toast.success(responseData.message, toastOptions);
                props.setRefresh(! props.refresh)
            }else{
              toast.error(responseData.message, toastOptions);
            }
    }catch(err){
      console.log(err)
    }
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
                props.handleAddNewCategory();
                fetchCategories();
                toast.success(responseData.message, toastOptions);
            }else{
                toast.error(responseData.message, toastOptions);
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
    }, [localStorage.getItem("user")])

    return (
        <Modal show={props.addCategoryShow} onHide={props.handleAddNewCategory} centered>
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
                        {nameAlreadyExistsError && (
              <p style={{ color: 'red' }}>Category already exists!</p>
            )}
                      </Form.Group>


                      

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleAddNewCategory}>
                      Close
                    </Button>
                    {props.update?<Button variant="primary" onClick={handleUpdate} disabled={nameAlreadyExistsError}>
                      Update
                    </Button>:
                    <Button variant="primary" onClick={handleSubmit} disabled={nameAlreadyExistsError}>
                    Submit
                  </Button>}
                    {/* <Button variant="primary" onClick={handleSubmit} disabled={nameAlreadyExistsError}>
                      Submit
                    </Button> */}
                  </Modal.Footer>
                </Modal>
    )
}