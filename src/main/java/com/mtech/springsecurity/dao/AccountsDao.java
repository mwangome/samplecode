/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.NorminalAccounts;
import com.mtech.springsecurity.model.RealAccounts;
import java.util.List;

/**
 *
 * @author derek
 */
public interface AccountsDao {
    
    RealAccounts saveAccounts(RealAccounts account);
    
    public void bootstrapAccounts();
    
    public java.util.List<RealAccounts> getChartOfAccounts();
    
    public RealAccounts findByCode(String code);
    
    public RealAccounts findByRealAccountByAccountNumber(Integer accountNumber);
    
    public RealAccounts findRealAccountById(Long id);
    
    public NorminalAccounts saveNorminalAccounts(NorminalAccounts norminalAccounts);
    
    public List<NorminalAccounts> findNorminalsByCode(String code);
    
    public NorminalAccounts findNorminalsByAccountNumber(String accountName);
    
    public Accounts saveAccounts(Accounts accounts);
    
    public java.util.List<Accounts> getAccountsList();
    
    public Accounts findAccount(String description);
    
    public List<Accounts> findAccounts(Long parentId);
    
    public List<Accounts> getAllAccountsList();
    
    public boolean findChildOrParentAccounts(Long parentId);
    
    public Accounts findById(Long id);
    
    public Accounts findAccrualExpenseAccount();
    
    public java.util.List<Accounts> getChildAccounts(Long id);
    
    public java.util.List<Accounts> getAccrualExpenseChildAccounts();
    
    public java.util.List<Accounts> getPrepaidExpenseChildAccounts();
    
    public Accounts findPrepaidExpenseAccount();
    
    public void runScriptTest();
    
}
