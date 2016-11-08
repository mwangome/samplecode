/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class AccountTransactionsImpl extends AbstractDao<Long, AccountTransactions> implements AccountTransactionsDao{

    public AccountTransactions saveAccountTransactions(AccountTransactions accountTransactions) {
        if(accountTransactions.getId() == null){
            persist(accountTransactions);
        }else{
            merge(accountTransactions);
        }        
        return accountTransactions;
    }

    public List<AccountTransactions> getAccountTransactionsList(SMEEntity entity) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from AccountTransactions at where at.smeEntity.id=:id");
        List<AccountTransactions> list = createQuery
                .setParameter("id", entity.getId()).list();
        return list;
    }

    public java.util.List<AccountTransactions> findAccountTransactions(SMEEntity entity, String transRef) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from AccountTransactions at where at.transRef = :transRef and at.smeEntity.id=:id");
        List<AccountTransactions> list = createQuery
                .setParameter("transRef", transRef)
                .setParameter("id", entity.getId()).list();  
        return list;
    }

    public List<AccountTransactions> findAccountTransactionsByAccount(SMEEntity entity, Long accountId) {
        Session session1 = getSession();
        Query createQuery = session1.createQuery("from AccountTransactions at where at.account.id = :accountId and at.smeEntity.id=:id");
        List<AccountTransactions> list = createQuery
                .setParameter("id", entity.getId())
                .setParameter("accountId", accountId).list();  
        return list;
    }
    
}
