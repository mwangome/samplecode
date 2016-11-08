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
@Table(name = "sales")
public class Sale implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "sale_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date saleDate;
    
    @Column(name = "sales_ref_number")
    String salesRefNumber;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @ManyToOne
    @JoinColumn(name = "stock_id")
    StockItem stock;
    
    @ManyToOne
    @JoinColumn(name = "store_id")
    Store store;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    Customer customer;

    @ManyToOne
    @JoinColumn(name = "payment_mode_id")
    PaymentMode paymentMode;
    
    @Column(name = "delivery_note")
    String deliveryNote;
    
    @Column(name = "barcode")
    String barcode;
    
    @Column(name = "quantity")
    BigDecimal quantity;
    
    @Column(name = "unit_price")
    BigDecimal unitPrice;
    
    @Column(name = "sales_value")
    BigDecimal salesValue;
    
    @Column(name = "vat")
    BigDecimal vat;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(Date saleDate) {
        this.saleDate = saleDate;
    }

    public String getSalesRefNumber() {
        return salesRefNumber;
    }

    public void setSalesRefNumber(String salesRefNumber) {
        this.salesRefNumber = salesRefNumber;
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

    public void setStock(StockItem stockId) {
        this.stock = stockId;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public PaymentMode getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(PaymentMode paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getDeliveryNote() {
        return deliveryNote;
    }

    public void setDeliveryNote(String deliveryNote) {
        this.deliveryNote = deliveryNote;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getSalesValue() {
        return salesValue;
    }

    public void setSalesValue(BigDecimal salesValue) {
        this.salesValue = salesValue;
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
