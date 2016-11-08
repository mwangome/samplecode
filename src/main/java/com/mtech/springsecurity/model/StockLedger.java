/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "stocks_ledger")
public class StockLedger implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; 
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @ManyToOne
    @JoinColumn(name = "stock_id")
    StockItem stock;
    
    @ManyToOne
    @JoinColumn(name = "unit_of_issue_id")
    UnitOfIssue unitOfIssue;
    
    @Column(name = "transaction_type")
    String transactionType;    
    
    @ManyToOne
    @JoinColumn(name = "store_id")
    Store store;
    
    @Column(name = "average_unit_cost")
    java.math.BigDecimal avarageUnitCost;
    
    @Column(name = "average_unit_price")
    java.math.BigDecimal avarageUnitPrice;
    
    @Column(name = "qty_balance")
    java.math.BigDecimal qtyBalance;
    
    @Column(name = "mvt_value")
    java.math.BigDecimal movementValue;
    
    @Column(name = "mvt_qty")
    java.math.BigDecimal movementQty;
    
    @Column(name = "running_sale")
    java.math.BigDecimal runningSale;
    
    @Column(name = "closing_value")
    java.math.BigDecimal closingValue;
    
    @Column(name = "vat")
    java.math.BigDecimal vat;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    }

    public StockItem getStock() {
        return stock;
    }

    public void setStock(StockItem stock) {
        this.stock = stock;
    }

    public UnitOfIssue getUnitOfIssue() {
        return unitOfIssue;
    }

    public void setUnitOfIssue(UnitOfIssue unitOfIssue) {
        this.unitOfIssue = unitOfIssue;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public BigDecimal getAvarageUnitCost() {
        return avarageUnitCost;
    }

    public void setAvarageUnitCost(BigDecimal avarageUnitCost) {
        this.avarageUnitCost = avarageUnitCost;
    }

    public BigDecimal getAvarageUnitPrice() {
        return avarageUnitPrice;
    }

    public void setAvarageUnitPrice(BigDecimal avarageUnitPrice) {
        this.avarageUnitPrice = avarageUnitPrice;
    }

    public BigDecimal getQtyBalance() {
        return qtyBalance;
    }

    public void setQtyBalance(BigDecimal qtyBalance) {
        this.qtyBalance = qtyBalance;
    }  

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    } 

    public BigDecimal getMovementValue() {
        return movementValue;
    }

    public void setMovementValue(BigDecimal movementValue) {
        this.movementValue = movementValue;
    }

    public BigDecimal getMovementQty() {
        return movementQty;
    }

    public void setMovementQty(BigDecimal movementQty) {
        this.movementQty = movementQty;
    }

    public BigDecimal getClosingValue() {
        return closingValue;
    }

    public void setClosingValue(BigDecimal closingValue) {
        this.closingValue = closingValue;
    }  

    public BigDecimal getRunningSale() {
        return runningSale;
    }

    public void setRunningSale(BigDecimal runningSale) {
        this.runningSale = runningSale;
    }

    public BigDecimal getVat() {
        return vat;
    }

    public void setVat(BigDecimal vat) {
        this.vat = vat;
    }
    
    
    
}
