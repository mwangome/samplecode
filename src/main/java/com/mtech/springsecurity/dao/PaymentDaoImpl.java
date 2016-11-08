/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.Payment;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class PaymentDaoImpl extends AbstractDao<Long, Payment> implements PaymentDao{

    Logger logger = Logger.getLogger(PaymentDaoImpl.class);
    
    @Autowired
    AccountsDao acDao;
    
    public Payment savePayment(Payment payment) {
        if(payment.getId() == null){
            persist(payment);
        }else{
            merge(payment);
        }
        return payment;
    }

    public List<Payment> getPaymentsList(SMEEntity entity ) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Payment p where p.smeEntity.id = :id");
        createQuery.setParameter("id", entity.getId());
        List list = createQuery.list();
        //session1.close();
        return list;
                
    }
    
    public List<Payment> getPaymentsListAccruals(SMEEntity entity ) {
        List<Accounts> accrualExpenseChildAccounts = acDao.getAccrualExpenseChildAccounts();
        java.util.ArrayList<Long> idList = new java.util.ArrayList();
        for(Accounts acc:accrualExpenseChildAccounts){
            idList.add(acc.getId());
        }
        java.util.Collection c;
        logger.warn("list::" + idList);
        List<Payment>  accrualsList = getSession().createQuery("from Payment p where "
                + " p.smeEntity.id = :entityId and p.accounts.id in (:ids)")
                .setParameterList("ids", (idList))
                .setParameter("entityId", entity.getId()).list();
        
        return accrualsList;
                
    }
    
    public List<Payment> getPaymentsListPrepayments(SMEEntity entity ) {
        List<Accounts> prepaidExpenseChildAccounts = acDao.getPrepaidExpenseChildAccounts();
        java.util.ArrayList<Long> idList = new java.util.ArrayList();
        for(Accounts acc:prepaidExpenseChildAccounts){
            idList.add(acc.getId());
        }
        java.util.Collection c;
        logger.warn("list::" + idList);
        List<Payment>  prepaidList = getSession().createQuery("from Payment p where "
                + " p.smeEntity.id = :entityId and p.accounts.id in (:ids)")
                .setParameterList("ids", (idList))
                .setParameter("entityId", entity.getId()).list();
        
        return prepaidList;
                
    }

    public Payment findPayment(Long id) {
        return getByKey(id);
    }
    
    public Payment findPayment(String invoiceRef){
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from Payment p where p.purchase.invoiceNumber = :invoiceRef");
        java.util.List<Payment> list = createQuery.setParameter("invoiceRef", invoiceRef).list();
        
        if(!list.isEmpty()){
         //   session1.close();
            return list.get(0);
        }
        //session1.close();
        return null;
    }
    
}
