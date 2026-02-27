package com.sttl.formbuilder2.service;

import com.sttl.formbuilder2.dto.FieldDefinitionDTO;
import com.sttl.formbuilder2.model.enums.FieldType;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DynamicTableService {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Generates and executes the CREATE TABLE statement for a new form.
     * Table Name Format: sub_{formId}_v{version}
     */
    @Transactional
    public void createDynamicTable(String tableName, List<FieldDefinitionDTO> fields) {
        StringBuilder sql = new StringBuilder();

        // 1. Start CREATE TABLE
        sql.append("CREATE TABLE ").append(tableName).append(" (");

        // 2. Add Standard System Columns
        sql.append("submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), ");
        sql.append("submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, ");

        // 3. Loop through fields and map to SQL types
        for (FieldDefinitionDTO field : fields) {
            String columnName = generateColumnName(field.getLabel());
            String sqlType = mapToSqlType(field.getType());

            sql.append(columnName).append(" ").append(sqlType).append(", ");
        }

        // 4. Clean up trailing comma and close
        if (!fields.isEmpty()) {
            sql.setLength(sql.length() - 2); // Remove last ", "
        }
        sql.append(");");

        // 5. Execute the DDL
        System.out.println("Executing DDL: " + sql.toString()); // For debugging
        jdbcTemplate.execute(sql.toString());
    }

    // Helper: Converts "First Name" -> "first_name"
    private String generateColumnName(String label) {
        return label.trim().toLowerCase().replaceAll("[^a-z0-9]", "_");
    }

    // Helper: Maps Java Enums to PostgreSQL Types
    private String mapToSqlType(FieldType type) {
        return switch (type) {
            case TEXT -> "VARCHAR(255)";
            case NUMERIC -> "NUMERIC(19, 2)"; // Handles money and decimals
            case DATE -> "DATE";
            case BOOLEAN -> "BOOLEAN";
            case TEXTAREA -> "TEXT";
            default -> "VARCHAR(255)";
        };
    }
}