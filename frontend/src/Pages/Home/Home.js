import React, { useEffect, useState } from "react";
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
import  {AddCategoryModal}  from "./AddCategoryModal";

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
  const [categories,setCategories] = useState(null);

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

  const fetchBanks = () => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setBanks(user.bankAccount)
    }
  }

  useEffect(() => {
    fetchBanks();
  }, [show, showAddBankModal, bankShow])

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

  const handleCategoryClose = () =>{
    setCategoryShow(false);
  }

  const handleAddNewCategory = ()=>{
    setAddCategoryShow(true);
  }

  const handleAddNewCategoryClose = ()=>{
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
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    const responseData = await getBankDetail(cUser.email);
    const user = {
      ...cUser,
      bankAccount: responseData.bankDetaile,
    }
    console.log("use : ------> ", user);
    localStorage.setItem("user", JSON.stringify(user))


    setLoading(false);
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
    setFilterApplied(false);
  };





  useEffect(() => {

    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        console.log(cUser._id, frequency, startDate, endDate, type);
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
        console.log("categorye : ",categories)

        setLoading(false);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, categoryShow, bankShow]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  return (
    <>
      <Header setBankShow={setBankShow} setCategoryShow={setCategoryShow} />

      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Container
            style={{ position: "relative", zIndex: "2 !important" }}
            className="mt-3"
          >
            <div className="filterRow">
              <div className="text-white">
                <Form.Group className="mb-3" controlId="formSelectFrequency">
                  <Form.Label>Select Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
                  >
                    <option value="7">Last Week</option>
                    <option value="30">Last Month</option>
                    <option value="365">Last Year</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* <Bu> */}
              {console.log(filterApplied)}
              {filterApplied ? (

                <div className="text-white">

                  <Button variant="primary" onClick={handleReset}>
                    Reset Filter
                  </Button>
                </div>
              ) : ""}


              <div className="text-white iconBtnBox">
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
              </div>

              <div>
                <div className="addButtons">
                  <Button onClick={handleAddIncome} className="addNew" variant="success">
                    Add Income
                  </Button>
                  <Button onClick={handleAddExpense} className="addNew" variant="danger">
                    Add Expense
                  </Button>
                </div>
                <Button onClick={handleShow} className="mobileBtn">
                  +
                </Button>
                <Button onClick={handleShow} className="mobileBtn">
                  -
                </Button>
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
                          value={selectedBank && banks[selectedBank]}
                          onChange={handleChange}
                        >
                          {
                            banks && banks.map((bank, index) => {
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
                          {console.log("categorye : ",categories)}
                          <option value="">{categories&& categories.length===0?"No categories found, please add":""}</option>
                        {categories?categories.map((category,index)=>{
                          {console.log(category.category)}
                          return (<option key={index} value={category.category}>{category.category}</option>)
                        }):""}
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
                  < Bank />

                </Modal>
                <AddBankModal showAddBankModal={showAddBankModal} handleAddNewBankAccountClose={handleAddNewBankAccountClose} />
              {console.log("category ----> ",categoryShow)}
              <Modal show = {categoryShow} onHide={handleCategoryClose} centered>
              
              <Modal.Header closeButton>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <Modal.Title>Category Details</Modal.Title>
                      <Button variant="success" onClick={handleAddNewCategory}>
                        Create New
                      </Button>
                    </div>
                  </Modal.Header>
                  <Category></Category>
                  <AddCategoryModal addCategoryShow={addCategoryShow}  handleAddNewCategory={handleAddNewCategoryClose} />
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
                <TableData data={transactions} user={cUser} />
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
