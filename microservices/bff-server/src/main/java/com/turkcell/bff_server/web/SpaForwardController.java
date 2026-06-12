package com.turkcell.bff_server.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping("/")
    public String forwardRootToSpa() {
        return "forward:/index.html";
    }
}
