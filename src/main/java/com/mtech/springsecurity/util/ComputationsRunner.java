/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.util;

import com.mtech.springsecurity.model.DepreciationExpense;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.service.DepreciationExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 *
 * @author mwangome
 */
@Component 
public class ComputationsRunner implements Runnable {

    @Autowired
    DepreciationExpenseService deService;
    
    SMEEntity entity;
    public void setEntity(SMEEntity entity){
        this.entity = entity;
    }
    
    public void run() {
        deService.computeDepreciation(entity);
    }
    
}
