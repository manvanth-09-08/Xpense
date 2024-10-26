import React, { useState } from "react";
import { Button, Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import AnimatedSection from "../../utils/AnimatedSection";


const Banks = ({ banks }) => {
   
    const [visibleBanks, setVisibleBanks] = useState(window.innerWidth < 768 ? 3 : 12); // Set initial visible banks based on screen width

    const handleShowMore = () => {

         setVisibleBanks((prev) => {
            if (prev >= banks.length) {
                return window.innerWidth < 768 ? 3 : 12;
            } else {
                return Math.min(prev + (window.innerWidth < 768 ? 3 : 12), banks.length);
            }
        });
        
    };

    let isExpanded
    if(banks)
     isExpanded = visibleBanks >= banks.length;
    // Effect to handle window resize
    
    return (
        <>
            <Container>
            
                <Row className="banks">
                    {banks && banks.length === 0 ? (
                        <p>No banks available</p>
                    ) : (
                       banks && banks.slice(0, visibleBanks).map((bank, index) => (
                            
                                <Col xs={4} md={1}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>{`Balance: ₹${bank.accountBalance}`}</Tooltip>}
                                    >
                                        {/* <AnimatedSection key={index} transitionType="animate__fadeIn"> */}
                                        <Button className="mb-3 same-size-button bank-button" variant="dark">
                                            {bank.bankName}
                                        </Button>
                                        {/* </AnimatedSection> */}
                                    </OverlayTrigger>
                                </Col>
                           
                        ))
                    )}
                </Row>
                {banks && banks.length >= visibleBanks && ( // Show "Show More" button if there are more banks
                //    <AnimatedSection transitionType="animate__fadeIn">
                    <Row className="justify-content-center">
                    
                    <Button onClick={handleShowMore} className="mt-3 no-bg bankNames" variant="dark">
                                    {isExpanded ? "Show Less" : "Show More"}{" "}
                                    <i className={isExpanded ? "fas fa-chevron-up" : "fas fa-chevron-down"} />
                        </Button>
                    </Row>
                    // </AnimatedSection>
                )}
               
            </Container>
        </>
    );
};

export default Banks;
