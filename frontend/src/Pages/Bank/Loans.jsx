import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box, Button } from "@mui/material";
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AppContext } from '../../components/Context/AppContext';
import { changeLoanStatus, deleteLoan } from '../../utils/FetchApi';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';

const StyledCard = styled(Card)(({ theme }) => ({
    margin: "10px 5%",
    padding: "5px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    height: 'auto', // Auto height to adjust based on content
}));

const StyledCardHeader = styled(CardHeader)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px', // Fixed height for the header
});

function getAvatarColor(name) {
    const colors = [red[500]];
    let index = name && (name.charCodeAt(0) % colors.length);
    return colors[index];
}

export const Loans = (props) => {
    const { data, dispatch } = React.useContext(AppContext);  // Assuming `data` is passed as a prop
    const [loanView, setLoanView] = React.useState("borrow");
    const [sortedLoansLent, setSortedLoansLent] = React.useState([]);
    const [srotedLoansBorrowed, setSortedLoansBorrowed] = React.useState([])
    const myName = JSON.parse(localStorage.getItem("user")).userName;

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

    const getLenderImage = (lenderId)=>{
        const lender = data.myFriends.find((friend) => friend._id === lenderId); // Use find instead of filter
    console.log("lender: ", lender);
    return lender ? lender.avatarImage : "";
    }

    const handleChangeLoanView = (loanType) => {
        setLoanView(loanType);
    };

    const handleDeleteLoan = async (loanId, lender, borrower) => {
        try {
            console.log(loanId, lender, borrower)
            const responseData = await deleteLoan(loanId, lender, borrower)
            if (responseData.success) {
                dispatch({ type: "deleteLoan", payload: loanId })
                toast.success(data.message, toastOptions);
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleEditLoan = (loanId) => {
        // Handle loan editing logic here
        console.log("Edit Loan:", loanId);
    };

    const handleDemoteRequest = async(loanId)=>{
        try {
            const responseData = await changeLoanStatus(loanId,true)
            if (responseData.success) {
                setTimeout(() => {
                    dispatch({ type: "updateLoanStatus", payload: loanId, demote:true })
                    toast.success(data.message, toastOptions);
                }, 200)

            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleMarkAsPaid = async (loanId) => {
        try {
            const responseData = await changeLoanStatus(loanId,false)
            if (responseData.success) {
                setTimeout(() => {
                    dispatch({ type: "updateLoanStatus", payload: loanId, demote:false })
                    toast.success(data.message, toastOptions);
                }, 200)

            }
        } catch (err) {
            console.log(err)
        }
    };

    React.useEffect(() => {
        const statusOrderForBorrow = { "pending": 0, "inApproval": 1, "paid": 2 };
        const sortedLoansForBorrow = [...data.loansBorrowed].sort((a, b) => statusOrderForBorrow[a.loanStatus] - statusOrderForBorrow[b.loanStatus]);
        setSortedLoansBorrowed(sortedLoansForBorrow);

        const statusOrderForLent = { "pending": 1, "inApproval": 0, "paid": 2 };
        const sortedLoansForLent = [...data.loansLent].sort((a, b) => statusOrderForLent[a.loanStatus] - statusOrderForLent[b.loanStatus]);
        setSortedLoansLent(sortedLoansForLent);


    }, [dispatch, data.loansLent, data.loansBorrowed]);

    return (
        <Box>
            <div className="d-flex justify-content-around w-100 align-items-center data-table">
                <Button
                    variant="text"
                    onClick={() => handleChangeLoanView("borrow")}
                    sx={{
                        textDecoration: loanView === "borrow" ? "underline" : "none",
                        fontSize: loanView === "borrow" ? "0.875rem" : "1rem",
                    }}
                >
                    Loan Borrowed
                </Button>
                <Button
                    variant="text"
                    onClick={() => handleChangeLoanView("lent")}
                    sx={{
                        textDecoration: loanView === "lent" ? "underline" : "none",
                        fontSize: loanView === "lent" ? "0.875rem" : "1rem",
                    }}
                >
                    Loan Lent
                </Button>
            </div>
            {data.loansLent && console.log("loaannndd ", sortedLoansLent)}
            {loanView === "lent" ? (
                sortedLoansLent && sortedLoansLent.length !== 0 ? (
                    sortedLoansLent.map((loan) => (
                        <StyledCard key={loan._id}>
                            <StyledCardHeader
                                avatar={
                                    <Avatar src={getLenderImage(loan.borrower)} sx={{ bgcolor: 'green'}}>
                                        
                                    </Avatar>
                                }
                                title={<Typography variant="h6" sx={{ fontSize: '1rem' }}>{loan.loanDescription}</Typography>}
                                subheader={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Amount: {loan.loanAmount}</Typography>}
                                action={
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        {/* {loan.loanStatus === "pending" &&
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => handleEditLoan(loan._id)}
                                                sx={{ color: 'black' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        } */}
                                        {loan.loanStatus !== "inApproval" &&
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => {
                                                    handleDeleteLoan(loan._id, loan.lender, loan.borrower)
                                                }}
                                                sx={{ color: 'red' }}
                                            >
                                                <DeleteForeverSharpIcon />
                                            </IconButton>
                                        }

                                        {loan.loanStatus === "pending" &&
                                            <IconButton
                                                aria-label="edit"
                                                sx={{ color: 'black' }}
                                            >
                                                <HourglassEmptyIcon />
                                            </IconButton>
                                        }

                                        {loan.loanStatus === "inApproval" &&
                                            <IconButton
                                                aria-label="Approve this request"
                                                sx={{ color: 'black' }}
                                                onClick={() => handleMarkAsPaid(loan._id)}
                                            >
                                                <ThumbUpIcon />
                                            </IconButton>}

                                            {loan.loanStatus === "inApproval" &&
                                            <IconButton
                                                aria-label="Reject this request"
                                                sx={{ color: 'black' }}
                                                onClick={() => handleDemoteRequest(loan._id)}
                                            >
                                                <ThumbDownIcon />
                                            </IconButton>}
                                        
                                    </Box>
                                }
                            />
                            <CardContent sx={{ padding: '8px' }}>
                                <Typography variant='body2' sx={{ fontSize: '0.875rem' }}>Lent to: {loan.borrowerName}</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Date: {new Date(loan.loanDate).toLocaleDateString()}</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Status: {loan.loanStatus}</Typography>
                            </CardContent>
                        </StyledCard>
                    ))
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography>No loans Lent</Typography>
                    </Box>
                )
            ) : (
                srotedLoansBorrowed && srotedLoansBorrowed.length !== 0 ? (
                    srotedLoansBorrowed.map((loan) => (
                        <StyledCard key={loan._id}>
                            <StyledCardHeader
                                avatar={
                                    <Avatar src={getLenderImage(loan.lender)} sx={{ bgcolor: getAvatarColor(myName) }}>
                                        
                                    </Avatar>
                                }
                                title={<Typography variant="h6" sx={{ fontSize: '1rem' }}>{loan.loanDescription}</Typography>}
                                subheader={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Amount: {loan.loanAmount}</Typography>}
                                action={
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        {/* {loan.loanStatus === "pending" &&
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => handleEditLoan(loan._id)}
                                                sx={{ color: 'black' }}
                                            >
                                                <EditIcon />
                                            </IconButton>} */}

                                        {loan.loanStatus !== "inApproval" &&


                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleDeleteLoan(loan._id, loan.lender, loan.borrower)}
                                                sx={{ color: 'red' }}
                                            >
                                                <DeleteForeverSharpIcon />
                                            </IconButton>
                                        }

                                        {loan.loanStatus === "pending" &&
                                            <IconButton
                                                aria-label="mark as paid"
                                                onClick={() => handleMarkAsPaid(loan._id)}
                                                sx={{ color: 'green' }}
                                            >
                                                <DomainVerificationIcon />
                                            </IconButton>}

                                        {loan.loanStatus === "inApproval" &&
                                            <IconButton
                                                aria-label="Waiting for approval"
                                                sx={{ color: 'green' }}
                                            >
                                                <PendingActionsIcon />
                                            </IconButton>}

                                        {loan.loanStatus === "paid" &&
                                            <IconButton
                                                aria-label="Paid already"
                                                sx={{ color: 'green' }}
                                            >
                                                <CheckCircleOutlineIcon />
                                            </IconButton>}



                                    </Box>
                                }
                            />
                            <CardContent sx={{ padding: '8px' }}>
                                <Typography variant='body2' sx={{ fontSize: '0.875rem' }}>Borrowed From: {loan.lenderName}</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Date: {new Date(loan.loanDate).toLocaleDateString()}</Typography>
                                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Status: {loan.loanStatus}</Typography>
                            </CardContent>
                        </StyledCard>
                    ))
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography>No loans Borrowed</Typography>
                    </Box>
                )
            )}
        </Box>
    );
};
