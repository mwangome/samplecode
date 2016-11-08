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
@Table(name = "stock_transfers")
public class StockTransfer implements Serializable {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "transfer_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date transferDate;
    
    @ManyToOne
    @JoinColumn(name = "stock_id")
    StockItem stock;
    
    @ManyToOne
    @JoinColumn(name = "store_from")
    Store storeFrom;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @ManyToOne
    @JoinColumn(name = "store_to")
    Store storeTo;
    
    @Column(name = "quantity")
    java.math.BigDecimal quantity;
    
    @Column(name = "delivery_note")
    String deliveryNote;
    
    @Column(name = "receipt_note")
    String receiptNote;
    
    @Column(name = "created_by")
    String createdBy;
    
    @Column(name = "received_by")
    String receivedBy;
    
    @Column(name = "receipt_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date receiptDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getTransferDate() {
        return transferDate;
    }

    public void setTransferDate(Date transferDate) {
        this.transferDate = transferDate;
    }

    public StockItem getStock() {
        return stock;
    }

    public void setStock(StockItem stock) {
        this.stock = stock;
    }

    public Store getStoreFrom() {
        return storeFrom;
    }

    public void setStoreFrom(Store storeFrom) {
        this.storeFrom = storeFrom;
    }

    public Store getStoreTo() {
        return storeTo;
    }

    public void setStoreTo(Store storeTo) {
        this.storeTo = storeTo;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public String getDeliveryNote() {
        return deliveryNote;
    }

    public void setDeliveryNote(String deliveryNote) {
        this.deliveryNote = deliveryNote;
    }

    public String getReceiptNote() {
        return receiptNote;
    }

    public void setReceiptNote(String receiptNote) {
        this.receiptNote = receiptNote;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getReceivedBy() {
        return receivedBy;
    }

    public void setReceivedBy(String receivedBy) {
        this.receivedBy = receivedBy;
    }

    public Date getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(Date receiptDate) {
        this.receiptDate = receiptDate;
    }

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    }
    
    
    
}
