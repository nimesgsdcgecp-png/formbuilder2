package com.sttl.formbuilder2.dto;

import lombok.Data;
import java.util.List;

@Data
public class FormDefinitionDTO {
    private String title;
    private String description;
    private List<FieldDefinitionDTO> fields;
}