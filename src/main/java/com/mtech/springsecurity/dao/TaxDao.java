/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Tax;

/**
 *
 * @author mwangome
 */
public interface TaxDao {
    Tax saveTax(Tax tax);
    
    java.util.List<Tax> getTaxesList();
    
    Tax findTax(Long id);
    
    public Tax findTax(String taxType);
}
