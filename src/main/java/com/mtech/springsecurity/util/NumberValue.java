/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.util;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

/**
 *
 * @author derek
 */
@Component
public class NumberValue {
    Logger logger = Logger.getLogger(NumberValue.class);
    public java.math.BigDecimal getNumber(Object value){
        String numString = String.valueOf(value);
        try{
            return new java.math.BigDecimal(numString);
        }catch(Exception x){
            logger.warn(x);
        }
        return java.math.BigDecimal.ZERO;
    }
}
