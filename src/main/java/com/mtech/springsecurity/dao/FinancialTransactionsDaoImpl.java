/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.BankTransaction;
import com.mtech.springsecurity.model.FinancialTransaction;
import com.mtech.springsecurity.model.MobileTransaction;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author mwangome
 */
@Repository
public class FinancialTransactionsDaoImpl extends AbstractDao<Long, FinancialTransaction > implements FinancialTransactionsDao{

    public MobileTransaction saveMobileTransaction(MobileTransaction mt) {
        if(mt.getId() == null){
            persist(mt);
        }else{
            merge(mt);
        }
        return mt;
    }

    public BankTransaction saveBankTransaction(BankTransaction bt) {
        if(bt.getId() == null){
            persist(bt);
        }else{
            merge(bt);
        }
        return bt;
    }

    public List<FinancialTransaction> getFinancialTransaction() {
        return getList();
    }
    
    public BankTransaction findBankTransaction(Long id){
        return (BankTransaction)getByKey(id);
    }

    public FinancialTransaction findTransaction(Long id) {
        return getByKey(id);
    }
    
}
