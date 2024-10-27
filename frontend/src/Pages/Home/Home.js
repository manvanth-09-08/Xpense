import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
// import loading from "../../assets/loader.gif";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";
import Banks from "./Banks";
import { getBankDetail } from "../../utils/FetchApi";
import { Bank } from "../Bank/Bank";
import { AddBankModal } from "./AddBankModal";
import { Category } from "../Bank/Category";
import { AddCategoryModal } from "./AddCategoryModal";
import AnimatedSection from "../../utils/AnimatedSection";
import { AppContext } from "../../components/Context/AppContext";

const Home = () => {
  const navigate = useNavigate();

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

  const {data,dispatch} = useContext(AppContext);

  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [typeOfTransaction, setTypeOfTransaction] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false)
  const [banks, setBanks] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null)
  const [bankShow, setBankShow] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [categoryShow, setCategoryShow] = useState(false);
  const [addCategoryShow, setAddCategoryShow] = useState(false);
  const [categories, setCategories] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

 

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleBankClose = () => setBankShow(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddExpense = () => {
    setTypeOfTransaction("Expense")
    handleShow();
  }

  const handleAddIncome = () => {
    setTypeOfTransaction("Credit")
    handleShow();
  }


  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

   //to give the padding below if its mobile
  useEffect(() => {
      const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize); 

    return () => window.removeEventListener("resize", handleResize); 
  }, []);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    transactionType: "",
    selectedBank: 0,
  });

  const handleAddNewBankAccount = () => {
    setShowAddBankModal(true);
  }

  const handleAddNewBankAccountClose = () => {
    setRefresh(true);
    setShowAddBankModal(false)
  }

  const handleCategoryClose = () => {
    setCategoryShow(false);
  }

  const handleAddNewCategory = () => {
    setAddCategoryShow(true);
  }

  const handleAddNewCategoryClose = () => {
    setAddCategoryShow(false);
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(e.target.value, values)
  };

  const handleResetButtonVisibility = () => {
    if (type === "all" && frequency === "7")
      setFilterApplied(true)
    else
      setFilterApplied(false)
  }
  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
    handleResetButtonVisibility()
  };

  const handleSetType = (e) => {
    setType(e.target.value);
    handleResetButtonVisibility()
  };

  const setBankAndCategories = async () => {
    const responseData = await getBankDetail(cUser.email);
    dispatch({type:"banks", payload:responseData.bankDetaile})
    dispatch({type:"categories", payload:responseData.categories})
    
    // fetchBanks();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, category, date, selectedBank } =
      values;

    if (
      !title ||
      !amount ||
      !category ||
      !date ||
      !selectedBank
    ) {
      toast.error("Please enter all the fields", toastOptions);
    }
    setLoading(true);
    try {
      const { data } = await axios.post(addTransaction, {
        title: title,
        amount: amount,
        category: category,
        date: date,
        transactionType: typeOfTransaction,
        userId: cUser._id,
        index: selectedBank,
      });

      if (data.success === true) {
        toast.success(data.message, toastOptions);
        handleClose();
        fetchAllTransactions();
        setRefresh(!refresh);
      }





      // setLoading(false);

    } catch (err) {


      console.log(err)
      setLoading(false);
      toast.error(err.response.data.message, toastOptions);

    }


  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
    setFilterApplied(false);
  };

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      console.log(cUser._id, frequency, startDate, endDate, type);
      await setBankAndCategories();
      const { data } = await axios.post(getTransactions, {
        userId: cUser._id,
        frequency: frequency,
        startDate: startDate,
        endDate: endDate,
        type: type,
      });
      console.log(data);

      setTransactions(data.transactions);
      // let category = ;
      // category = category.categories
      
      setCategories(JSON.parse(localStorage.getItem("user")).categories);
      dispatch({type:"categories" , payload:categories})
      console.log("categorye : ", categories)
      setLoading(false);
    } catch (err) {
      // toast.error("Error please Try again...", toastOptions);
      setLoading(false);
    }
  };



  useEffect(() => {



    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  return (
    <>
      <Header view={view} setBankShow={setBankShow} setCategoryShow={setCategoryShow} handleAddIncome={handleAddIncome} handleAddExpense={handleAddExpense} handleTableClick={handleTableClick} handleChartClick={handleChartClick} />

      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
        {console.log("category , bank",data.banks,data.categories)}
          <Container 
            style={{ position: "relative", zIndex: "2 !important",paddingBottom:isMobile ? "25%" : "0", }}
            className="mt-3"
          >
            <div className="filterRow">
             


              {/* <div className="text-white iconBtnBox">
                <FormatListBulletedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleTableClick}
                  className={`${view === "table" ? "iconActive" : "iconDeactive"
                    }`}
                />
                <BarChartIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleChartClick}
                  className={`${view === "chart" ? "iconActive" : "iconDeactive"
                    }`}
                />
              </div> */}

              <div>
                {/* <div className="addButtons">
                  <AnimatedSection transitionType="animate__slideInLeft">
                  <Button onClick={handleAddIncome} className="addNew" variant="success">
                    Add Income
                  </Button>
                  </AnimatedSection>
                  <AnimatedSection transitionType="animate__slideInRight">
                  <Button onClick={handleAddExpense} className="addNew" variant="danger">
                    Add Expense
                  </Button>
                  </AnimatedSection>
                </div> */}
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Transaction Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          placeholder="Enter Transaction Name"
                          value={values.name}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder="Enter your Amount"
                          value={values.amount}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formSelect">
                        <Form.Label>Bank</Form.Label>
                        <Form.Select
                          name="selectedBank"
                          value={selectedBank && data.banks[selectedBank]}
                          onChange={handleChange}
                        >
                          {
                            data.banks && data.banks.map((bank, index) => {
                              return <option value={index}>{bank.bankName}</option>
                            })
                          }
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formSelect">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                        >
                          {console.log("categorye : ", categories)}
                          <option value="">{categories && categories.length === 0 ? "No categories found, please add" : ""}</option>
                          {categories ? categories.map((category, index) => {
                            { console.log(category.category) }
                            return (<option key={index} value={category.category}>{category.category}</option>)
                          }) : ""}
                        </Form.Select>
                      </Form.Group>



                      <Form.Group className="mb-3" controlId="formSelect1">
                        <Form.Label>Transaction Type : </Form.Label>
                        {/* <Form.Select
                          name="transactionType"
                          value={values.transactionType}
                          onChange={handleChange}
                        >
                          <option value="">Choose...</option>
                          <option value="credit">Credit</option>
                          <option value="expense">Expense</option>
                        </Form.Select> */}
                        <Form.Label> {typeOfTransaction}</Form.Label>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={values.date}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal show={bankShow} onHide={handleBankClose} centered>
                  <Modal.Header closeButton>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <Modal.Title>Bank Details</Modal.Title>
                      <Button variant="success" onClick={handleAddNewBankAccount}>
                        Create New
                      </Button>
                    </div>
                  </Modal.Header>
                  < Bank handleAddNewBankAccount={handleAddNewBankAccount}  refresh={refresh} setRefresh={setRefresh}/>

                </Modal>
                <AddBankModal showAddBankModal={showAddBankModal} handleAddNewBankAccountClose={handleAddNewBankAccountClose} />
                {console.log("category ----> ", categoryShow)}
                <Modal show={categoryShow} onHide={handleCategoryClose} centered>

                  <Modal.Header closeButton>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <Modal.Title className="">Category Details</Modal.Title>
                      <Button variant="success"  onClick={handleAddNewCategory}>
                        Create New
                      </Button>
                    </div>
                  </Modal.Header>
                  <Category refresh={refresh} setRefresh={setRefresh}></Category>
                  <AddCategoryModal addCategoryShow={addCategoryShow} handleAddNewCategory={handleAddNewCategoryClose} />
                </Modal>
              </div>
            </div>
            <br style={{ color: "white" }}></br>

            {frequency === "custom" ? (
              <>
                <div className="date">
                  <div className="form-group">
                    <label htmlFor="startDate" className="text-white">
                      Start Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="text-white">
                      End Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}






            {view === "table" ? (
              <>
                {console.log("hehehe")}
                <Banks banks={banks}></Banks>
                <TableData data={transactions} user={cUser} banks={banks} />
              </>
            ) : (
              <>
                <Analytics transactions={transactions} user={cUser} />
              </>
            )}
            <ToastContainer />
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
