/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.DepreciationExpense;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;

/**
 *
 * @author mwangome
 */
public interface DepreciationExpenseDao {
    DepreciationExpense saveExpense(DepreciationExpense depreciationExpense);
    
    java.util.List<DepreciationExpense> getListOfExpenses(SMEEntity entity);
    
     public  List<DepreciationExpense>  getCumulativeDepreciation(Long id);
     
     public  List<DepreciationExpense>  getPeriodDepreciation(Long id, Long periodId);
}
