import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { addBankAccount, deleteBankAccount } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import AnimatedSection from "../../utils/AnimatedSection";

const Banks = ({banks}) => {
    return (
        <>
        <Container>
          <Row className="banks">
            {banks && banks.length === 0 ? (
              ""
            ) : (
              banks && banks.map((bank, index) => {
                return (
                  <AnimatedSection key={index} transitionType="animate__bounceInDown">
                    <Col xs={4} md={1}>
                    <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{`Balance: ₹ ${bank.accountBalance}`}</Tooltip>}
                >
                      <Button className="mb-3 same-size-button bank-button" variant="dark">{bank.bankName}</Button>
                      </OverlayTrigger>
                    </Col>
                  </AnimatedSection>
                );
              })
            )}
          </Row>
        </Container>
      </>
      


       
    )
}

export default Banks;