/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.AccountTransactionsDao;
import com.mtech.springsecurity.dao.AccountsDao;
import com.mtech.springsecurity.dao.PurchaseDao;
import com.mtech.springsecurity.dao.SaleDao;
import com.mtech.springsecurity.dao.StockLedgerDao;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.enumerate.StockLedgerTransactionType;
import com.mtech.springsecurity.model.AccountTransactions;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.NumberValue;
import java.math.BigDecimal;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author mwangome
 */
@Service
public class IncomeStatementService {

    Logger logger = Logger.getLogger(IncomeStatementService.class);

    @Autowired
    SaleDao saleDao;

    @Autowired
    PurchaseDao purchaseDao;

    @Autowired
    StockLedgerService slService;

    @Autowired
    AppUtil appUtil;

    @Autowired
    AccountsDao accountsDao;

    @Autowired
    AccountTransactionsDao atDao;

    @Autowired
    NumberValue nv;

    @Autowired
    AccountsService accountsService;

    @Autowired
    AccountTransactionsService atService;

    @Autowired
    StockLedgerDao slDao;

    /**
     * Generate Income Statement
     *
     * @param entity
     * @return
     */
    public String prepareIncomeStatement(SMEEntity entity) {

        JSONArray array = new JSONArray();

        JSONObject incomeStmtTxts = new JSONObject();

        JSONObject wrapper = new JSONObject();

        java.math.BigDecimal saleValue = java.math.BigDecimal.ZERO;

        java.math.BigDecimal purchaseValue = java.math.BigDecimal.ZERO;

        /**
         * Get aggregate for freight in account
         */
        Accounts accFreightIn = accountsDao.findAccount(MappedAccountsEnum.Freight_In.getDescription());
        List<AccountTransactions> atFreightIn = atDao.findAccountTransactionsByAccount(entity, accFreightIn.getId());
        java.math.BigDecimal freightIn = java.math.BigDecimal.ZERO;
        for (AccountTransactions at : atFreightIn) {
            freightIn = freightIn.add(nv.getNumber(at.getDebit()));
        }

        logger.warn("Carriage Inwards:::" + freightIn);
        saleValue = atService.getAggregateForAccount(entity, MappedAccountsEnum.Sales.getDescription());
        purchaseValue = atService.getAggregateForAccount(entity, MappedAccountsEnum.Purchases.getDescription());

        incomeStmtTxts.put("name", "<b>Revenue</b>");
        incomeStmtTxts.put("value", "");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Gross Sales");
        incomeStmtTxts.put("value", appUtil.formatNumber(
                saleValue
        ));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less sales returns and allowances)");
        incomeStmtTxts.put("value", "-");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;<b>Net Sales</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Cost of Goods Sold</b>");
        incomeStmtTxts.put("value", "");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Beginning Inventory");
        incomeStmtTxts.put("value", "-");
        array.add(incomeStmtTxts);

        BigDecimal cosPrv = slService.getSalesPurchasesTotal(slDao.getStockLedgerList(entity), StockLedgerTransactionType.Sale);

        String costOfSale = appUtil.formatNumber(cosPrv);
        logger.warn("costOfSale::" + costOfSale);
        costOfSale = String.valueOf(nv.getNumber(cosPrv).add(freightIn));

        BigDecimal closingStockValue = slService.getTotalClosingInventory(entity);

