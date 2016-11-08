/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AssetDao;
import com.mtech.springsecurity.dao.DepreciationExpenseDao;
import com.mtech.springsecurity.model.Asset;
import com.mtech.springsecurity.model.DepreciationExpense;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.NumberValue;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class AssetService {

    @Autowired
    AssetDao assetDao;

    @Autowired
    AppUtil appUtil;
    
    @Autowired
    DepreciationExpenseDao cdDao;
    
    @Autowired
    NumberValue nv;

    public Asset saveAsset(Asset asset) {
        assetDao.saveAsset(asset);
        return asset;
    }

    public String getAssetsList(SMEEntity entity) {
        List<Asset> assetsList = assetDao.getAssetsList(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (Asset asset : assetsList) {
            object = new JSONObject();
            object.put("id", asset.getId());
            object.put("assetLocation", asset.getAssetLocation());
            object.put("transRef", asset.getTransRef());
            object.put("assetName", asset.getAssetName());
            object.put("description", asset.getDescription());
            object.put("lifespan", asset.getLifespan());
            object.put("payModeName", asset.getPaymentMode() == null?"":asset.getPaymentMode().getPayModeName());
            object.put("assetNumber", asset.getAssetNumber());
            object.put("assetTypeName", asset.getAssetType() == null? "":asset.getAssetType().getAssetTypeName());
            object.put("grnNumber", asset.getGrnNumber());
            object.put("assetValue", asset.getAssetValue());
            object.put("supplierName", asset.getSupplier() == null?"":asset.getSupplier().getSupplierName());
            object.put("purchaseDate", appUtil.formatJSDate(asset.getPurchaseDate()));
            object.put("registeredName", asset.getSmeEntity() == null ? "" : asset.getSmeEntity().getRegisteredName());
            jarray.add(object);
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", assetsList.size());
        wrapper.put("success", true);
        return wrapper.toString();
    }

    public String findAssets(Long id) {
        Asset asset = assetDao.findAsset(id);
        JSONObject object = null;
        object = new JSONObject();
        object.put("id", asset.getId());
        object.put("assetLocation", asset.getAssetLocation());
        object.put("transRef", asset.getTransRef());
        object.put("cumulativeDepreciation", getAccumulatedDepreciation(id));
        object.put("payModeName", asset.getPaymentMode() == null?"":asset.getPaymentMode().getPayModeName());
        object.put("assetName", asset.getAssetName());
        object.put("assetNumber", asset.getAssetNumber());
        object.put("assetTypeName", asset.getAssetType() == null? "":asset.getAssetType().getAssetTypeName());
        object.put("grnNumber", asset.getGrnNumber());
        object.put("lifespan", asset.getLifespan());
        object.put("assetValue", asset.getAssetValue());
        object.put("description", asset.getDescription());
        object.put("supplierName", asset.getSupplier() == null?"":asset.getSupplier().getSupplierName());
        object.put("purchaseDate", appUtil.formatJSDate(asset.getPurchaseDate()));
        object.put("registeredName", asset.getSmeEntity() == null ? "" : asset.getSmeEntity().getRegisteredName());

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", object);
        wrapper.put("totalProperty", 1);
        wrapper.put("success", true);
        return wrapper.toString();
    }
    
    java.math.BigDecimal getAccumulatedDepreciation(Long id){
        java.math.BigDecimal cum = java.math.BigDecimal.ZERO;
        List<DepreciationExpense> cumulativeDepreciation = cdDao.getCumulativeDepreciation(id);
        for(DepreciationExpense exp: cumulativeDepreciation){
            cum = cum.add(nv.getNumber(exp.getDepreciation()));
        }
        
        return cum;
    }
}
