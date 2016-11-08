package com.mtech.springsecurity.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;

import org.hibernate.annotations.WhereJoinTable;

@Entity
@Table(name = "app_role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "created_at")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date createdAt;

    @Column(name = "created_by")
    private Integer created_by;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "role_classification_id")
    private Integer roleClassificationId;

    @Column(name = "role_code")
    private String roleCode;

    @Column(name = "role_name")
    private String roleName;

    @Column(name = "date_deleted")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date dateDeleted;

    @Column(name = "deleted_by")
    private Integer deletedBy;

    @Column(name = "reason_deleted")
    private String reasonDeleted;

    @Column(name = "row_comment")
    private String rowComment;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "lender_role_module",
            joinColumns = {
                @JoinColumn(name = "role_id")},
            inverseJoinColumns = {
                @JoinColumn(name = "module_id")})
    //@WhereJoinTable(clause = "is_deleted='false'")
    private Set<Module> roleModules = new HashSet<Module>();

    @WhereJoinTable(clause = "is_deleted='false'")
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "userRoles")
    private Set<User> users = new HashSet<User>(0);

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreated_at(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getCreated_by() {
        return created_by;
    }

    public void setCreated_by(Integer created_by) {
        this.created_by = created_by;
    }

    public boolean isIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(boolean is_deleted) {
        this.isDeleted = is_deleted;
    }

    public Integer getRoleClassificationId() {
        return roleClassificationId;
    }

    public void setRoleClassificationId(Integer role_classification_id) {
        this.roleClassificationId = role_classification_id;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String role_code) {
        this.roleCode = role_code;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String role_name) {
        this.roleName = role_name;
    }

    public Date getDateDeleted() {
        return dateDeleted;
    }

    public void setDateDeleted(Date date_deleted) {
        this.dateDeleted = date_deleted;
    }

    public Integer getDeletedBy() {
        return deletedBy;
    }

    public void setDeletedBy(Integer deleted_by) {
        this.deletedBy = deleted_by;
    }

    public String getReasonDeleted() {
        return reasonDeleted;
    }

    public void setReasonDeleted(String reason_deleted) {
        this.reasonDeleted = reason_deleted;
    }

    public String getRowComment() {
        return rowComment;
    }

    public void setRowComment(String row_comment) {
        this.rowComment = row_comment;
    }

    public Set<Module> getRoleModules() {
        return roleModules;
    }

    public void setRoleModules(Set<Module> roleModules) {
        this.roleModules = roleModules;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

}
