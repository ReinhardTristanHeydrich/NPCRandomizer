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

    const Weapons = {
      "Calibre 12":             createWeapon("Calibre 12", "#ffffff", "Sem tamanho"),
      "Sniper":                 createWeapon("Sniper", "#ffffff", "Sem tamanho"),
      "Pistola":                createWeapon("Pistola", "#ffffff", "Sem tamanho"),
      "Orbe":                   createWeapon("Orbe", "#ffffff", "Sem tamanho"),
      "Cajado":                 createWeapon("Cajado", "#ffffff", "Sem tamanho"),
      "Grimório":               createWeapon("Grimório", "#ffffff", "Sem tamanho"),
      "Luvas/botas de batalha": createWeapon("Luvas/botas de batalha", "#ffffff", "Sem tamanho"),
      "Espada":                 createWeapon("Espada", "#ffffff", ["Pequeno", "Médio", "Grande"]),
      "Martelo de guerra":      createWeapon("Martelo de guerra", "#ffffff", ["Médio", "Grande"]),
      "Martelo de Guerra":      createWeapon("Martelo de Guerra", "#ffffff", ["Médio", "Grande"]),
      "Machado":                createWeapon("Machado", "#ffffff", ["Médio", "Grande"]),
      "Maça":                   createWeapon("Maça", "#ffffff", ["Médio", "Grande"]),
      "Clava":                  createWeapon("Clava", "#ffffff", ["Médio", "Grande"]),
      "Adaga":                  createWeapon("Adaga", "#ffffff", "Pequeno"),
      "Kunai":                  createWeapon("Kunai", "#ffffff", "Pequeno"),
      "Lança":                  createWeapon("Lança", "#ffffff", ["Médio", "Grande"]),
      "Besta":                  createWeapon("Besta", "#ffffff", ["Médio", "Pequeno"]),
      "Foice":                  createWeapon("Foice", "#ffffff", ["Médio", "Grande"]),
      "Xuriquem":               createWeapon("Xuriquem", "#ffffff", "Pequeno"),
      "Tridente":               createWeapon("Tridente", "#ffffff", "Médio"),
      "Spiked chain":           createWeapon("Spiked chain", "#ffffff", ["Médio", "Grande"]),
      "Arco":                   createWeapon("Arco", "#ffffff", ["Médio", "Grande"]),
      "Pistolas":               createWeapon("Pistolas", "#ffffff", "Sem tamanho")
    };

    function getWeapons(list) {
      return list.map(([name, altOrAlts]) => {
        const weapon = Weapons[name];
        if (!weapon) throw new Error(`Arma não encontrada: ${name}`);

        if (weapon instanceof Weapon) {
          if (Array.isArray(altOrAlts)) {
            throw new Error(`"${name}" é uma arma única e não aceita variações`);
          }
          return weapon;
        }

        if (Array.isArray(altOrAlts)) {
          if (!weapon[name]) throw new Error(`"${name}" não é uma coleção válida`);
          
          const availableAlts = altOrAlts.filter(size => weapon[name][size]);
          if (availableAlts.length === 0) {
            throw new Error(`Nenhuma variação válida encontrada para ${name}. Opções: ${Object.keys(weapon[name]).join(', ')}`);
          }
          
          const firstAlt = Object.keys(weapon[name])[0];
          return createWeapon(name, weapon[name][firstAlt].color, availableAlts);
        }

        if (!altOrAlts) throw new Error(`"${name}" requer variação: ${Object.keys(weapon[name]).join(', ')}`);
        if (!weapon[name][altOrAlts]) throw new Error(`Variação inválida para ${name}. Use: ${Object.keys(weapon[name]).join(', ')}`);
        
        return weapon[name][altOrAlts];
      });
    }