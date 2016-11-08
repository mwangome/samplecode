/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import com.mtech.springsecurity.enumerate.PeriodStatus;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author mwangome
 */
@Entity
@Table(name = "accounting_periods")
public class AccountingPeriod implements Serializable {
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    
    @Column(name = "seq")
    Integer sequence;
    
    @Column(name = "start_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date startDate;
    
    @Column(name = "end_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    java.util.Date endDate;
    
    @Column(name = "period_status")
    @Enumerated(EnumType.STRING)
    PeriodStatus status;
    
    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity entity;
    
    @Column(name = "batchNumber")
    Integer batchNumber;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endtDate) {
        this.endDate = endtDate;
    }   

    public PeriodStatus getStatus() {
        return status;
    }

    public void setStatus(PeriodStatus status) {
        this.status = status;
    }

    public SMEEntity getEntity() {
        return entity;
    }

    public void setEntity(SMEEntity entity) {
        this.entity = entity;
    }

    public Integer getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(Integer batchNumber) {
        this.batchNumber = batchNumber;
    }   
    
    
}