        BigDecimal purchasesTotals = slService.getSalesPurchasesTotal(slDao.getStockLedgerList(entity), StockLedgerTransactionType.Purchase);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Goods purchased or manufactured");
        incomeStmtTxts.put("value", appUtil.formatNumber(purchasesTotals));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Total goods avaliable");
        incomeStmtTxts.put("value", appUtil.formatNumber(purchasesTotals));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less ending inventory)");
        incomeStmtTxts.put("value", appUtil.formatNumber(nv.getNumber(closingStockValue)));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Cost of goods sold");
        incomeStmtTxts.put("value", appUtil.formatNumber(nv.getNumber(cosPrv).add(freightIn)));
        array.add(incomeStmtTxts);

        cosPrv = cosPrv.add(freightIn);

        costOfSale = String.valueOf(nv.getNumber(cosPrv).subtract(closingStockValue));
        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;<b>Gross Profit</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue.subtract(nv.getNumber(cosPrv))));
        array.add(incomeStmtTxts);

        //Expenses
        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Expenses</b>");
        incomeStmtTxts.put("value", "");
        array.add(incomeStmtTxts);
        List<Accounts> expensesList = accountsService.findExpensesList("Operating Expenses");
        java.math.BigDecimal expensesTotals = java.math.BigDecimal.ZERO;
        java.math.BigDecimal expensesAcc = java.math.BigDecimal.ZERO;
        for (Accounts ac : expensesList) {
            expensesAcc = atService.getAccountTransactionsAggregate(entity, ac.getAccountName());

            if (ac.getAccountName().equalsIgnoreCase(MappedAccountsEnum.Tax.getDescription())) {

            } else {
                incomeStmtTxts = new JSONObject();
                incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;" + ac.getAccountName());
                incomeStmtTxts.put("value", appUtil.formatNumber(expensesAcc));
                if (expensesAcc.compareTo(java.math.BigDecimal.ZERO) > 0) {
                    expensesTotals = expensesTotals.add(expensesAcc);
                    logger.warn("adding expense:::" + expensesAcc);
                    array.add(incomeStmtTxts);
                }
            }

        }

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>&nbsp;&nbsp;&nbsp;&nbsp;Total Expenses</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(nv.getNumber(expensesTotals)));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Operating Income (Loss)</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue.subtract(nv.getNumber(cosPrv)).subtract(expensesTotals)));
        array.add(incomeStmtTxts);
        
        BigDecimal gainLossAssets = atService.computeGainLossDisposal(entity);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Non-operating revenues, expenses, gains, losses</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(nv.getNumber(gainLossAssets)));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less interest expense)");
        incomeStmtTxts.put("value", "-");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Income before Taxes");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue
                .subtract(nv.getNumber(cosPrv))
                .add(nv.getNumber(gainLossAssets))
                .subtract(expensesTotals)));
        
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less income Tax expense)");
        incomeStmtTxts.put("value", "(" + appUtil.formatNumber(BigDecimal.ZERO) + ")");
        array.add(incomeStmtTxts);

        BigDecimal income = saleValue.subtract(nv.getNumber(cosPrv)).subtract(expensesTotals).add(nv.getNumber(gainLossAssets));
        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Net Income</b>");
        incomeStmtTxts.put("value", income.compareTo(BigDecimal.ZERO) < 0 ?  appUtil.formatNumber(income)  : appUtil.formatNumber(income));
        array.add(incomeStmtTxts);

        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }

    public BigDecimal computeIncome(SMEEntity entity) {

        java.math.BigDecimal saleValue = java.math.BigDecimal.ZERO;
        BigDecimal gainLossAssets = atService.computeGainLossDisposal(entity);

        /**
         * Get aggregate for freight in account
         */
        Accounts accFreightIn = accountsDao.findAccount(MappedAccountsEnum.Freight_In.getDescription());
        List<AccountTransactions> atFreightIn = atDao.findAccountTransactionsByAccount(entity, accFreightIn.getId());
        java.math.BigDecimal freightIn = java.math.BigDecimal.ZERO;
        for (AccountTransactions at : atFreightIn) {
            freightIn = freightIn.add(nv.getNumber(at.getDebit()));
        }

        /**
         * Get aggregate for freight in account
         */
        Accounts taxAcc = accountsDao.findAccount(MappedAccountsEnum.Tax.getDescription());
        
        logger.warn("Carriage Inwards:::" + freightIn);
        saleValue = atService.getAggregateForAccount(entity, MappedAccountsEnum.Sales.getDescription());

        BigDecimal cosPrv = slService.getSalesPurchasesTotal(slDao.getStockLedgerList(entity), StockLedgerTransactionType.Sale);
        cosPrv = cosPrv.add(freightIn);
        List<Accounts> expensesList = accountsService.findExpensesList("Operating Expenses");
        java.math.BigDecimal expensesTotals = java.math.BigDecimal.ZERO;
        java.math.BigDecimal expensesAcc = java.math.BigDecimal.ZERO;
        for (Accounts ac : expensesList) {
            expensesAcc = atService.getAccountTransactionsAggregate(entity, ac.getAccountName());
            if (ac.getAccountName().equalsIgnoreCase(MappedAccountsEnum.Tax.getDescription())) {

            }else {
                expensesTotals = expensesTotals.add(expensesAcc);
            }
        }
        logger.warn("total expenses::" + expensesTotals);

        BigDecimal income = saleValue.subtract(nv.getNumber(cosPrv)).add(gainLossAssets).subtract(expensesTotals);

        return income;
    }

    /**
     * Generate Income Statement
     *
     * @param entity
     * @return
     */
    public String prepareHTMLIncomeStatement(SMEEntity entity) {

        JSONArray array = new JSONArray();

        JSONObject incomeStmtTxts = new JSONObject();

        JSONObject wrapper = new JSONObject();

        java.math.BigDecimal saleValue = java.math.BigDecimal.ZERO;

        java.math.BigDecimal purchaseValue = java.math.BigDecimal.ZERO;

        /**
         * Get aggregate for freight in account
         */
        Accounts accFreightIn = accountsDao.findAccount(MappedAccountsEnum.Freight_In.getDescription());
        List<AccountTransactions> atFreightIn = atDao.findAccountTransactionsByAccount(entity, accFreightIn.getId());
        java.math.BigDecimal freightIn = java.math.BigDecimal.ZERO;
        for (AccountTransactions at : atFreightIn) {
            freightIn = freightIn.add(nv.getNumber(at.getDebit()));
        }

        /**
         * Get aggregate for freight in account
         */
        Accounts taxAcc = accountsDao.findAccount(MappedAccountsEnum.Tax.getDescription());
        List<AccountTransactions> taxes = atDao.findAccountTransactionsByAccount(entity, taxAcc.getId());
        java.math.BigDecimal taxesTotals = java.math.BigDecimal.ZERO;
//        for (AccountTransactions at : taxes) {
//            taxesTotals = taxesTotals.add(nv.getNumber(at.getDebit()));
//        }
        logger.warn("Carriage Inwards:::" + freightIn);
        saleValue = atService.getAggregateForAccount(entity, MappedAccountsEnum.Sales.getDescription());
        purchaseValue = atService.getAggregateForAccount(entity, MappedAccountsEnum.Purchases.getDescription());

        incomeStmtTxts.put("name", "<b>Revenue</b>");
        incomeStmtTxts.put("value", "");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Gross Sales");
        incomeStmtTxts.put("value", appUtil.formatNumber(
                saleValue
        ));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less sales returns and allowances)");
        incomeStmtTxts.put("value", "-");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;<b>Net Sales</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Cost of Goods Sold</b>");
        incomeStmtTxts.put("value", "");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Beginning Inventory");
        incomeStmtTxts.put("value", "-");
        array.add(incomeStmtTxts);

        BigDecimal cosPrv = slService.getCostOfGoodsSold(slDao.getStockLedgerList(entity), StockLedgerTransactionType.Sale);

        String costOfSale = appUtil.formatNumber(cosPrv);
        logger.warn("costOfSale::" + costOfSale);
        costOfSale = String.valueOf(nv.getNumber(cosPrv).add(freightIn));

        BigDecimal closingStockValue = slService.getTotalClosingInventory(entity);

        BigDecimal purchasesTotals = slService.getSalesPurchasesTotal(slDao.getStockLedgerList(entity), StockLedgerTransactionType.Purchase);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Goods purchased or manufactured");
        incomeStmtTxts.put("value", appUtil.formatNumber(purchasesTotals));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Total goods avaliable");
        incomeStmtTxts.put("value", appUtil.formatNumber(purchasesTotals));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less ending inventory)");
        incomeStmtTxts.put("value", appUtil.formatNumber(nv.getNumber(closingStockValue)));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Cost of goods sold");
        incomeStmtTxts.put("value", appUtil.formatNumber(nv.getNumber(cosPrv).add(freightIn)));
        array.add(incomeStmtTxts);

        cosPrv = cosPrv.add(freightIn);

        costOfSale = String.valueOf(nv.getNumber(cosPrv).subtract(closingStockValue));
        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;<b>Gross Profit</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue.subtract(nv.getNumber(cosPrv))));
        array.add(incomeStmtTxts);

        //Expenses
        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Expenses</b>");
        incomeStmtTxts.put("value", "");
        array.add(incomeStmtTxts);
        List<Accounts> expensesList = accountsService.findExpensesList("Operating Expenses");
        java.math.BigDecimal expensesTotals = java.math.BigDecimal.ZERO;
        java.math.BigDecimal expensesAcc = java.math.BigDecimal.ZERO;
        for (Accounts ac : expensesList) {
            logger.warn("tax check:::" + ac.getAccountName() + "::" + MappedAccountsEnum.Tax.getDescription());
            if (ac.getAccountName().equalsIgnoreCase(MappedAccountsEnum.Tax.getDescription())) {

            } else {
                expensesAcc = atService.getAccountTransactionsAggregate(entity, ac.getAccountName());

                incomeStmtTxts = new JSONObject();
                incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;" + ac.getAccountName());
                incomeStmtTxts.put("value", appUtil.formatNumber(expensesAcc));
                if (expensesAcc.compareTo(java.math.BigDecimal.ZERO) > 0) {
                    expensesTotals = expensesTotals.add(expensesAcc);
                    logger.warn("adding expense:::" + expensesAcc);
                    array.add(incomeStmtTxts);
                }
            }

        }

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>&nbsp;&nbsp;&nbsp;&nbsp;Total Expenses</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(nv.getNumber(expensesTotals)));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Operating Income (Loss)</b>");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue.subtract(nv.getNumber(cosPrv))));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Non-operating revenues, expenses, gains, losses</b>");
        incomeStmtTxts.put("value", "-");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less interest expense)");
        incomeStmtTxts.put("value", "-");
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Income before Taxes");
        incomeStmtTxts.put("value", appUtil.formatNumber(saleValue.subtract(nv.getNumber(cosPrv))));
        array.add(incomeStmtTxts);

        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;(Less income Tax expense)");
        incomeStmtTxts.put("value", appUtil.formatNumber(taxesTotals));
        array.add(incomeStmtTxts);

        BigDecimal income = saleValue.subtract(nv.getNumber(cosPrv)).subtract(expensesTotals);
        incomeStmtTxts = new JSONObject();
        incomeStmtTxts.put("name", "<b>Net Income</b>");
        incomeStmtTxts.put("value", income.compareTo(BigDecimal.ZERO) < 0 ? appUtil.formatNumber(income) : appUtil.formatNumber(income));
        array.add(incomeStmtTxts);

        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
    int fixedLen = 70;

    String expandString(String txt, String amt) {
        String lConcated = txt.concat(amt);
        int len = lConcated.length();
        while (len < fixedLen) {
            txt = txt.concat("o");
            len = (txt.concat(amt)).length();
        }
        return txt.concat(amt);
    }

}
