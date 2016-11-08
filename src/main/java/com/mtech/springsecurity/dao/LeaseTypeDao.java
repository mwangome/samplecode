/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.LeaseType;

/**
 *
 * @author derek
 */
public interface LeaseTypeDao {
    LeaseType saveLeaseType(LeaseType leaseType);
    
    java.util.List<LeaseType> getLeaseTypeList();
    
    LeaseType findLeaseType(Long id);
    
    public LeaseType findLeaseType(String leaseTypeName);
}
