/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.BankTransaction;
import com.mtech.springsecurity.model.FinancialTransaction;
import com.mtech.springsecurity.model.MobileTransaction;

/**
 *
 * @author mwangome
 */
public interface FinancialTransactionsDao {
    MobileTransaction saveMobileTransaction(MobileTransaction mt);
    
    BankTransaction saveBankTransaction(BankTransaction bt);
    
    java.util.List<FinancialTransaction> getFinancialTransaction();
    
    public BankTransaction findBankTransaction(Long id);
    
    public FinancialTransaction findTransaction(Long id);
}
