/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Asset;
import com.mtech.springsecurity.model.SMEEntity;
import java.util.List;

/**
 *
 * @author derek
 */
public interface AssetDao {
    
    Asset saveAsset(Asset asset);
    
    public List<Asset> getAssetsList(SMEEntity entity);
    
    Asset findAsset(Long id);
    
}
