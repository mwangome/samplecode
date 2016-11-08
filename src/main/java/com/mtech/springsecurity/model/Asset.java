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
@Table(name = "assets")
public class Asset implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;

    @Column(name = "asset_number")
    String assetNumber;

    @Column(name = "asset_name")
    String assetName;
    
    @Column(name = "trans_ref")
    String transRef;

    @Column(name = "purchase_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date purchaseDate;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    Supplier supplier;
    
    @ManyToOne
    @JoinColumn(name = "customer_id")
    Customer customer;

    @Column(name = "asset_value")
    java.math.BigDecimal assetValue;
    
    @Column(name = "lifespan")
    java.math.BigDecimal lifespan;
    
    @Column(name = "disposalValue")
    java.math.BigDecimal disposalValue = java.math.BigDecimal.ZERO;
    
    @Column(name = "cumulative_depreciation")
    java.math.BigDecimal cumulativeDepreciation = java.math.BigDecimal.ZERO;
    
    @Column(name = "gain_loss")
    java.math.BigDecimal gainLoss = java.math.BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "asset_type")
    AssetType assetType;
    
    @ManyToOne
    @JoinColumn(name = "payment_mode_id")
    PaymentMode paymentMode;

    @Column(name = "grn_number")
    String grnNumber;

    @Column(name = "asset_location")
    String assetLocation;
    
    @Column(name = "description")
    String description;
    
    @Column(name = "is_disposed")
    Boolean disposed;

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

    public String getAssetNumber() {
        return assetNumber;
    }

    public void setAssetNumber(String assetNumber) {
        this.assetNumber = assetNumber;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
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

    public BigDecimal getAssetValue() {
        return assetValue;
    }

    public void setAssetValue(BigDecimal assetValue) {
        this.assetValue = assetValue;
    }

    public AssetType getAssetType() {
        return assetType;
    }

    public void setAssetType(AssetType assetType) {
        this.assetType = assetType;
    }

    public String getGrnNumber() {
        return grnNumber;
    }

    public void setGrnNumber(String grnNumber) {
        this.grnNumber = grnNumber;
    }

    public String getAssetLocation() {
        return assetLocation;
    }

    public void setAssetLocation(String assetLocation) {
        this.assetLocation = assetLocation;
    }

    public PaymentMode getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(PaymentMode paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getTransRef() {
        return transRef;
    }

    public void setTransRef(String transRef) {
        this.transRef = transRef;
    }

    public BigDecimal getLifespan() {
        return lifespan;
    }

    public void setLifespan(BigDecimal lifespan) {
        this.lifespan = lifespan;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getDisposalValue() {
        return disposalValue;
    }

    public void setDisposalValue(BigDecimal disposalValue) {
        this.disposalValue = disposalValue;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public BigDecimal getCumulativeDepreciation() {
        return cumulativeDepreciation;
    }

    public void setCumulativeDepreciation(BigDecimal cumulativeDepreciation) {
        this.cumulativeDepreciation = cumulativeDepreciation;
    }

    public BigDecimal getGainLoss() {
        return gainLoss;
    }

    public void setGainLoss(BigDecimal gainLoss) {
        this.gainLoss = gainLoss;
    }

    public Boolean getDisposed() {
        return disposed;
    }

    public void setDisposed(Boolean disposed) {
        this.disposed = disposed;
    }

    
    
}
