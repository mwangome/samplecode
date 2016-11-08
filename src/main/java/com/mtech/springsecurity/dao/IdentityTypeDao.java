/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.IdentityType;

/**
 *
 * @author derek
 */
public interface IdentityTypeDao {
    IdentityType saveIdentityType(IdentityType identityType);
    
    IdentityType findIdentityType(String idTypeName);
    
    java.util.List<IdentityType>  getIdentityTypesList();
}
