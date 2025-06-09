  class Weapon {
    constructor(name, color, size) {
      this.name = name;
      this.color = color;
      this.size = size;
    }
  }
  class WeaponCollection {
    constructor(name, color, sizes) {
      const weapons = Object.fromEntries(
        sizes.map(size => [size, new Weapon(name, color, size)])
      );
      
      return new Proxy({}, {
        get: (_, prop) => prop === name ? weapons : weapons[prop],
        has: (_, prop) => prop in weapons || prop === name,
        ownKeys: () => [name],
        getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true })
      });
    }
  }
  const createWeapon = (...args) => { 
  const size = args.pop();
  return Array.isArray(size)
    ? new WeaponCollection(...args, size)
    : new Weapon(...args, size);
};
function getWeapons(list) {
  return list.map(([name, altOrAlts]) => {
    const weapon = Weapons[name];
    if (!weapon) throw new Error(`Arma não encontrada: ${name}`);

    // Se for uma arma única
    if (weapon instanceof Weapon) {
      if (Array.isArray(altOrAlts)) {
        throw new Error(`"${name}" é uma arma única e não aceita variações`);
      }
      return weapon;
    }

    // Se for uma coleção e receber array de sizes
    if (Array.isArray(altOrAlts)) {
      // Verifica se é mesmo uma coleção válida
      if (!weapon[name]) throw new Error(`"${name}" não é uma coleção válida`);
      
      // Filtra apenas as variações existentes
      const availableAlts = altOrAlts.filter(size => weapon[name][size]);
      if (availableAlts.length === 0) {
        throw new Error(`Nenhuma variação válida encontrada para ${name}. Opções: ${Object.keys(weapon[name]).join(', ')}`);
      }
      
      // Pega a cor da primeira variação existente
      const firstAlt = Object.keys(weapon[name])[0];
      return createWeapon(name, weapon[name][firstAlt].color, availableAlts);
    }

    // Se for pedir uma variação específica
    if (!altOrAlts) throw new Error(`"${name}" requer variação: ${Object.keys(weapon[name]).join(', ')}`);
    if (!weapon[name][altOrAlts]) throw new Error(`Variação inválida para ${name}. Use: ${Object.keys(weapon[name]).join(', ')}`);
    
    return weapon[name][altOrAlts];
  });
}


const Weapons = {
  // Armas sem tamanho definido
  "Calibre 12":             createWeapon("Calibre 12", "#ffffff", "Sem tamanho"),
  "Sniper":                 createWeapon("Sniper", "#ffffff", "Sem tamanho"),
  "Pistola":                createWeapon("Pistola", "#ffffff", "Sem tamanho"),
  "Orbe":                   createWeapon("Orbe", "#ffffff", "Sem tamanho"),
  "Cajado":                 createWeapon("Cajado", "#ffffff", "Sem tamanho"),
  "Grimório":               createWeapon("Grimório", "#ffffff", "Sem tamanho"),
  "Luvas/botas de batalha": createWeapon("Luvas/botas de batalha", "#ffffff", "Sem tamanho"),
  
  // Armas com tamanhos variáveis
  "Espada":            createWeapon("Espada", "#ffffff", ["Pequeno", "Médio", "Grande"]),

  "Martelo de guerra": createWeapon("Martelo de guerra", "#ffffff", ["Médio", "Grande"]),
  "Martelo de Guerra": createWeapon("Martelo de Guerra", "#ffffff", ["Médio", "Grande"]), //Erro chato por causa de um caractere em maisculo.

  "Machado":           createWeapon("Machado", "#ffffff", ["Médio", "Grande"]),
  "Maça":              createWeapon("Maça", "#ffffff", ["Médio", "Grande"]),
  "Clava":             createWeapon("Clava", "#ffffff", ["Médio", "Grande"]),
  "Adaga":             createWeapon("Adaga", "#ffffff", "Pequeno"),
  "Kunai":             createWeapon("Kunai", "#ffffff", "Pequeno"),
  "Lança":             createWeapon("Lança", "#ffffff", ["Médio", "Grande"]),
  "Besta":             createWeapon("Besta", "#ffffff", ["Médio", "Pequeno"]),
  "Foice":             createWeapon("Foice", "#ffffff", ["Médio", "Grande"]),
  "Xuriquem":          createWeapon("Xuriquem", "#ffffff", "Pequeno"),
  "Tridente":          createWeapon("Tridente", "#ffffff", "Médio"),
  "Spiked chain":      createWeapon("Spiked chain", "#ffffff", ["Médio", "Grande"]),
  "Arco":              createWeapon("Arco", "#ffffff", ["Médio", "Grande"]),
  
  // Armas com apenas um tamanho específico
  "Pistolas": createWeapon("Pistolas", "#ffffff", "Sem tamanho"),
  "Sniper":   createWeapon("Sniper", "#ffffff", "Sem tamanho"),
  "Arco":     createWeapon("Arco", "#ffffff", ["Médio", "Grande"]),
  "Besta":    createWeapon("Besta", "#ffffff", ["Médio", "Pequeno"]),
};
