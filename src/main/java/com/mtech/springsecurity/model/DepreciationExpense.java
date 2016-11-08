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
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 *
 * @author mwangome
 */
@Entity
@Table(name = "depreciation_expense")
public class DepreciationExpense implements Serializable {

    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "asset_id")
    Asset asset;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity entity;
    
    @OneToOne
    @JoinColumn(name = "ap_id")
    AccountingPeriod period;
    
    @Column(name = "depreciation")
    java.math.BigDecimal depreciation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public AccountingPeriod getPeriod() {
        return period;
    }

    public void setPeriod(AccountingPeriod period) {
        this.period = period;
    }  

    public BigDecimal getDepreciation() {
        return depreciation;
    }

    public void setDepreciation(BigDecimal depreciation) {
        this.depreciation = depreciation;
    }   

    public SMEEntity getEntity() {
        return entity;
    }

    public void setEntity(SMEEntity entity) {
        this.entity = entity;
    }
    
    
}
