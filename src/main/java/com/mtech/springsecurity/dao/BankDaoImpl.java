/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Bank;
import com.mtech.springsecurity.model.BankBranch;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class BankDaoImpl extends AbstractDao<Long, Bank> implements BankDao {

    public Bank saveBank(Bank bank) {
        persist(bank);
        return bank;
    }

    public List<Bank> getBanksList() {
        return getList();
    }

    public BankBranch saveBankBranch(BankBranch bankBranch) {
        Session bankBranchSession = getSession();
        if(bankBranch.getId() == null){
            bankBranchSession.saveOrUpdate(bankBranch);
        }else{
            bankBranchSession.merge(bankBranch);
        }
        bankBranchSession.flush();
        return bankBranch;
    }
    
    public java.util.List<BankBranch> getBankBranchesList(){
        Session bankBranchSession = getSession();
        Query createQuery = bankBranchSession.createQuery("from BankBranch bb");
        List<BankBranch>  list = createQuery.list();
        return list;
    }

    public Bank findBank(Long id) {
        return getByKey(id);
    }

}
