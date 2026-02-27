package com.sttl.formbuilder2.controller;

import com.sttl.formbuilder2.dto.FormDefinitionDTO;
import com.sttl.formbuilder2.model.entity.Form;
import com.sttl.formbuilder2.service.FormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;

    // POST http://localhost:8080/api/forms
    @PostMapping
    public ResponseEntity<Form> createForm(@RequestBody FormDefinitionDTO request) {
        Form createdForm = formService.createForm(request);
        return ResponseEntity.ok(createdForm);
    }

    // GET http://localhost:8080/api/forms (Optional: to list forms)
    // @GetMapping ...
}