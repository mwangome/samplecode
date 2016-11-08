package com.mtech.springsecurity.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import org.hibernate.annotations.WhereJoinTable;

@Entity
@Table(name = "APP_USER")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "FIRST_NAME", nullable = false)
    private String firstName;

    @Column(name = "LAST_NAME", nullable = false)
    private String lastName;

    @Column(name = "email_address", nullable = false)
    private String email;

    @Column(name = "STATE", nullable = false)
    private String state = State.ACTIVE.getState();

    @Column(name = "status_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    private java.util.Date statusDate;

    @Column(name = "reset_password")
    boolean passwordReset;

    /**
     *
     * unify
     */
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date createdAt;

    @JsonIgnore
    @Column(name = "created_by")
    private Integer createdBy;

    @JsonIgnore
    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "username")
    private String username;

    @Column(name = "other_name")
    private String otherName;

    @Column(name = "mobile_phone_number")
    private String mobilePhoneNumber;

    @Column(name = "is_first_login")
    private boolean isFirstLogin;

    @Column(name = "last_login_date")
    private Date lastLoginDate;

    @Column(name = "is_staff")
    private boolean isStaff;

    @Column(name = "active_state_id")
    private Integer activeStateId;

    @Column(name = "is_lender")
    private boolean isLender;

    @Column(name = "is_sme")
    private boolean isSme;

    @Column(name = "last_modified")
    private Date lastModified;
    @JsonIgnore
    @Column(name = "date_deleted")
    private Date dateDeleted;
    @JsonIgnore
    @Column(name = "deleted_by")
    private Integer deletedBy;
    @JsonIgnore
    @Column(name = "reason_deleted")
    private String reasonDeleted;
    @JsonIgnore
    @Column(name = "row_comment")
    private String rowComment;

//    @ManyToMany(fetch = FetchType.EAGER)
//    @JoinTable(name = "APP_USER_USER_PROFILE",
//            joinColumns = {
//                @JoinColumn(name = "USER_ID")},
//            inverseJoinColumns = {
//                @JoinColumn(name = "USER_PROFILE_ID")})
//    private Set<UserProfile> userProfiles = new HashSet<UserProfile>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "app_user_role", joinColumns = {
        @JoinColumn(name = "user_id")}, inverseJoinColumns = {
        @JoinColumn(name = "role_id")})
    //@WhereJoinTable(clause = "is_deleted='false'")
    private Set<Role> userRoles = new HashSet<Role>();

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "users")
    private Set<Module> modules = new HashSet<Module>();

    @ManyToOne
    @JoinColumn(name = "sme_id")
    SMEEntity smeEntity;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    SMEBranch branch;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

//    public Set<UserProfile> getUserProfiles() {
//        return userProfiles;
//    }

    public SMEEntity getSmeEntity() {
        return smeEntity;
    }

    public void setSmeEntity(SMEEntity smeEntity) {
        this.smeEntity = smeEntity;
    }

    public SMEBranch getBranch() {
        return branch;
    }

    public void setBranch(SMEBranch branchId) {
        this.branch = branchId;
    }

//    public void setUserProfiles(Set<UserProfile> userProfiles) {
//        this.userProfiles = userProfiles;
//    }

    public boolean isPasswordReset() {
        return passwordReset;
    }

    public void setPasswordReset(boolean passwordReset) {
        this.passwordReset = passwordReset;
    }

    public Set<Module> getModules() {
        return modules;
    }

    public void setModules(Set<Module> modules) {
        this.modules = modules;
    }

    public Date getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(Date statusDate) {
        this.statusDate = statusDate;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        Long result = 1L;
        result = prime * result + id;
        return result.intValue();
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public boolean isIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOtherName() {
        return otherName;
    }

    public void setOtherName(String otherName) {
        this.otherName = otherName;
    }

    public String getMobilePhoneNumber() {
        return mobilePhoneNumber;
    }

    public void setMobilePhoneNumber(String mobilePhoneNumber) {
        this.mobilePhoneNumber = mobilePhoneNumber;
    }

    public boolean isIsFirstLogin() {
        return isFirstLogin;
    }

    public void setIsFirstLogin(boolean isFirstLogin) {
        this.isFirstLogin = isFirstLogin;
    }

    public Date getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(Date lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public boolean isIsStaff() {
        return isStaff;
    }

    public void setIsStaff(boolean isStaff) {
        this.isStaff = isStaff;
    }

    public Integer getActiveStateId() {
        return activeStateId;
    }

    public void setActiveStateId(Integer activeStateId) {
        this.activeStateId = activeStateId;
    }

    public boolean isIsLender() {
        return isLender;
    }

    public void setIsLender(boolean isLender) {
        this.isLender = isLender;
    }

    public boolean isIsSme() {
        return isSme;
    }

    public void setIsSme(boolean isSme) {
        this.isSme = isSme;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    public Date getDateDeleted() {
        return dateDeleted;
    }

    public void setDateDeleted(Date dateDeleted) {
        this.dateDeleted = dateDeleted;
    }

    public Integer getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(Integer deletedBy) {
        this.deletedBy = deletedBy;
    }

    public String getReasonDeleted() {
        return reasonDeleted;
    }

    public void setReasonDeleted(String reasonDeleted) {
        this.reasonDeleted = reasonDeleted;
    }

    public String getRowComment() {
        return rowComment;
    }

    public void setRowComment(String rowComment) {
        this.rowComment = rowComment;
    }

    public Set<Role> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(Set<Role> userRoles) {
        this.userRoles = userRoles;
    }
    
    

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof User)) {
            return false;
        }
        User other = (User) obj;
        if (id != other.id) {
            return false;
        }

        return true;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", password=" + password
                + ", firstName=" + firstName + ", lastName=" + lastName
                + ", email=" + email + ", state=" + state + ", userProfiles=" + userRoles + "]";
    }

}
