/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.service;

import com.mtech.springsecurity.dao.PaymentDao;
import com.mtech.springsecurity.model.Payment;
import com.mtech.springsecurity.model.SMEEntity;
import com.mtech.springsecurity.util.AppUtil;
import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author derek
 */
@Service
public class PaymentService {

    @Autowired
    PaymentDao payDao;

    @Autowired
    AppUtil appUtil;

    public Payment savePayment(Payment payment) {
        payment = payDao.savePayment(payment);
        return payment;
    }

    public String getListOfPayments(SMEEntity entity) {
        List<Payment> paymentsList = payDao.getPaymentsList(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (Payment p : paymentsList) {
            object = new JSONObject();
            object.put("id", p.getId());
            object.put("isActive", p.isIsActive());
            object.put("createdAt", appUtil.formatJSDate(p.getCreatedAt()));
            object.put("paymentAmt", p.getPaymentAmt());
            object.put("paymentDate", appUtil.formatJSDate(p.getPaymentDate()));
            object.put("payModeName", p.getPaymentMode() == null ? "" : p.getPaymentMode().getPayModeName());
            object.put("paymentRef", p.getPaymentRef());
            object.put("invoiceRef", p.getPurchase() == null ? "" : p.getPurchase().getInvoiceNumber());
            object.put("registeredName", p.getSmeEntity().getRegisteredName());

            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", paymentsList.size());
        return wrapper.toString();
    }

    public String getListOfAccruals(SMEEntity entity) {
        List<Payment> paymentsList = payDao.getPaymentsListAccruals(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (Payment p : paymentsList) {
            object = new JSONObject();
            object.put("id", p.getId());
            object.put("isActive", p.isIsActive());
            object.put("createdAt", appUtil.formatJSDate(p.getCreatedAt()));
            object.put("paymentAmt", p.getPaymentAmt());
            object.put("paymentDate", appUtil.formatJSDate(p.getPaymentDate()));
            object.put("payModeName", p.getPaymentMode() == null ? "" : p.getPaymentMode().getPayModeName());
            object.put("paymentRef", p.getPaymentRef());
            object.put("invoiceRef", p.getPurchase() == null ? "" : p.getPurchase().getInvoiceNumber());
            object.put("registeredName", p.getSmeEntity().getRegisteredName());

            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", paymentsList.size());
        return wrapper.toString();
    }

    public String getListOfPrepayments(SMEEntity entity) {
        List<Payment> paymentsList = payDao.getPaymentsListPrepayments(entity);
        JSONArray jarray = new JSONArray();
        JSONObject object = null;
        for (Payment p : paymentsList) {
            object = new JSONObject();
            object.put("id", p.getId());
            object.put("isActive", p.isIsActive());
            object.put("createdAt", appUtil.formatJSDate(p.getCreatedAt()));
            object.put("paymentAmt", p.getPaymentAmt());
            object.put("paymentDate", appUtil.formatJSDate(p.getPaymentDate()));
            object.put("payModeName", p.getPaymentMode() == null ? "" : p.getPaymentMode().getPayModeName());
            object.put("paymentRef", p.getPaymentRef());
            object.put("invoiceRef", p.getPurchase() == null ? "" : p.getPurchase().getInvoiceNumber());
            object.put("registeredName", p.getSmeEntity().getRegisteredName());

            jarray.add(object);
        }
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", jarray);
        wrapper.put("totalProperty", paymentsList.size());
        return wrapper.toString();
    }

    public String findPurchase(Long id) {
        Payment p = payDao.findPayment(id);
        JSONObject object = new JSONObject();
        object.put("id", p.getId());
        object.put("isActive", p.isIsActive());
        object.put("createdAt", appUtil.formatJSDate(p.getCreatedAt()));
        object.put("paymentAmt", p.getPaymentAmt());
        object.put("paymentDate", appUtil.formatJSDate(p.getPaymentDate()));
        object.put("payModeName", p.getPaymentMode() == null ? "" : p.getPaymentMode().getPayModeName());
        object.put("paymentRef", p.getPaymentRef());
        object.put("invoiceNumber", p.getPurchase() == null ? "" : p.getPurchase().getInvoiceNumber());
        object.put("registeredName", p.getSmeEntity().getRegisteredName());
        object.put("item", p.getPaymentDescription());
        object.put("accountName", p.getAccounts() == null ? "" : p.getAccounts().getAccountName());
        object.put("prepayments", p.getAccounts() == null ? "" : p.getAccounts().getAccountName());
        object.put("accruals", p.getAccounts() == null ? "" : p.getAccounts().getAccountName());
        JSONObject wrapper = new JSONObject();
        wrapper.put("success", true);
        wrapper.put("data", object);
        wrapper.put("totalProperty", 1);
        return wrapper.toString();
    }
}
