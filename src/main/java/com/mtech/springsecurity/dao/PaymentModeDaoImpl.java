/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.PaymentMode;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository

public class PaymentModeDaoImpl extends AbstractDao<Long, PaymentMode> implements PaymentModeDao{

    public PaymentMode savePaymentMode(PaymentMode paymentMode) {
        if(paymentMode.getId() == null){
            persist(paymentMode);
        }else{
            merge(paymentMode);
        }
        return paymentMode;
    }

    public List<PaymentMode> getPaymentModesList() {
        return getList();
    }

    public PaymentMode findPaymentMode(Long paymentMode) {
        PaymentMode byKey = getByKey(paymentMode);
        return byKey;
    }
    
    public PaymentMode findPaymentMode(String payModeName) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from PaymentMode mode where mode.payModeName = :payModeName");
        createQuery.setParameter("payModeName", payModeName);
        java.util.List<PaymentMode> list = createQuery.list();
        if(list.isEmpty()) {
    //        session1.close();
            return null;
        }else{
   //         session1.close();
            return list.get(0);
        } 
    }
    
}
