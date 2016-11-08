/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.model;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "config_sic_division")
public class Industry implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "code")
    String sicCode;
    
    @Column(name = "name")
    String sicName;
    
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    java.util.Date createdAt;
    
    @Column(name = "is_active")
    boolean isActive;
    
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "industry", cascade = CascadeType.ALL)
    java.util.Set<IndustryGroup> industryGroups;
    
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSicCode() {
        return sicCode;
    }

    public void setSicCode(String sicCode) {
        this.sicCode = sicCode;
    }

    public String getSicName() {
        return sicName;
    }

    public void setSicName(String sicName) {
        this.sicName = sicName;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }   

    public Set<IndustryGroup> getIndustryGroups() {
        return industryGroups;
    }

    public void setIndustryGroups(Set<IndustryGroup> industryGroups) {
        this.industryGroups = industryGroups;
    }
    
}
