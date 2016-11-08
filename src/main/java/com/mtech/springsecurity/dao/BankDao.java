/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Bank;
import com.mtech.springsecurity.model.BankBranch;

/**
 *
 * @author derek
 */
public interface BankDao {
    
    Bank saveBank(Bank bank);
    
    Bank findBank(Long id);
    
    BankBranch saveBankBranch(BankBranch bankBranch);
    
    java.util.List<Bank> getBanksList();
    
    public java.util.List<BankBranch> getBankBranchesList();
}
