/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.SMEEntity;

/**
 *
 * @author derek
 */
public interface AccountTransactionsDao {
    
    AccountTransactions saveAccountTransactions(AccountTransactions accountTransactions);
    
    java.util.List<AccountTransactions> getAccountTransactionsList(SMEEntity entity);
    
    java.util.List<AccountTransactions> findAccountTransactions(SMEEntity entity, String transRef);  
    
    java.util.List<AccountTransactions> findAccountTransactionsByAccount(SMEEntity entity, Long accountId);   
    
}
