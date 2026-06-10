package com.turkcell.eureka_server;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.cloud.config.enabled=false",
		"spring.config.import=",
		"eureka.client.register-with-eureka=false",
		"eureka.client.fetch-registry=false"
})
class EurekaServerApplicationTests {

	@Test
	void contextLoads() {
	}

}
