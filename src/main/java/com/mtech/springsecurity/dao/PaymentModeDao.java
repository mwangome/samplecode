/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.PaymentMode;

/**
 *
 * @author derek
 */
public interface PaymentModeDao {
    
    PaymentMode savePaymentMode(PaymentMode paymentMode);
    
    java.util.List<PaymentMode> getPaymentModesList();
    
    PaymentMode findPaymentMode(Long paymentMode);
    
     public PaymentMode findPaymentMode(String payModeName);
}
