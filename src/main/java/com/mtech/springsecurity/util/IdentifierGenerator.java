/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.util;

import java.security.SecureRandom;
import java.math.BigInteger;
import org.springframework.stereotype.Component;

/**
 *
 * @author derek
 */
@Component
public class IdentifierGenerator {

    private SecureRandom random;

    public String nextId() {
        random  = new SecureRandom();
        return new BigInteger(36, random).toString(32);
    }
}
