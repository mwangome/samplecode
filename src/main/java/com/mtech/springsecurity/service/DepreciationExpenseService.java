/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AccountingPeriodDao;
import com.mtech.springsecurity.dao.AssetDao;
import com.mtech.springsecurity.dao.DepreciationExpenseDao;
import com.mtech.springsecurity.model.AccountingPeriod;
import com.mtech.springsecurity.model.Asset;
import com.mtech.springsecurity.model.DepreciationExpense;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.NumberValue;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author mwangome
 */
@Service
public class DepreciationExpenseService {

    Logger logger = Logger.getLogger(DepreciationExpenseService.class);
    @Autowired
    DepreciationExpenseDao deDao;

    @Autowired
    AssetDao assetDao;

    @Autowired
    AccountingPeriodDao apDao;

    @Autowired
    NumberValue nv;

    public void computeDepreciation(SMEEntity entity) {
        logger.warn("::depreciation computation");
        List<Asset> assetsList = assetDao.getAssetsList(entity);
        List<AccountingPeriod> periodsList = apDao.getPeriodsList(entity);
        DepreciationExpense deprExpense;

        for (AccountingPeriod ap : periodsList) {
            for (Asset asset : assetsList) {
                deprExpense = new DepreciationExpense();
                deprExpense.setAsset(asset);
                deprExpense.setPeriod(ap);
                deprExpense.setEntity(entity);
                BigDecimal lifespan = nv.getNumber(asset.getLifespan());
                BigDecimal cost = nv.getNumber(asset.getAssetValue());
                java.util.Date purchaseDate = new java.util.Date(asset.getPurchaseDate().getTime());
                java.util.Date apStartDate = new java.util.Date(ap.getStartDate().getTime());
                java.util.Date apEndDate = new java.util.Date(ap.getEndDate().getTime());
                
                BigDecimal disposalValue = nv.getNumber(asset.getDisposalValue());
                List<DepreciationExpense> depList = deDao.getPeriodDepreciation(asset.getId(), ap.getId());
                
                if (apEndDate.after(purchaseDate) &&depList.isEmpty()) {
                    BigDecimal depreciation = (cost.subtract(disposalValue)).divide(lifespan.multiply(nv.getNumber(12)), RoundingMode.HALF_EVEN);
                    deprExpense.setDepreciation(depreciation);
                    deDao.saveExpense(deprExpense);
                }
                if(apStartDate.after(new java.util.Date())){
                    break;
                }
            }
        }

    }
}
