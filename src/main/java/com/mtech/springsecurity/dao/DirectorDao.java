/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.model.Director;

/**
 *
 * @author derek
 */
public interface DirectorDao {
    Director saveDirector(Director director);
    
    java.util.List<Director> getListOfDirectors();
}
