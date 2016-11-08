/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.controller;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.dao.AssetTypeDao;
import com.mtech.springsecurity.dao.CustomerDao;
import com.mtech.springsecurity.dao.PaymentModeDao;
import com.mtech.springsecurity.dao.SMEEntityDao;
import com.mtech.springsecurity.dao.SupplierDao;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.enumerate.PaymentModes;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.Asset;
import com.mtech.springsecurity.model.AssetType;
import com.mtech.springsecurity.model.Customer;
import com.mtech.springsecurity.model.PaymentMode;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Supplier;
import com.mtech.springsecurity.service.AssetService;
import com.mtech.springsecurity.service.DepreciationExpenseService;
import com.mtech.springsecurity.util.AppUtil;
import java.util.List;
import javax.servlet.http.HttpSession;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author derek
 */
@Controller
public class AssetController {

    Logger logger = Logger.getLogger(AssetController.class);
    @Autowired
    AssetService assetService;

    @Autowired
    SMEEntityDao smeEntityDao;

    @Autowired
    AppUtil appUtil;

    @Autowired
    AssetTypeDao atDao;

    @Autowired
    SupplierDao supplierDao;

    @Autowired
    PaymentModeDao payDao;

    @Autowired
    AccountTransactionsDao transDao;

    @Autowired
    AccountsDao accDao;

    @Autowired
    CustomerDao custDao;
    
    @Autowired
    DepreciationExpenseService depService;

    @RequestMapping(value = {"/asset/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String saveAsset(@ModelAttribute Asset asset,
            @RequestParam(value = "registeredName") String registeredName,
            @RequestParam(value = "assetTypeName") String assetTypeName,
            @RequestParam(value = "supplierName") String supplierName,
            @RequestParam(value = "payModeName") String payModeName) {//
        SMEEntity smeEntity = smeEntityDao.findSMEEntity(registeredName);
        AssetType findAssetType = atDao.findAssetType(assetTypeName);
        Supplier findSupplier = supplierDao.findSupplier(supplierName);
        PaymentMode paymentMode = payDao.findPaymentMode(payModeName);

        /**
         * handle accounts transactions
         */
        String transRef = asset.getTransRef();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = transDao.findAccountTransactions(smeEntity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;

        if (drCrTransItems.size() == 2) {
            AccountTransactions trans1 = drCrTransItems.get(0);
            AccountTransactions trans2 = drCrTransItems.get(1);

            if (trans1.getAccount().getAccountName().equalsIgnoreCase(MappedAccountsEnum.FixedAssets.getDescription())) {
                drCrTransA = trans1;
                drCrTransB = trans2;
            }
        }
        /**
         * Asset acquisition
         */
        Accounts drAccount = accDao.findAccount(MappedAccountsEnum.FixedAssets.getDescription());
        Accounts crAccount = accDao.findAccount(MappedAccountsEnum.Creditors.name());

        logger.warn("is account null?" + (drAccount == null) + "descr>>>" + MappedAccountsEnum.FixedAssets.getDescription());
        /**
         * Buying on cash
         */
        Accounts crAccountCash = accDao.findAccount(payModeName);
        boolean transExists = false;
        if (drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);

        } else {
            transExists = true;
        }

        if (PaymentModes.CREDIT.getDescription().equals(payModeName)) {
            drCrTransA.setDebit(asset.getAssetValue());
            drCrTransB.setCredit(asset.getAssetValue());

            drCrTransB.setAccount(crAccount);
            drCrTransA.setAccount(drAccount);

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());

        } else {
            drCrTransA.setAccount(drAccount);
            drCrTransB.setAccount(crAccountCash);

            drCrTransA.setDebit(asset.getAssetValue());
            drCrTransB.setCredit(asset.getAssetValue());

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());
        }
        drCrTransA.setSmeEntity(smeEntity);
        drCrTransB.setSmeEntity(smeEntity);
        if (!transExists) {
            transDao.saveAccountTransactions(drCrTransA);
            transDao.saveAccountTransactions(drCrTransB);
        }

