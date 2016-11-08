/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.LegalType;

/**
 *
 * @author derek
 */
public interface LegalTypeDao {
    LegalType saveLegalType(LegalType legalType);
    
    java.util.List<LegalType> getLegalTypes();
}
