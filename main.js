    // Random
    const rollD20 = () => Math.floor(Math.random() * 20) + 1;
    const getRace = () => Races[Math.floor(Math.random() * Races.length)];
    const getClass = () => Classes[Math.floor(Math.random() * Classes.length)];

    // Atributes
    function pickSocialClass(roll) {
      if (roll === 1) return "Escravo";
      if (roll <= 15) return "Camponês";
      if (roll <= 19) return "Burguesia";
      return "Elite";
    }
    function pickRaces(isHybrid) {
      const races = [];
      const hasCorrupted = () => races.some(r => r.name === "Corrompidos");
      const hasRace = (Race) => races.some(r => r.name === Race.name);
      
      let targetCount = 1 + (isHybrid ? 1 : 0) + (hasCorrupted() ? 1 : 0);
      
      while (races.length < targetCount) {
        const newRace = getRace();
        if (!hasRace(newRace)) {
          races.push(newRace);
          if (newRace.name === "Corrompidos") targetCount++;
        }
      }
      
      return races;
    }
    function pickClasses(rollMulti) {
      const numClasses = rollMulti === 20 ? 3 : rollMulti >= 18 ? 2 : 1;
      const chosen = [];
      while (chosen.length < numClasses) {
        const newClass = getClass();
        if (!chosen.includes(newClass)) {chosen.push(newClass);}
      }
      return chosen;
    }
    function getWeaponsForClasses(cls) {
      const weapons = [];
      const weaponCount = cls.name === "Guerreiro Arcano" ? 2 : 1;

      for (let i = 0; i < weaponCount; i++) {
        const weapon = cls.getWeaponsForClass();
        if (weapon) {
          weapons.push(weapon);
        } else {
          weapons.push(new Weapon("Nenhuma", "#ffffff", "Sem tamanho"));
        }
      }

      return weapons;
    }


    // Style
    function padLabel(label, width = 14) {
      return label + ":" + " ".repeat(Math.max(0, width - label.length - 1));
    }
    function padValue(value, roll) {
      const rollColor = getRollColor(roll);
      const valueColor = value === "Sim" || value === "Não" ? getYesNoColor(value) : "white";
      return `<span class="value" style="color:${valueColor}">${value}</span> <span style="color:${rollColor}">(${roll})</span>`;
    }
    function getYesNoColor(value) {
      return value === "Sim" ? "#88ff88" : "#ff8888";
    }
    function getRollColor(roll) {
      const green = Math.floor((255 * roll) / 20);
      const red = 255 - green;
      return `rgb(${red}, ${green}, ${green / 2})`;
    }
    function formatItem(item) {
      return `<span style="color:${item.color || 'white'}">${item.name || item}</span>`;
    }


    
    // Execution


    function generateNPC() {

      const rolls = []
      rolls["Multiclass"] = rollD20()
      rolls["Prodigy"]    = rollD20()
      rolls["Hybrid"]     = rollD20()
      rolls["Social"]     = rollD20()

      const isMulticlass = rolls["Multiclass"] >= 19;
      const isProdigy    = rolls["Prodigy"]   === 20;
      const isHybrid     = rolls["Hybrid"]     >= 18;

      const socialClass = pickSocialClass(rolls["Social"]);
      const races       = pickRaces(rolls["Hybrid"]);
      const classes     = pickClasses(rolls["Multiclass"]);

      const weaponLines = classes.map(cls => {
        const className = cls.name;
        const weapons = getWeaponsForClasses(cls);
        
        const weaponText = weapons.map(w => {
          if (!w || !w.name) return "Nenhuma";
          return (w.size === "Sem tamanho" || typeof w.size === "undefined") ? 
            w.name : `${w.name} (${w.size})`;
        }).join(" / ");
        
        return `${padLabel(`Arma${weapons.length > 1 ? 's' : ''} (${className})`)}${weaponText}`;
      }).join("\n");


      const result = `
${padLabel("Multiclasse",   15)}${padValue(isMulticlass ? "Sim" : "Não", rolls["Multiclass"] )}
${padLabel("Prodígio",      15)}${padValue(isProdigy    ? "Sim" : "Não", rolls["Prodigy"]    )}
${padLabel("Híbrido",       15)}${padValue(isHybrid     ? "Sim" : "Não", rolls["Hybrid"]     )}
${padLabel("Classe Social", 0)} ${padValue(socialClass,                  rolls["Social"]     )}

${padLabel("Raça" + (races.length > 1 ? "s" : "")       )}${races.map(formatItem).join(" / ")}
${padLabel("Classe" + (classes.length > 1 ? "s" : "")   )}${classes.map(formatItem).join(" / ")}

${weaponLines}
`;

document.getElementById("result").innerHTML = result;
    }