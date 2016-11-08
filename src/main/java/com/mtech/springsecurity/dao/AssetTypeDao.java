/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.AssetType;

/**
 *
 * @author derek
 */
public interface AssetTypeDao {
    AssetType saveAssetType(AssetType assetType);
    
    java.util.List<AssetType> getAssetTypeList();
    
    AssetType findAssetType(Long id);
    
    public AssetType findAssetType(String assetTypeName);
}
