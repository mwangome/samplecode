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
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 *
 * @author derek
 */
@Entity
@Table(name = "SME_Line_of_business")
public class LineOfBusiness implements Serializable{
    
    private static final long serialVersionUID = 1L;
    
    @Id@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "line_of_business")
    String lineOfBusiness;
    
    @Column(name = "share_of_business")
    String shareOfBusiness;
    
    @OneToOne
    @JoinColumn(name = "sme_id")
    SMEEntity  smeEntity;
    
    @OneToOne
    @JoinColumn(name = "industry_group_id")
    IndustryGroup  industryGroup;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLineOfBusiness() {
        return lineOfBusiness;
    }

    public void setLineOfBusiness(String lineOfBusiness) {
        this.lineOfBusiness = lineOfBusiness;
    }

    public String getShareOfBusiness() {
        return shareOfBusiness;
    }

    public void setShareOfBusiness(String shareOfBusiness) {
        this.shareOfBusiness = shareOfBusiness;
    }

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    }      

    public IndustryGroup getIndustryGroup() {
        return industryGroup;
    }

    public void setIndustryGroup(IndustryGroup industryGroup) {
        this.industryGroup = industryGroup;
    }    
        
}
