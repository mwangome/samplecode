/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.customexceptions.ComputationError;
import com.mtech.springsecurity.dao.PurchaseDao;
import com.mtech.springsecurity.dao.SaleDao;
import com.mtech.springsecurity.dao.StockItemDao;
import com.mtech.springsecurity.dao.StockLedgerDao;
import com.mtech.springsecurity.enumerate.StockLedgerTransactionType;
import com.mtech.springsecurity.model.Purchase;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.model.Sale;
import com.mtech.springsecurity.model.StockItem;
import com.mtech.springsecurity.model.StockLedger;
import com.mtech.springsecurity.util.NumberValue;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class StockLedgerService {

    Logger logger = Logger.getLogger(StockLedgerService.class);

    @Autowired
    StockLedgerDao slDao;

    @Autowired
    SaleDao saleDao;

    @Autowired
    PurchaseDao purchaseDao;

    @Autowired
    NumberValue nv;

    @Autowired
    StockItemDao siDao;

    StockLedger newRecord;

    public String getStockLedger(SMEEntity entity) {
        List<StockLedger> stockLedgerList = slDao.getStockLedgerList(entity);

        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (StockLedger sl : stockLedgerList) {
            object = new JSONObject();
            object.put("id", sl.getId());
            object.put("averageUnitCost", sl.getAvarageUnitCost());
            object.put("averageUnitPrice", sl.getAvarageUnitPrice());
            object.put("qtyBalance", sl.getQtyBalance());
            object.put("stockName", sl.getStock() == null ? "" : sl.getStock().getStockName());
            object.put("storeName", sl.getStore().getStoreName());
            object.put("unitOfIssue", sl.getUnitOfIssue() == null ? "" : sl.getUnitOfIssue().getUoiName());
            object.put("closingStock", sl.getClosingValue());
            jarray.add(object);
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", stockLedgerList.size());
        wrapper.put("success", true);
        return wrapper.toString();
    }

    /**
     *
     * @param entity
     * @param transactionObject - This is either Purchase or Sale Object
     * @return
     */
    public StockLedger updateStockLedger(SMEEntity entity, Object transactionObject) {
        StockLedger record = slDao.getLastStockLedgerRecord(entity);

        logger.warn("update stock!!!");
        newRecord = new StockLedger();
        if (transactionObject instanceof Purchase) {

            Purchase purchase = (Purchase) transactionObject;

            HashMap map = generateAggregates(entity, transactionObject);

            newRecord.setTransactionType(StockLedgerTransactionType.Purchase.name());
            String stockName = purchase.getStock().getStockName();
            record = slDao.getLastStockLedgerRecord(entity, stockName);

            newRecord.setMovementValue(purchase.getPurchaseValue());
            newRecord.setMovementQty(purchase.getQuantity());

            newRecord.setSmeEntity(purchase.getSmeEntity());
            newRecord.setStock(purchase.getStock());
            newRecord.setStore(purchase.getStore());
            newRecord.setUnitOfIssue(purchase.getStock().getUnitOfIssue());
            newRecord.setVat(purchase.getVat());

            newRecord.setAvarageUnitCost(purchase.getUnitCost());
            java.math.BigDecimal purchasesAvg = new java.math.BigDecimal("0");
            try {
                purchasesAvg = getPurchasesAverage(stockName, purchase.getStore().getStoreName(), purchase.getSmeEntity().getRegisteredName());
            } catch (ComputationError er) {
                logger.warn(er);
            }
            newRecord.setAvarageUnitCost(purchasesAvg);
            java.math.BigDecimal salesAvg = new java.math.BigDecimal("0");
            try {
                salesAvg = getSalesAverage(entity, stockName);
            } catch (ComputationError er) {
                logger.warn(er);
            }
            newRecord.setQtyBalance(slDao.stockBalance(entity, stockName));
            newRecord.setAvarageUnitPrice(salesAvg);

            newRecord.setClosingValue(nv.getNumber(map.get("closingStockValue")));
            newRecord.setRunningSale(nv.getNumber(map.get("averageUnitPrice")));
            slDao.saveStockLedger(newRecord);

        }
        if (transactionObject instanceof Sale) {

            Sale sale = (Sale) transactionObject;
            newRecord.setTransactionType(StockLedgerTransactionType.Sale.name());
            newRecord.setMovementQty(sale.getQuantity());
            String stockName = sale.getStock().getStockName();

            HashMap map = generateAggregates(entity, transactionObject);

            newRecord.setSmeEntity(sale.getSmeEntity());
            newRecord.setStock(sale.getStock());
            newRecord.setStore(sale.getStore());
            newRecord.setUnitOfIssue(sale.getStock().getUnitOfIssue());

            newRecord.setAvarageUnitCost(sale.getUnitPrice());
            java.math.BigDecimal salesAvg = new java.math.BigDecimal("0");
            try {
                salesAvg = getSalesAverage(entity, stockName);
            } catch (ComputationError er) {
                logger.warn(er);
            }
            newRecord.setAvarageUnitPrice(salesAvg);
            java.math.BigDecimal purchasesAvg = new java.math.BigDecimal("0");
            try {
                purchasesAvg = getPurchasesAverage(stockName, sale.getStore().getStoreName(), sale.getSmeEntity().getRegisteredName());
            } catch (ComputationError er) {
                logger.warn(er);
            }
            newRecord.setQtyBalance(slDao.stockBalance(entity, stockName));
            newRecord.setAvarageUnitCost(purchasesAvg);

            newRecord.setClosingValue(nv.getNumber(map.get("closingStockValue")));
            newRecord.setRunningSale(nv.getNumber(map.get("averageUnitPrice")));
            newRecord.setMovementValue(nv.getNumber(map.get("saleMvtValue")));

            slDao.saveStockLedger(newRecord);

        }
        return record;
    }

    public java.util.HashMap generateAggregates(SMEEntity entity, Object thisTransaction) {

        java.util.HashMap map = new java.util.HashMap();

        Purchase aPurchase = null;
        Sale aSale = null;

        if (thisTransaction instanceof Purchase) {
            aPurchase = (Purchase) thisTransaction;
        } else {
            aSale = (Sale) thisTransaction;
        }

        StockItem stock = (aPurchase == null ? aSale.getStock() : aPurchase.getStock());

        String storeName = (aPurchase == null ? aSale.getStore().getStoreName() : aPurchase.getStore().getStoreName());

        List<StockLedger> stockLedgerList = slDao.getStockLedgerList(entity, stock);
        if (stockLedgerList.isEmpty()) {
            stockLedgerList = new java.util.ArrayList<StockLedger>();
        }

        /**
         * create a memory stockledger
         */
        StockLedger slr = new StockLedger();
        if (thisTransaction instanceof Purchase) {
            Purchase tmpPurchase = (Purchase) thisTransaction;
            slr.setTransactionType(StockLedgerTransactionType.Purchase.name());
            slr.setMovementQty(tmpPurchase.getQuantity());
            slr.setMovementValue(tmpPurchase.getPurchaseValue().subtract(tmpPurchase.getVat()));
        } else {
            Sale tmpSale = (Sale) thisTransaction;
            slr.setTransactionType(StockLedgerTransactionType.Sale.name());
            slr.setMovementQty(tmpSale.getQuantity());
            slr.setMovementValue(tmpSale.getSalesValue());
        }
        stockLedgerList.add(slr);

        BigDecimal purMovtTot = BigDecimal.ZERO;
        BigDecimal cogMovtTot = BigDecimal.ZERO;
        BigDecimal salePrice = BigDecimal.ZERO;
        BigDecimal mvtQtyTotals = BigDecimal.ZERO;
        for (StockLedger sl : stockLedgerList) {
            if (sl.getTransactionType().equalsIgnoreCase(StockLedgerTransactionType.Purchase.name())) {
                BigDecimal movementQty = nv.getNumber(sl.getMovementQty());
                BigDecimal movementValue = sl.getMovementValue().subtract(nv.getNumber(sl.getVat()));
                mvtQtyTotals = nv.getNumber(mvtQtyTotals).add(movementQty);
                purMovtTot = nv.getNumber(purMovtTot).add(nv.getNumber(movementValue));
                cogMovtTot = cogMovtTot.add(nv.getNumber(movementValue));
                salePrice = cogMovtTot.divide(mvtQtyTotals, RoundingMode.HALF_EVEN);
                logger.warn("sales price on purchases::" + salePrice + "::moving value totals" + cogMovtTot);
                map.put("closingStockValue", purMovtTot);
                map.put("averageUnitPrice", salePrice);
            } else {
                BigDecimal movementQty = sl.getMovementQty();

                purMovtTot = purMovtTot.subtract(nv.getNumber(salePrice).multiply(nv.getNumber(movementQty)));
                mvtQtyTotals = mvtQtyTotals.subtract(nv.getNumber(movementQty));
                map.put("closingStockValue", purMovtTot);
                map.put("averageUnitPrice", salePrice);
                map.put("saleMvtValue", nv.getNumber(salePrice).multiply(nv.getNumber(movementQty)));

                logger.warn("sales price::" + salePrice);
                logger.warn("closing stock::" + purMovtTot);
            }
        }

        return map;
    }

    java.math.BigDecimal getPurchasesAverage(String stockName, String storeName, String registeredName) throws ComputationError {
        List<Purchase> purchasesList = purchaseDao.getPurchasesList(stockName, storeName, registeredName);
        java.math.BigDecimal unitCostTotal = new java.math.BigDecimal(0);
        for (Purchase p : purchasesList) {
            unitCostTotal = unitCostTotal.add(nv.getNumber(p.getUnitCost()));
        }
        logger.warn("values::" + unitCostTotal + "<=>" + purchasesList.size());
        unitCostTotal = unitCostTotal.divide(new java.math.BigDecimal(purchasesList.isEmpty() ? 1 : purchasesList.size()), java.math.RoundingMode.HALF_UP);
        return unitCostTotal;
    }

    java.math.BigDecimal getSalesAverage(SMEEntity entity, String stockName) throws ComputationError {
        List<Sale> salesList = saleDao.getSalesList(entity, stockName);
        java.math.BigDecimal unitCostTotal = new java.math.BigDecimal(0);
        for (Sale s : salesList) {
            unitCostTotal = unitCostTotal.add(nv.getNumber(s.getUnitPrice()));
        }
        logger.warn("values::" + unitCostTotal + "<=>" + salesList.size());
        unitCostTotal = unitCostTotal.divide(new java.math.BigDecimal(salesList.isEmpty() ? 1 : salesList.size()), java.math.RoundingMode.HALF_UP);

        return unitCostTotal;
    }

    public StockLedger findStockAvailable(String registeredName,
            String storeName,
            String stockName) {
        return slDao.findStockAvailable(registeredName, storeName, stockName);
    }

    /**
     *
     * @param entity
     * @return
     */
    public String getCostOfSale(SMEEntity entity) {
        List<StockLedger> stockLedgerList = slDao.getStockLedgerList(entity);

        java.math.BigDecimal runQty = java.math.BigDecimal.ZERO;
        java.math.BigDecimal runVal = java.math.BigDecimal.ZERO;
        java.math.BigDecimal saleVal = java.math.BigDecimal.ZERO;

        java.math.BigDecimal costOfSale = java.math.BigDecimal.ZERO;

        for (StockLedger sl : stockLedgerList) {
            String type = sl.getTransactionType();
            if (type.equalsIgnoreCase(StockLedgerTransactionType.Purchase.name())) {
                runQty = runQty.add(sl.getMovementQty());
                runVal = runVal.add(sl.getMovementValue());
                saleVal = runVal.divide(runQty, RoundingMode.HALF_EVEN);
                logger.warn("purchasing:::qty:::" + runQty + ":::val:::" + runVal + ":::sale:::" + saleVal);
            } else {//sale
                costOfSale = costOfSale.add((sl.getMovementQty().multiply(saleVal)));

                runQty = runQty.subtract(sl.getMovementQty());
                runVal = runVal.subtract(sl.getMovementQty().multiply(saleVal));

                if (runQty.compareTo(java.math.BigDecimal.ZERO) != 0) {
                    saleVal = runVal.divide(runQty, RoundingMode.HALF_EVEN);
                }
                logger.warn("selling:::qty:::" + runQty + ":::val:::" + runVal + ":::sale:::" + saleVal);
            }
        }
        return String.valueOf(costOfSale);//"{\"success\": true, \"msg\":\"Cost of Sales::" +costOfSale+ "\"}"
    }

    /**
     *
     * @param entity
     * @return
     */
    public java.math.BigDecimal getClosingStockValue(SMEEntity entity) {
        List<StockLedger> stockLedgerList = slDao.getStockLedgerList(entity);

        java.math.BigDecimal runQty = java.math.BigDecimal.ZERO;
        java.math.BigDecimal runVal = java.math.BigDecimal.ZERO;
        java.math.BigDecimal saleVal = java.math.BigDecimal.ZERO;

        java.math.BigDecimal costOfSale = java.math.BigDecimal.ZERO;

        for (StockLedger sl : stockLedgerList) {
            String type = sl.getTransactionType();
            if (type.equalsIgnoreCase(StockLedgerTransactionType.Purchase.name())) {
                runQty = runQty.add(sl.getMovementQty());
                runVal = runVal.add(sl.getMovementValue());
                saleVal = runVal.divide(runQty, RoundingMode.HALF_EVEN);
                logger.warn("purchasing:::qty:::" + runQty + ":::val:::" + runVal + ":::sale:::" + saleVal);
            } else {//sale
                costOfSale = costOfSale.add((sl.getMovementQty().multiply(saleVal)));

                runQty = runQty.subtract(sl.getMovementQty());
                runVal = runVal.subtract(sl.getMovementQty().multiply(saleVal));

                if (runQty.compareTo(java.math.BigDecimal.ZERO) != 0) {
                    saleVal = runVal.divide(runQty, RoundingMode.HALF_EVEN);
                }
                logger.warn("selling:::qty:::" + runQty + ":::val:::" + runVal + ":::sale:::" + saleVal);
            }
        }
        return (runVal);//"{\"success\": true, \"msg\":\"Cost of Sales::" +costOfSale+ "\"}"
    }

    public BigDecimal getTotalClosingInventory(SMEEntity entity) {
        List<StockLedger> stockLedgerList = slDao.getStockLedgerList(entity);
        List<StockItem> stockItemsList = siDao.getStockItemsList(entity);

        BigDecimal totalClosingValue = BigDecimal.ZERO;
        for (StockItem si : stockItemsList) {
            BigDecimal lastStockItem = getLastStockItem(stockLedgerList, si);
            totalClosingValue = totalClosingValue.add(lastStockItem);
        }
        return totalClosingValue;
    }

    BigDecimal getLastStockItem(List<StockLedger> stockLedgerList, StockItem si) {
        BigDecimal closingValue = BigDecimal.ZERO;
        for (StockLedger sl : stockLedgerList) {
            if (sl.getStock().getStockName().equalsIgnoreCase(si.getStockName())) {
                closingValue = sl.getClosingValue();
            }
        }

        return closingValue;
    }

    BigDecimal getSalesPurchasesTotal(List<StockLedger> stockLedgerList, StockLedgerTransactionType si) {
        BigDecimal closingValue = BigDecimal.ZERO;
        for (StockLedger sl : stockLedgerList) {
            if (sl.getTransactionType().equalsIgnoreCase(si.name())) {
                if (si.name().equalsIgnoreCase(StockLedgerTransactionType.Purchase.name())) {
                    closingValue = closingValue.add(sl.getMovementValue()).subtract(nv.getNumber(sl.getVat()));
                } else {
                    closingValue = closingValue.add(sl.getMovementValue());
                }

            }
        }

        return closingValue;
    }

    BigDecimal getCostOfGoodsSold(List<StockLedger> stockLedgerList, StockLedgerTransactionType si) {
        BigDecimal closingValue = BigDecimal.ZERO;
        for (StockLedger sl : stockLedgerList) {
            if (sl.getTransactionType().equalsIgnoreCase(si.name())) {
                closingValue = closingValue.add(sl.getMovementValue()).add(nv.getNumber(sl.getVat()));
            }
        }

        return closingValue;
    }
}
