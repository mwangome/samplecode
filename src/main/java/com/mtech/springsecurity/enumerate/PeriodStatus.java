/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.enumerate;

/**
 *
 * @author mwangome
 */
public enum PeriodStatus {
    OPEN ("Open"), CLOSED("Closed");
    String description;
    PeriodStatus(String description){
        this.description = description;
    }
}
