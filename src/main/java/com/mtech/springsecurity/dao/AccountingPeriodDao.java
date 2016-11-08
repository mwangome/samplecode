/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AccountingPeriod;
import com.mtech.springsecurity.model.SMEEntity;
import org.hibernate.Session;

/**
 *
 * @author mwangome
 */
public interface AccountingPeriodDao {
    AccountingPeriod saveAccountingPeriod(AccountingPeriod ap);
    
    AccountingPeriod findAccountingPeriod(Long id);
    
    boolean saveAccountingPeriods( java.util.List<AccountingPeriod> aps);
    
    java.util.List<AccountingPeriod> getPeriodsList(SMEEntity entity);
    
    public AccountingPeriod getCurrentDateClosed(SMEEntity entity);
    
    public AccountingPeriod getCurrentPeriod(SMEEntity entity);
    
    public Integer getMaxBatch(SMEEntity entity);
    
    public Session apSession();
}
