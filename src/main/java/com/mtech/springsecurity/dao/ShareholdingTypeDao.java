/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.ShareholdingType;

/**
 *
 * @author derek
 */
public interface ShareholdingTypeDao {
    ShareholdingType saveShareholdingType(ShareholdingType shareholdingType);
    
    ShareholdingType findShareholdingType(String shareholdingTypeName);
    
    java.util.List<ShareholdingType > getShareholdingTypeList();
    
    public ShareholdingType findShareholdingType(Long id);
}
