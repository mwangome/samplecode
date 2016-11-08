/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "purchases")
public class Purchase implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "purchase_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date purchaseDate;

    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    Supplier supplier;
    
    @ManyToOne
    @JoinColumn(name = "stock_id")
    StockItem stock;

    @ManyToOne
    @JoinColumn(name = "payment_mode")
    PaymentMode paymentMode;

    @ManyToOne
    @JoinColumn(name = "store_id")
    Store store;

    @Column(name = "invoice_number")
    String invoiceNumber;
    
    @Column(name = "document_name")
    String documentName;
    
    @Column(name = "barcode")
    String barcode;

    @Column(name = "quantity")
    BigDecimal quantity;

    @Column(name = "unit_cost")
    BigDecimal unitCost;
    
    @Column(name = "carriage_inwards")
    BigDecimal carriageInwards;

    @Column(name = "grn_number")
    String grnNumber;

    @Column(name = "purchase_value")
    BigDecimal purchaseValue;
    
    @Column(name = "vat")
    BigDecimal vat;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Date purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public PaymentMode getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(PaymentMode paymentMode) {
        this.paymentMode = paymentMode;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store storeId) {
        this.store = storeId;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(BigDecimal unitCost) {
        this.unitCost = unitCost;
    }

    public String getGrnNumber() {
        return grnNumber;
    }

    public void setGrnNumber(String grnNumber) {
        this.grnNumber = grnNumber;
    }

    public BigDecimal getPurchaseValue() {
        return purchaseValue;
    }

    public void setPurchaseValue(BigDecimal purchaseValue) {
        this.purchaseValue = purchaseValue;
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

    public String getDocumentName() {
        return documentName;
    }

    public void setDocumentName(String documentName) {
        this.documentName = documentName;
    }

    public BigDecimal getCarriageInwards() {
        return carriageInwards;
    }

    public void setCarriageInwards(BigDecimal carriageInwards) {
        this.carriageInwards = carriageInwards;
    }

    public BigDecimal getVat() {
        return vat;
    }

    public void setVat(BigDecimal vat) {
        this.vat = vat;
    }   

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }
    
    

}
