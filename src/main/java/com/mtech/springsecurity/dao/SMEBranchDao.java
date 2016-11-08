/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMEBranch;
import com.mtech.springsecurity.model.SMEEntity;

/**
 *
 * @author derek
 */
public interface SMEBranchDao {
    SMEBranch saveBranch(SMEBranch branch);
    
    java.util.List<SMEBranch> getBranches(SMEEntity entity);
    
    SMEBranch findBranch(String branchName);
    
    public SMEBranch findBranch(Long id);
}
