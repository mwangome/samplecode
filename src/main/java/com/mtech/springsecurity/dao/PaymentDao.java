/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Payment;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;

/**
 *
 * @author derek
 */
public interface PaymentDao {
    Payment savePayment(Payment payment);
    
    java.util.List<Payment> getPaymentsList(SMEEntity entity );
    
    Payment findPayment(Long id);
    
    public Payment findPayment(String invoiceRef);
    
    public List<Payment> getPaymentsListAccruals(SMEEntity entity );
    
    public List<Payment> getPaymentsListPrepayments(SMEEntity entity );
}
