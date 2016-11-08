/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.SMESite;

/**
 *
 * @author derek
 */
public interface SMESiteDao {
    SMESite saveSite(SMESite site);
    
    java.util.List<SMESite> getSites();
    
    SMESite findSite(Long id);
}
