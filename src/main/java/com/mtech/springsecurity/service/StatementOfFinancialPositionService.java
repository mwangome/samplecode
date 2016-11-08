/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.enumerate.DrCrEnum;
import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import com.mtech.springsecurity.util.NumberValue;
import java.math.BigDecimal;
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
public class StatementOfFinancialPositionService {
    Logger logger = Logger.getLogger(StatementOfFinancialPositionService.class);
    @Autowired
    AccountTransactionsService atService;
    
    @Autowired
    NumberValue nv;
    
    @Autowired
    AppUtil appUtil;
    
    @Autowired
    IncomeStatementService isService;
    
    @Autowired
    StockLedgerService slService;
    
    public String prepareStatementOfFinancialPosition(SMEEntity entity){
        JSONArray array = new JSONArray();
        
        JSONObject sfpNarration = new JSONObject();
        
        JSONObject wrapper = new JSONObject(); 
        
        sfpNarration.put("name", "<b>Assets</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Non-current Assets</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        BigDecimal property = atService.getAggregateForAccountDrCr(entity, MappedAccountsEnum.FixedAssets.getDescription(), DrCrEnum.Dr.name());
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Property, plant and equipment");
        sfpNarration.put("value", appUtil.formatNumber(nv.getNumber(property)));
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Goodwill");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Long-term investments");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Total Non Current assets</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Current assets</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        BigDecimal cashAndEquiv = nv.getNumber(atService.getAggregateForAccountDrCr(entity, MappedAccountsEnum.Bank.getDescription(), DrCrEnum.Dr.name()))
                .add(nv.getNumber(atService.getAggregateForAccountDrCr(entity, MappedAccountsEnum.Cash.getDescription(), DrCrEnum.Dr.name())))
                .add(nv.getNumber(atService.getAggregateForAccountDrCr(entity, MappedAccountsEnum.Mobile.getDescription(), DrCrEnum.Dr.name())));
        
        //Reduces cash
        BigDecimal taxPaid = atService.getAggregateForAccount(entity, MappedAccountsEnum.Tax.getDescription(), DrCrEnum.Dr.name());
        
        //cashAndEquiv = cashAndEquiv.subtract(nv.getNumber(taxPaid));
        
        BigDecimal accountsReceivable = atService.getAggregateForAccountDrCr(entity, MappedAccountsEnum.Debtors.getDescription(), DrCrEnum.Dr.name());
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "Cash and cash equivalents");
        sfpNarration.put("value", 
                cashAndEquiv.compareTo(BigDecimal.ZERO)<0? appUtil.formatNumber(cashAndEquiv) : appUtil.formatNumber(cashAndEquiv));
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Short-term investments");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Accounts receivable");
        sfpNarration.put("value",  appUtil.formatNumber(nv.getNumber(accountsReceivable)) );
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Tax receivable");
        sfpNarration.put("value",  appUtil.formatNumber(nv.getNumber(taxPaid)) );
        array.add(sfpNarration);
        
        BigDecimal closingStockValue = slService.getTotalClosingInventory(entity);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Inventories");
        sfpNarration.put("value", appUtil.formatNumber(closingStockValue));
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Deferred income taxes");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        BigDecimal prepayments = atService.computePrepayments(entity);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Prepaid expenses and other current assets");
        sfpNarration.put("value", appUtil.formatNumber(prepayments));
        array.add(sfpNarration);
        
        BigDecimal totalCurrentAssets = closingStockValue.add(cashAndEquiv).add(nv.getNumber(accountsReceivable)).add(nv.getNumber(prepayments)).add(nv.getNumber(taxPaid));
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;<b>Total Current assets</b>");
        sfpNarration.put("value", "<b>" +appUtil.formatNumber(totalCurrentAssets) +"</b>");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Total assets</b>");
        sfpNarration.put("value", "<b><u>" + appUtil.formatNumber(closingStockValue.add(cashAndEquiv).add(nv.getNumber(accountsReceivable)).add(nv.getNumber(property)).add(nv.getNumber(prepayments)).add(nv.getNumber(taxPaid))) + "</u></b>");
        array.add(sfpNarration);
        
        logger.warn(
                "\n\tclosing stock::" + closingStockValue + 
                "\n\tcash::" + cashAndEquiv +
                "\n\taccounts receivables::" + accountsReceivable +
                "\n\tproperty::" + property +
                "\n\tprepayments::" + prepayments
        );
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Equity and liabilities</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Share capital and reserves</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Share capital");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Revaluation surplus");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        BigDecimal income = isService.computeIncome(entity);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Retained earnings");
        sfpNarration.put("value", income.compareTo(BigDecimal.ZERO)<0?appUtil.formatNumber(income):appUtil.formatNumber(income));
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Equity attributable to owners of the company");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Total equity</b>");
        sfpNarration.put("value", income.compareTo(BigDecimal.ZERO)<0?"<b>" +appUtil.formatNumber(income)+"</b>":"<b>" +appUtil.formatNumber(income)+"</b>");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Non Current liability</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Long-term debt");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Accrued retirement costs");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Deferred income taxes");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Current Liabilities</b>");
        sfpNarration.put("value", "");
        array.add(sfpNarration);
        
        BigDecimal taxPayable = atService.getAggregateForAccount(entity, MappedAccountsEnum.Tax.getDescription(), DrCrEnum.Cr.name());
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Tax payble");
        sfpNarration.put("value", appUtil.formatNumber(nv.getNumber(taxPayable)));
        array.add(sfpNarration);
        
        BigDecimal accruals = atService.computeAccruals(entity);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Accounts payable and accrued expenses");
        sfpNarration.put("value", appUtil.formatNumber(accruals));
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Income taxes payable");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        BigDecimal tradePayable = atService.getAggregateForAccount(entity, MappedAccountsEnum.Creditors.getDescription(), DrCrEnum.Cr.name())
                .subtract(atService.getAggregateForAccount(entity, MappedAccountsEnum.Creditors.getDescription(), DrCrEnum.Dr.name()));
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Trade and other payables");
        sfpNarration.put("value", appUtil.formatNumber(nv.getNumber(tradePayable)));
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "&nbsp;&nbsp;&nbsp;&nbsp;Short-term loans and current portion long-term debt");
        sfpNarration.put("value", "0.00");
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Total Current Liabilities</b>");
        sfpNarration.put("value", appUtil.formatNumber(nv.getNumber(taxPayable).add(nv.getNumber(accruals)).add(tradePayable)));
        array.add(sfpNarration);
        
        sfpNarration = new JSONObject();
        sfpNarration.put("name", "<b>Total equity and liabilities</b>");
        sfpNarration.put("value", "<b><u>" + appUtil.formatNumber(nv.getNumber(taxPayable).add(income).add(nv.getNumber(accruals)).add(tradePayable)) + "</u></b>");
        array.add(sfpNarration);
        
        logger.warn("taxpayable:" + taxPayable + ":accruals:" + accruals + ":tradepayable:" + tradePayable);
        wrapper.put("success", true);
        wrapper.put("data", array);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
