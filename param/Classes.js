class Classe {
  constructor(name, color, weapons = [], WeaponCount = 1) {
    this.name = name;
    this.color = color;
    this.weapons = weapons;
    this.WeaponCount = WeaponCount;
  }
  
getWeaponsForClass() {
  if (!this.weapons || this.weapons.length === 0) {
    return new Weapon("Nenhuma", "#ffffff", "Sem tamanho");
  }

  const randomWeapon = this.weapons[Math.floor(Math.random() * this.weapons.length)];
  
  if (!randomWeapon) {
    return new Weapon("Nenhuma", "#ffffff", "Sem tamanho");
  }

  // Se for uma WeaponCollection, seleciona uma arma aleatória dela
  if (randomWeapon instanceof WeaponCollection) {
    const weaponVariants = Object.values(randomWeapon[randomWeapon.name]);
    if (weaponVariants.length > 0) {
      return weaponVariants[Math.floor(Math.random() * weaponVariants.length)];
    }
    return new Weapon("Nenhuma", "#ffffff", "Sem tamanho");
  }

  return randomWeapon;
}


}

const Classes = [
  new Classe("Espadachim", "#d08770", getWeapons([
    ["Espada", "Médio"]
  ])),
  
  new Classe("Juggernaut", "#a3be8c", getWeapons([
    ["Espada", "Grande"],
    ["Martelo de guerra", "Grande"],
    ["Machado", "Grande"],
    ["Calibre 12"],
    ["Maça", "Grande"],
    ["Clava", "Grande"]
  ])),
  
  new Classe("Assassino", "#bf616a", getWeapons([
    ["Adaga", "Pequeno"],
    ["Kunai", "Pequeno"],
    ["Pistola"],
    ["Espada", "Pequeno"]
  ])),
  
  new Classe("Tanke", "#d08770", getWeapons([
    ["Espada", ["Médio", "Grande"]],
    ["Lança", ["Médio", "Grande"]],
    ["Machado", ["Médio", "Grande"]],
    ["Pistola"],
    ["Besta", ["Médio", "Grande"]],
    ["Maça", ["Médio", "Grande"]],
    ["Clava", ["Médio", "Grande"]]
  ])),
  
  new Classe("Bardo", "#b48ead", /*getWeapons([])*/), // Bardo não tem armas específicas
  
  new Classe("Paladino", "#ebcb8b", getWeapons([
    ["Espada", "Médio"],
    ["Lança", "Médio"],
    ["Machado", "Médio"]
  ])),
  
  new Classe("Clerigo", "#eceff4", getWeapons([
    ["Maça", "Médio"],
    ["Clava", "Médio"],
    ["Machado", "Médio"]
  ])),
  
  new Classe("Mago", "#5e81ac", getWeapons([
    ["Cajado"],
    ["Orbe"],
    ["Grimório"]
  ])),
  
  new Classe("Anti-mago", "#8fbcbb", getWeapons([
    ["Cajado"],
    ["Orbe"],
    ["Grimório"]
  ])),
  
  new Classe("Pistoleiro", "#d08770", getWeapons([
    ["Pistola"]
  ])),
  
  new Classe("Arqueiro", "#a3be8c", getWeapons([
    ["Arco", ["Médio", "Grande"]],
    ["Besta", ["Médio", "Pequeno"]]
  ])),
  
  new Classe("Sniper", "#5e81ac", getWeapons([
    ["Sniper"]
  ])),
  
  new Classe("Domador", "#a3be8c", getWeapons([])),
  
  new Classe("Lutador", "#ebcb8b", getWeapons([
    ["Luvas/botas de batalha"]
  ])),
  
  new Classe("Invocador", "#b48ead", getWeapons([])),
  
  new Classe("Executor", "#d74f4f", getWeapons([
    ["Machado", "Médio"],
    ["Foice", "Médio"]
  ])),
  
  new Classe("Ninja", "#4c566a", getWeapons([
    ["Adaga", "Pequeno"],
    ["Espada", "Pequeno"],
    ["Xuriquem", "Pequeno"],
    ["Kunai", "Pequeno"],
    ["Besta", "Pequeno"]
  ])),
  
  new Classe("Lanceiro", "#88c0d0", getWeapons([
    ["Lança", "Médio"],
    ["Tridente", "Médio"]
  ])),
  
  new Classe("Feiticeiro", "#b48ead", getWeapons([
    ["Cajado"],
    ["Orbe"],
    ["Grimório"]
  ])),
  
  new Classe("Caçador", "#a3be8c", getWeapons([
    ["Calibre 12"],
    ["Sniper"],
    ["Besta", "Médio"],
    ["Adaga", "Médio"]
  ])),
  
  new Classe("Ladino", "#ab7967", getWeapons([
    ["Espada", "Pequeno"],
    ["Adaga", "Pequeno"]
  ])),
  
  new Classe("Artifice", "#a1cfff", getWeapons([])),
  
  new Classe("Cavaleiro", "#eceff4", getWeapons([
    ["Espada", ["Médio", "Grande"]],
    ["Machado", ["Médio", "Grande"]],
    ["Martelo de Guerra", ["Médio", "Grande"]],
    ["Maça", ["Médio", "Grande"]],
    ["Clava", ["Médio", "Grande"]],
    ["Foice", ["Médio", "Grande"]],
    ["Calibre 12"],
    ["Pistola"],
    ["Sniper"],
    ["Arco", ["Médio", "Grande"]],
    ["Besta", ["Médio", "Pequeno"]],
    ["Lança", ["Médio", "Grande"]],
    ["Spiked chain", ["Médio", "Grande"]]
  ])),
  
  new Classe("Necromante", "#81a1c1", getWeapons([
    ["Cajado", "Médio"],
    ["Foice", "Médio"]
  ])),
  
  new Classe("Magico", "#81a1c1", getWeapons([])),
  
  new Classe("Ceifador", "#bf616a", getWeapons([
    ["Foice", "Médio"]
  ])),
  
  new Classe("Guerreiro Arcano", "#8fbcbb", getWeapons([
    ["Espada", "Médio"],
    ["Lança", "Médio"],
    ["Foice", "Médio"],
    ["Machado", "Médio"],
    ["Adaga"],
    ["Kunai"],
    ["Besta", "Médio"],
    ["Pistola"]
  ]))
];
