/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.IndustryGroup;

/**
 *
 * @author mwangome
 */
public interface IndustryGroupDao {
    
    java.util.List<IndustryGroup> getListOfGroups();
    
    public IndustryGroup findIndustryGroupByName(String groupName);
    
}
