package com.sttl.formbuilder2.service;

import com.sttl.formbuilder2.dto.FieldDefinitionDTO;
import com.sttl.formbuilder2.dto.FormDefinitionDTO;
import com.sttl.formbuilder2.model.entity.Form;
import com.sttl.formbuilder2.model.entity.FormField;
import com.sttl.formbuilder2.model.entity.FormVersion;
import com.sttl.formbuilder2.model.enums.FormStatus;
import com.sttl.formbuilder2.repository.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;
    private final DynamicTableService dynamicTableService;

    @Transactional
    public Form createForm(FormDefinitionDTO request) {
        // 1. Create the Form Entity (Metadata)
        Form form = new Form();
        form.setTitle(request.getTitle());
        form.setDescription(request.getDescription());
        form.setStatus(FormStatus.PUBLISHED); // Auto-publish for MVP

        // Save to get the ID
        form = formRepository.save(form);

        // 2. Create the First Version
        FormVersion version = new FormVersion();
        version.setForm(form);
        version.setVersionNumber(1);

        // 3. Map Fields
        List<FormField> formFields = new ArrayList<>();
        int ordinal = 0;

        for (FieldDefinitionDTO fieldDTO : request.getFields()) {
            FormField field = new FormField();
            field.setFormVersion(version);
            field.setFieldLabel(fieldDTO.getLabel());
            field.setFieldType(fieldDTO.getType());
            field.setIsMandatory(fieldDTO.isRequired());
            field.setValidationRules(fieldDTO.getValidation());
            field.setOrdinalPosition(ordinal++);

            // Generate standard column name (e.g. "first_name")
            String colName = fieldDTO.getLabel().trim().toLowerCase().replaceAll("[^a-z0-9]", "_");
            field.setColumnName(colName);

            formFields.add(field);
        }

        version.setFields(formFields);
        form.getVersions().add(version);

        // Update Form with the target table name
        String dynamicTableName = "sub_" + form.getId() + "_v1";
        form.setTargetTableName(dynamicTableName);

        // Save everything (Cascades will save Version and Fields)
        formRepository.save(form);

        // 4. CRITICAL: Create the Physical Table in DB
        dynamicTableService.createDynamicTable(dynamicTableName, request.getFields());

        return form;
    }
}