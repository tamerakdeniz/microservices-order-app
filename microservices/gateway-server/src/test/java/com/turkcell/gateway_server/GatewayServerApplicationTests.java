package com.turkcell.gateway_server;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.cloud.config.enabled=false",
		"spring.config.import=",
		"eureka.client.enabled=false",
		"spring.cloud.discovery.enabled=false"
})
class GatewayServerApplicationTests {

	@Test
	void contextLoads() {
	}

}
