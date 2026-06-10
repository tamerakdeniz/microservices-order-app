package com.turkcell.product_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.cloud.config.enabled=false",
		"spring.config.import=",
		"eureka.client.enabled=false",
		"spring.cloud.discovery.enabled=false",
		"spring.autoconfigure.exclude=org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration,org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration"
})
class ProductServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
