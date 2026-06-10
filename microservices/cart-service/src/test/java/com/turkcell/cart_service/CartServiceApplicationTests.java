package com.turkcell.cart_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.cloud.config.enabled=false",
		"spring.config.import=",
		"eureka.client.enabled=false",
		"spring.cloud.discovery.enabled=false"
})
class CartServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
