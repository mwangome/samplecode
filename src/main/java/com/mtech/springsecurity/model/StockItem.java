/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
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
@Table(name = "stocks")
public class StockItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "stock_code")
    String stockCode;

    @Column(name = "stock_name")
    String stockName;

    @Column(name = "description")
    String description;

    @Column(name = "vatable")
    boolean vatable;

    @ManyToOne
    @JoinColumn(name = "unit_of_issue")
    UnitOfIssue unitOfIssue;

    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;
    
    @ManyToOne
    @JoinColumn(name = "sic_group_id")
    IndustryGroup industryGroup;
    
    @Column(name = "barcode")
    String barcode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStockCode() {
        return stockCode;
    }

    public void setStockCode(String stockCode) {
        this.stockCode = stockCode;
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public UnitOfIssue getUnitOfIssue() {
        return unitOfIssue;
    }

    public void setUnitOfIssue(UnitOfIssue unitOfIssue) {
        this.unitOfIssue = unitOfIssue;
    }

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isVatable() {
        return vatable;
    }

    public void setVatable(boolean vatable) {
        this.vatable = vatable;
    }

    public IndustryGroup getIndustryGroup() {
        return industryGroup;
    }

    public void setIndustryGroup(IndustryGroup industryGroup) {
        this.industryGroup = industryGroup;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    
}
