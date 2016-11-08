/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mtech.springsecurity.dao;

import com.mtech.springsecurity.enumerate.MappedAccountsEnum;
import com.mtech.springsecurity.model.Accounts;
import com.mtech.springsecurity.model.NorminalAccounts;
import com.mtech.springsecurity.model.RealAccounts;
import java.util.List;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

/**
 *
 * @author derek
 */
@Repository
public class AccountsDaoImpl extends AbstractDao<Long, RealAccounts> implements AccountsDao {

    Logger logger = Logger.getLogger(AccountsDaoImpl.class.getName());

    public RealAccounts saveAccounts(RealAccounts account) {
        persist(account);
        return account;
    }

    public void bootstrapAccounts() {
          if(getAllAccountsList().isEmpty()){
              runScriptTest();
          }
    }

    boolean checkAccountExists(java.util.List<RealAccounts> list, String code) {
        for (RealAccounts ac : list) {
            if (code.equalsIgnoreCase(ac.getCode())) {
                return true;
            }
        }
        return false;
    }

    public java.util.List<RealAccounts> getChartOfAccounts() {
        return getList();
    }

    public RealAccounts findByCode(String code) {
        Criteria criteria = createEntityCriteria();
        criteria.add(Restrictions.eq("code", code));
        List<RealAccounts> list = criteria.list();
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public RealAccounts findByRealAccountByAccountNumber(Integer accountNumber) {
        Criteria criteria = createEntityCriteria();
        criteria.add(Restrictions.eq("accountNumber", accountNumber));
        List<RealAccounts> list = criteria.list();
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<NorminalAccounts> findNorminalsByCode(String code) {
        Session session1 = getSession();
        Criteria criteria = session1.createCriteria(NorminalAccounts.class);
        criteria.add(Restrictions.eq("code", code));
        List<NorminalAccounts> list = criteria.list();

        if (!list.isEmpty()) {
            return list;
        }

        return list;
    }

    public NorminalAccounts saveNorminalAccounts(NorminalAccounts norminalAccounts) {
        Session session1 = getSession();
        if (norminalAccounts.getId() != null) {
            session1.merge(norminalAccounts);
        } else {
            session1.persist(norminalAccounts);
        }
        return norminalAccounts;
    }

    public NorminalAccounts findNorminalsByAccountNumber(String accountNumber) {
        logger.warn("=>:" + accountNumber);

        Session session1 = getSession();
        Criteria criteria = session1.createCriteria(NorminalAccounts.class);
        criteria.add(Restrictions.eq("accountNumber", accountNumber));
        List<NorminalAccounts> list = criteria.list();
        logger.warn("size=>:" + list.size());

        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public RealAccounts findRealAccountById(Long id) {
        return getByKey(id);
    }

    public Accounts saveAccounts(Accounts accounts) {
        Session session1 = getSession();

        if (accounts.getId() == null) {

            session1.persist(accounts);
        } else {
            session1.merge(accounts);
        }
        return accounts;
    }

    public List<Accounts> getAccountsList() {
        List<Accounts> list = getSession().createQuery("from Accounts ac where ac.parentId is null").list();
        return list;
    }

    public List<Accounts> getAllAccountsList() {
        List<Accounts> list = getSession().createQuery("from Accounts").list();
        return list;
    }

    public Accounts findAccount(String description) {
        Session session1 = getSession();
        Query query = session1.createQuery("from Accounts ac where ac.accountName = :description");
        List<Accounts> list = query.setParameter("description", description).list();
        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public List<Accounts> findAccounts(Long parentId) {
        Query query = getSession().createQuery("from Accounts ac where ac.parentId = :parentId");
        List<Accounts> list = query.setParameter("parentId", parentId).list();
        return list;
    }

    public Accounts findById(Long id) {
        Query query = getSession().createQuery("from Accounts ac where ac.id = :parentId");
        List<Accounts> list = query.setParameter("parentId", id).list();
        return list.get(0);
    }

    public boolean findChildOrParentAccounts(Long parentId) {
        Query query = getSession().createQuery("from Accounts ac where ac.id = :parentId");
        List<Accounts> list = query.setParameter("parentId", parentId).list();

        /**
         * parent
         */
        if (!list.isEmpty()) {
            Accounts ac = list.get(0);
            if (ac.getParentId() == null) {
                return true;
            } else {
                Long parentId1 = ac.getParentId();
                Accounts acc = findById(parentId1);
                if (acc.getParentId() == null) {
                    return true;
                }
            }

        }
        return false;
    }

    public java.util.List<Accounts> getChildAccounts(Long parentId) {
        Query query = getSession().createQuery("from Accounts ac where ac.parentId = :id");
        List<Accounts> list = query.setParameter("id", parentId).list();
        return list;
    }

    public void runScriptTest() {
        Query query = getSession().createSQLQuery(
                "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (81, NULL, '1000', 'Assets', NULL);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (82, NULL, '2000', 'Liabilities', NULL);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (83, NULL, '2100', 'Owners/Stockholders'' Equity', NULL);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (84, NULL, '3000', 'Operating Revenues', NULL);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (85, NULL, '3100', 'Operating Expenses', NULL);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (86, NULL, '3200', 'Non-operating Revenues and Gains', NULL);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (87, NULL, '3300', 'Non-operating Expenses and Losses', NULL);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (98, 'Profit and Loss', '329739', 'Tax', 98);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (92, 'Balance Sheet', '85569', 'Cash', 92);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (96, 'Balance Sheet', '10002', 'Mobile Money', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (95, 'Balance Sheet', '10003', 'Bank', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (94, 'Balance Sheet', '10004', 'Debtors', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (90, 'Balance Sheet', '10005', 'Purchases', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (89, 'Balance Sheet', '10006', 'Goods/stocks', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (88, 'Balance Sheet', '10007', 'Fixed Assets', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (236, 'Profit and Loss', '10008', 'Disposal', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (101, 'Balance Sheet', '10009', 'Prepayments', 81);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (93, 'Balance Sheet', '20001', 'Creditors', 82);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (107, 'Balance Sheet', '20002', 'Loans', 82);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (104, 'Balance Sheet', '2101', 'Share capital', 83);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (91, 'Profit and Loss', '30001', 'Sales', 84);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (116, 'Profit and Loss', '30002', 'Retained earnings', 84);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (115, 'Balance Sheet', '30003', 'Dividends', 84);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (99, 'Balance Sheet', '30004', 'Accruals', 84);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (326, 'Profit and Loss', '30006', 'Loss on Disposal', 84);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (325, 'Profit and Loss', '30005', 'Gain on Disposal', 84);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (327, 'Profit and Loss', '30007', 'Disposal', 84);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (109, 'Profit and Loss', '31001', 'Telephone', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (637, 'Profit and Loss', '31002', 'Accumulated Depreciation', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (114, 'Profit and Loss', '31003', 'Other charges', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (110, 'Profit and Loss', '31004', 'Mobile Money Charges', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (113, 'Profit and Loss', '31005', 'Rent and rates', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (112, 'Profit and Loss', '31006', 'Travel and Transport', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (100, 'Balance Sheet', '31007', 'Accruals', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (102, 'Profit and Loss', '31008', 'Miscellaneous Expenses', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (103, 'Profit and Loss', '31009', 'Depreciation', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (105, 'Profit and Loss', '310010', 'Interest charges', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (106, 'Profit and Loss', '310011', 'Bank charges', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (108, 'Profit and Loss', '310012', 'Loan expenses', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (111, 'Profit and Loss', '310013', 'Salaries', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (97, 'Profit and Loss', '310014', 'Tax', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (726, 'Balance Sheet', '100067', 'Bank (Equity)', 95);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (760, 'Profit and Loss', '3100015', 'Carriage Inwards', 85);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (819, 'Balance Sheet', '', 'Mobile Money (Airtel)', 96);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (934, 'Balance Sheet', '310016', 'Outstanding Postage', 100);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (935, 'Balance Sheet', '310017', 'Salaries Expense', 100);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (953, 'Balance Sheet', '310076', 'Electricity Expense', 100);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (962, 'Balance Sheet', '100010', 'Electricity', 101);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (963, 'Balance Sheet', '100012', 'Water', 101);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (1525, 'Balance Sheet', '11', 'Rent', 99);\n"
                + "INSERT INTO \"public\".accounts_table (id, account_class, account_code, account_name, parent_id) \n"
                + "	VALUES (1526, 'Balance Sheet', '332949', 'Rent', 100);"
        );

        query.executeUpdate();
        return;
    }

    /**
     * Get expense accruals
     *
     * @return
     */
    public Accounts findAccrualExpenseAccount() {
        Accounts accrual = findAccount("Operating Expenses");
        Query query = getSession().createQuery("from Accounts ac where ac.parentId = :parentId");
        query.setParameter("parentId", accrual.getId());
        List<Accounts> list = query.list();

        for (Accounts ac : list) {
            if (ac.getAccountName().equalsIgnoreCase(MappedAccountsEnum.Accruals.getDescription())) {
                return ac;
            }
        }
        return null;
    }

    /**
     * Get expense accruals
     *
     * @return
     */
    public Accounts findPrepaidExpenseAccount() {
        Accounts prepayment = findAccount(MappedAccountsEnum.Prepayments.getDescription());
        Query query = getSession().createQuery("from Accounts ac where ac.accountName = :accountName");
        query.setParameter("accountName", prepayment.getAccountName());
        List<Accounts> list = query.list();

        if (!list.isEmpty()) {
            return list.get(0);
        }
        return null;
    }

    public java.util.List<Accounts> getAccrualExpenseChildAccounts() {
        Accounts accrual = findAccrualExpenseAccount();
        Query query = getSession().createQuery("from Accounts ac where ac.parentId = :parentId");
        query.setParameter("parentId", accrual.getId());
        List<Accounts> list = query.list();
        return list;
    }

    public java.util.List<Accounts> getPrepaidExpenseChildAccounts() {
        Accounts prepay = findPrepaidExpenseAccount();
        Query query = getSession().createQuery("from Accounts ac where ac.parentId = :parentId");
        query.setParameter("parentId", prepay.getId());
        List<Accounts> list = query.list();

        return list;
    }

}
