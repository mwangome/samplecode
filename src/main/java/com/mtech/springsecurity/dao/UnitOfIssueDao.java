/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.UnitOfIssue;

/**
 *
 * @author derek
 */

public interface UnitOfIssueDao {
    
    UnitOfIssue saveUnitOfIssue(UnitOfIssue unitOfIssue);
    
    java.util.List<UnitOfIssue> getUnitOfIssueList();
    
    UnitOfIssue findUnitOfIssue(String uoiName);
    
    public UnitOfIssue findUnitOfIssue(Long id);
}
