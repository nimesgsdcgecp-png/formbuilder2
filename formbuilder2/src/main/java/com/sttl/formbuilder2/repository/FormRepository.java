package com.sttl.formbuilder2.repository;

import com.sttl.formbuilder2.model.entity.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    // You can add custom queries here later, e.g.:
    // List<Form> findByStatus(FormStatus status);
}