        asset.setSmeEntity(smeEntity);
        asset.setAssetType(findAssetType);
        asset.setSupplier(findSupplier);
        asset.setPaymentMode(paymentMode);
        assetService.saveAsset(asset);
        return appUtil.streamResponse("asset").toString();
    }

    @RequestMapping(value = {"/assetdisposal/save.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String disposeAsset(@ModelAttribute Asset asset,
            @RequestParam(value = "registeredName") String registeredName,
            @RequestParam(value = "assetTypeName") String assetTypeName,
            @RequestParam(value = "supplierName") String supplierName,
            @RequestParam(value = "customerName") String customerName,
            @RequestParam(value = "payModeName") String payModeName,
            @RequestParam(value = "gainLoss") java.math.BigDecimal gainLoss,
            HttpSession session){
        SMEEntity entity = (SMEEntity)session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if(entity == null){
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        //SMEEntity smeEntity = smeEntityDao.findSMEEntity(registeredName);
        AssetType findAssetType = atDao.findAssetType(assetTypeName);
        Supplier findSupplier = supplierDao.findSupplier(supplierName);
        PaymentMode paymentMode = payDao.findPaymentMode(payModeName);  

        Customer findCustomer = custDao.findCustomer(customerName);
        /**
         * handle accounts transactions
         */
        String transRef = asset.getTransRef();

        /**
         * can return 2 items cr / dr
         */
        List<AccountTransactions> drCrTransItems = transDao.findAccountTransactions(entity, transRef);
        AccountTransactions drCrTransA = null;
        AccountTransactions drCrTransB = null;

        AccountTransactions drCrTransGLDepA = null;
        AccountTransactions drCrTransGLDepB = null;

        if (drCrTransItems.size() == 4) {

            return "{\"success\":false, \"msg\":\"This asset appears to have been disposed!\"}";
        }//else asset was disposed

        /**
         * Asset acquisition
         */
        Accounts crAccount = accDao.findAccount(MappedAccountsEnum.FixedAssets.getDescription());
        Accounts drAccount = accDao.findAccount(MappedAccountsEnum.Debtors.name());

        Accounts crAccountGain = accDao.findAccount(MappedAccountsEnum.Gain.getDescription());
        Accounts drAccountLoss = accDao.findAccount(MappedAccountsEnum.Loss.getDescription());

        Accounts drAccountAccDepre = accDao.findAccount(MappedAccountsEnum.Depreciation.getDescription());

        /**
         * Buying on cash
         */
        Accounts crAccountCash = accDao.findAccount(payModeName);

        if (!drCrTransItems.isEmpty()) {
            drCrTransA = new AccountTransactions();
            drCrTransA.setTransRef(transRef);

            drCrTransB = new AccountTransactions();
            drCrTransB.setTransRef(transRef);

            drCrTransGLDepA = new AccountTransactions();
            drCrTransGLDepA.setTransRef(transRef);
            drCrTransGLDepB = new AccountTransactions();
            drCrTransGLDepB.setTransRef(transRef);

        }

        if (PaymentModes.CREDIT.getDescription().equals(payModeName)) {
            
            //asset & debtors transaction
            drCrTransA.setDebit(asset.getDisposalValue());
            drCrTransB.setCredit(asset.getAssetValue());

            drCrTransB.setAccount(crAccount);
            drCrTransA.setAccount(drAccount);

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());

            //depreciation gain or loss
            if (gainLoss.compareTo(java.math.BigDecimal.ZERO) > 0) {//gain
                drCrTransGLDepA.setCredit(gainLoss);
                drCrTransGLDepB.setDebit(asset.getCumulativeDepreciation());

                drCrTransGLDepA.setAccount(crAccountGain);
                drCrTransGLDepB.setAccount(drAccountAccDepre);
                
                
            } else {
                drCrTransGLDepA.setDebit(gainLoss.multiply(new java.math.BigDecimal(-1)));
                drCrTransGLDepB.setDebit(asset.getCumulativeDepreciation());

                drCrTransGLDepA.setAccount(drAccountLoss);
                drCrTransGLDepB.setAccount(drAccountAccDepre);
            }
            
            

        } else {
            
            drCrTransA.setDebit(asset.getDisposalValue());
            drCrTransB.setCredit(asset.getAssetValue());

            drCrTransB.setAccount(crAccount);
            drCrTransA.setAccount(crAccountCash);

            drCrTransA.setTransDate(new java.util.Date());
            drCrTransB.setTransDate(new java.util.Date());

            //depreciation gain or loss
            if (gainLoss.compareTo(java.math.BigDecimal.ZERO) > 0) {//gain
                drCrTransGLDepA.setCredit(gainLoss);
                drCrTransGLDepB.setDebit(asset.getCumulativeDepreciation());

                drCrTransGLDepA.setAccount(crAccountGain);
                drCrTransGLDepB.setAccount(drAccountAccDepre);
            } else {
                drCrTransGLDepA.setDebit(gainLoss.multiply(new java.math.BigDecimal(-1)));
                drCrTransGLDepB.setDebit(asset.getCumulativeDepreciation());

                drCrTransGLDepA.setAccount(drAccountLoss);
                drCrTransGLDepB.setAccount(drAccountAccDepre);
            }
        }
        
        drCrTransGLDepA.setTransDate(new java.util.Date());
        drCrTransGLDepB.setTransDate(new java.util.Date());
        
        drCrTransA.setSmeEntity(entity);
        drCrTransB.setSmeEntity(entity);

        drCrTransGLDepA.setSmeEntity(entity);
        drCrTransGLDepB.setSmeEntity(entity);

        transDao.saveAccountTransactions(drCrTransA);
        transDao.saveAccountTransactions(drCrTransB);

        transDao.saveAccountTransactions(drCrTransGLDepA);
        transDao.saveAccountTransactions(drCrTransGLDepB);

        asset.setSmeEntity(entity);
        asset.setAssetType(findAssetType);
        asset.setSupplier(findSupplier);
        asset.setCustomer(findCustomer);
        asset.setPaymentMode(paymentMode);
        asset.setDisposed(Boolean.TRUE);
        assetService.saveAsset(asset);
        return appUtil.streamResponse("asset disposal").toString();
    }

    @RequestMapping(value = {"/assets/gridview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String getAssetsList(HttpSession session) {
        //SMEEntity sme = 

        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        String assetsList = assetService.getAssetsList(entity);
        return assetsList;
    }

    @RequestMapping(value = {"/asset/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findAsset(@RequestParam(value = "id") Long id) {
        String assets = assetService.findAssets(id);
        return assets;
    }

    @RequestMapping(value = {"/assetdisposal/formview.action"}, method = RequestMethod.POST)
    @ResponseBody
    public String findAssetToDispose(@RequestParam(value = "id") Long id,
            HttpSession session) {
        SMEEntity entity = (SMEEntity) session.getAttribute("entity"); //smeEntityDao.findSMEEntity(registeredName);
        if (entity == null) {
            return "{\"success\":false, \"msg\":\"Sorry, you are not registered to run transactions, seek assistance from administrators!\"}";
        }
        depService.computeDepreciation(entity);
        String assets = assetService.findAssets(id);
        return assets;
    }
}
