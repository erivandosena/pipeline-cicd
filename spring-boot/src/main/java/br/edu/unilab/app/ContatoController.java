package br.edu.unilab.app;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContatoController {
	
	@Autowired
	private ContatoRepository repository;
	
	@RequestMapping(value="/", method=RequestMethod.GET)
	public String home() {
		return "Cadastro";
	}
	
	@RequestMapping(value="/add", method=RequestMethod.PUT)
	public @ResponseBody Contato insert(@RequestBody Contato contato) {
		repository.save(contato);
		return contato;
	}
	
	@RequestMapping(value="/list", method=RequestMethod.GET)
	public List<Contato> get(Long id) {
		List<Contato> result = new ArrayList<Contato>();
		if (id == null) {
			Iterator<Contato> iterator = repository.findAll().iterator();
			while (iterator.hasNext()) {
				result.add(iterator.next());
			}
		} else {
			Contato contato = repository.findOne(id);
			if (contato != null) {
				result.add(contato);
			}
		}
		return result;
	}

}
