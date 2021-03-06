/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.TransactionType;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class TransactionTypeDaoImpl extends AbstractDao<Long, TransactionType> implements TransactionTypeDao{

    public TransactionType saveTransactionType(TransactionType transactionType) {
        persist(transactionType);
        return transactionType;
    }

    public List<TransactionType> getTransactionTypeList() {
        return getList();
    }
    
}
