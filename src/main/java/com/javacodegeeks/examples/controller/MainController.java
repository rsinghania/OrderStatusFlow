package com.javacodegeeks.examples.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.jms.JMSException;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class MainController {

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String homepage() {
		return "index";
	}

	@RequestMapping(value = "latestOrders", method = RequestMethod.GET)
	public @ResponseBody List<Order> checkLatestOrder() throws JMSException {
		Order order = null;
		ObjectMapper mapper = new ObjectMapper();
		try {
			// Convert JSON string to Object
			String jsonInString = "{\"orderId\":\"123124\",\"items\":[{\"itemName\":\"Developer\",\"itemQuantity\":\"2\"},{\"itemName\":\"Developer1\",\"itemQuantity\":\"1\"}]}";
			order = mapper.readValue(jsonInString, Order.class);
			Random r = new Random(); 
			int x = r.nextInt(1000);
			order.setOrderId(x);
			
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		List<Order> orderList = new ArrayList<Order>();
		orderList.add(order);
		return orderList;
	}
}
