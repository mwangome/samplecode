/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Industry;

/**
 *
 * @author derek
 */
public interface IndustryDao {
    Industry saveIndustryCode(Industry industryCode);
    
    java.util.List<Industry> getIndustryCodesList();
    
    public Industry findIndustryCode(String sicName);
            
}
