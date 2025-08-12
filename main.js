    let currentCharacter = null;

    function rollD100(count) {
      let total = 0;
      for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * 100) + 1;
      }
      return total;
    }

    const rollD20 = () => Math.floor(Math.random() * 20) + 1;
    const getRace = () => Races[Math.floor(Math.random() * Races.length)];
    const getClass = () => Classes[Math.floor(Math.random() * Classes.length)];

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
        if (!chosen.includes(newClass)) {
          chosen.push(newClass);
        }
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

    function padLabel(label, width = 14) {
      return label + ":" + " ".repeat(Math.max(0, width - label.length - 1));
    }

    function padValue(value, roll) {  
      if (roll === undefined) {
        return `<span class="value" style="color:white">${value}</span>`;
      }
      
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

    function updatePoints() {
      const level = parseInt(document.getElementById("levelInput").value) || 1;
      const basePoints = 48 + (level - 1) * 4;
      
      const attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
      let totalSpent = 0;
      
      attributes.forEach(attr => {
        const value = parseInt(document.getElementById(attr).value) || 0;
        totalSpent += value;
      });
      
      const available = basePoints - totalSpent;
      
      document.getElementById('availablePoints').textContent = available;
      document.getElementById('totalSpent').textContent = totalSpent;
      
      // Atualiza as cores baseado nos pontos disponíveis
      const availableElement = document.getElementById('availablePoints');
      if (available < 0) {
        availableElement.style.color = '#ff8888';
      } else if (available === 0) {
        availableElement.style.color = '#88ff88';
      } else {
        availableElement.style.color = '#ffff88';
      }
      
      // Atualiza o estado do botão de salvar
      updateSaveButton();
    }

    function resetAttribute(attr) {
      document.getElementById(attr).value = 0;
      updatePoints();
    }

    function resetAllAttributes() {
      const attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
      attributes.forEach(attr => {
        document.getElementById(attr).value = 0;
      });
      updatePoints();
    }

    function distributeRandomly() {
      const level = parseInt(document.getElementById("levelInput").value) || 1;
      const basePoints = 48 + (level - 1) * 4;
      const attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
      
      // Reset all attributes
      attributes.forEach(attr => {
        document.getElementById(attr).value = 0;
      });
      
      let remainingPoints = basePoints;
      
      // Distribute points randomly
      for (let i = 0; i < attributes.length - 1; i++) {
        const maxForThisAttr = Math.min(remainingPoints, Math.floor(remainingPoints / (attributes.length - i)) + Math.floor(Math.random() * 10));
        const points = Math.floor(Math.random() * (maxForThisAttr + 1));
        document.getElementById(attributes[i]).value = points;
        remainingPoints -= points;
      }
      
      // Put remaining points in the last attribute
      document.getElementById(attributes[attributes.length - 1]).value = remainingPoints;
      
      updatePoints();
    }

    function updateSaveButton() {
      const saveButton = document.getElementById('saveButton');
      const hasCharacter = currentCharacter !== null;
      const hasName = document.getElementById('characterName').value.trim() !== '';
      
      saveButton.disabled = !hasCharacter || !hasName;
    }

    function generateNPC() {
      const level = parseInt(document.getElementById("levelInput").value) || 1;
      const diceCount = Math.ceil(level / 2);
      const vida = rollD100(diceCount);
      const mana = rollD100(diceCount);

      const rolls = {}
      rolls["Multiclass"] = rollD20()
      rolls["Prodigy"] = rollD20()
      rolls["Hybrid"] = rollD20()
      rolls["Social"] = rollD20()

      const isMulticlass = rolls["Multiclass"] >= 19;
      const isProdigy = rolls["Prodigy"] === 20;
      const isHybrid = rolls["Hybrid"] >= 18;

      const socialClass = pickSocialClass(rolls["Social"]);
      const races = pickRaces(rolls["Hybrid"]);
      const classes = pickClasses(rolls["Multiclass"]);

      const weaponLines = classes.map(cls => {
        const className = cls.name;
        const weapons = getWeaponsForClasses(cls);
        
        const weaponText = weapons.map(w => {
          if (!w || !w.name) return "Nenhuma";
          return (w.size === "Sem tamanho" || typeof w.size === "undefined") ? 
            w.name : `${w.name} (${w.size})`;
        }).join(" / ");
        
        return `${padLabel(`Arma${weapons.length > 1 ? 's' : ''} (${className})`, 20)}${weaponText}`;
      }).join("\n");

      // Get current attributes from the input fields
      const attributes = {
        str: parseInt(document.getElementById('str').value) || 0,
        dex: parseInt(document.getElementById('dex').value) || 0,
        con: parseInt(document.getElementById('con').value) || 0,
        int: parseInt(document.getElementById('int').value) || 0,
        wis: parseInt(document.getElementById('wis').value) || 0,
        cha: parseInt(document.getElementById('cha').value) || 0
      };

      console.log('Atributos capturados na geração:', attributes);

      const attributeLines = `
${padLabel("Força", 15)}${padValue(attributes.str)}
${padLabel("Destreza", 15)}${padValue(attributes.dex)}
${padLabel("Constituição", 15)}${padValue(attributes.con)}
${padLabel("Inteligência", 15)}${padValue(attributes.int)}
${padLabel("Sabedoria", 15)}${padValue(attributes.wis)}
${padLabel("Carisma", 15)}${padValue(attributes.cha)}`;

      const result = `
${padLabel("Multiclasse", 15)}${padValue(isMulticlass ? "Sim" : "Não", rolls["Multiclass"])}
${padLabel("Prodígio", 15)}${padValue(isProdigy ? "Sim" : "Não", rolls["Prodigy"])}
${padLabel("Híbrido", 15)}${padValue(isHybrid ? "Sim" : "Não", rolls["Hybrid"])}
${padLabel("Classe Social", 0)} ${padValue(socialClass, rolls["Social"])}
${padLabel("Vida", 15)}${padValue(vida)}
${padLabel("Mana", 15)}${padValue(mana)}

${attributeLines}

${padLabel("Raça" + (races.length > 1 ? "s" : ""))}${races.map(formatItem).join(" / ")}
${padLabel("Classe" + (classes.length > 1 ? "s" : ""))}${classes.map(formatItem).join(" / ")}

${weaponLines}
`;

      // Store current character data
      currentCharacter = {
        level,
        rolls,
        isMulticlass,
        isProdigy,
        isHybrid,
        socialClass,
        races,
        classes,
        weapons: classes.map(cls => getWeaponsForClasses(cls)),
        vida,
        mana,
        attributes: {...attributes}
      };

      document.getElementById("result").innerHTML = result;
      updateSaveButton();
    }

    // Character saving system
    function saveCharacter() {
      if (!currentCharacter) {
        alert('Gere um personagem primeiro!');
        return;
      }

      const name = document.getElementById('characterName').value.trim();
      if (!name) {
        alert('Digite um nome para o personagem!');
        return;
      }

      // Capturar os atributos atuais dos inputs no momento do salvamento
      const currentAttributes = {
        str: parseInt(document.getElementById('str').value) || 0,
        dex: parseInt(document.getElementById('dex').value) || 0,
        con: parseInt(document.getElementById('con').value) || 0,
        int: parseInt(document.getElementById('int').value) || 0,
        wis: parseInt(document.getElementById('wis').value) || 0,
        cha: parseInt(document.getElementById('cha').value) || 0
      };

      const characterData = {
        id: Date.now(),
        name,
        timestamp: new Date().toLocaleString('pt-BR'),
        ...currentCharacter,
        attributes: currentAttributes // Sobrescrever com os valores atuais
      };

      console.log('Salvando personagem com atributos:', currentAttributes);

      // Get existing characters
      let savedCharacters = [];
      try {
        const stored = localStorage.getItem('npcCharacters');
        if (stored) {
          savedCharacters = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Erro ao carregar personagens salvos:', e);
      }

      // Add new character
      savedCharacters.push(characterData);

      // Save back to localStorage
      try {
        localStorage.setItem('npcCharacters', JSON.stringify(savedCharacters));
        alert('Personagem salvo com sucesso!');
        document.getElementById('characterName').value = '';
        updateSaveButton();
        displaySavedCharacters();
      } catch (e) {
        console.error('Erro ao salvar personagem:', e);
        alert('Erro ao salvar personagem!');
      }
    }

    function loadCharacter(id) {
      try {
        const stored = localStorage.getItem('npcCharacters');
        if (!stored) return;

        const savedCharacters = JSON.parse(stored);
        const character = savedCharacters.find(c => c.id === id);
        
        if (!character) {
          alert('Personagem não encontrado!');
          return;
        }

        // Set level
        document.getElementById('levelInput').value = character.level;

        // Set attributes
        const attributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        console.log('Carregando atributos do personagem:', character.attributes);
        attributes.forEach(attr => {
          const value = character.attributes[attr] || 0;
          console.log(`Definindo ${attr} = ${value}`);
          document.getElementById(attr).value = value;
        });
        updatePoints();

        // Set character name
        document.getElementById('characterName').value = character.name;

        // Set current character data
        currentCharacter = { ...character };
        delete currentCharacter.id;
        delete currentCharacter.name;
        delete currentCharacter.timestamp;

        // Display the character
        displayLoadedCharacter(character);
        updateSaveButton();

      } catch (e) {
        console.error('Erro ao carregar personagem:', e);
        alert('Erro ao carregar personagem!');
      }
    }

    function displayLoadedCharacter(character) {
      const weaponLines = character.classes.map((cls, index) => {
        const className = cls.name;
        const weapons = character.weapons[index] || [];
        
        const weaponText = weapons.map(w => {
          if (!w || !w.name) return "Nenhuma";
          return (w.size === "Sem tamanho" || typeof w.size === "undefined") ? 
            w.name : `${w.name} (${w.size})`;
        }).join(" / ");
        
        return `${padLabel(`Arma${weapons.length > 1 ? 's' : ''} (${className})`, 20)}${weaponText}`;
      }).join("\n");

      // Garantir que os atributos existam, usando valores padrão se necessário
      const attrs = character.attributes || {str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0};
      
      const attributeLines = `
${padLabel("Força", 15)}${padValue(attrs.str || 0)}
${padLabel("Destreza", 15)}${padValue(attrs.dex || 0)}
${padLabel("Constituição", 15)}${padValue(attrs.con || 0)}
${padLabel("Inteligência", 15)}${padValue(attrs.int || 0)}
${padLabel("Sabedoria", 15)}${padValue(attrs.wis || 0)}
${padLabel("Carisma", 15)}${padValue(attrs.cha || 0)}`;

      const result = `
${padLabel("Multiclasse", 15)}${padValue(character.isMulticlass ? "Sim" : "Não", character.rolls["Multiclass"])}
${padLabel("Prodígio", 15)}${padValue(character.isProdigy ? "Sim" : "Não", character.rolls["Prodigy"])}
${padLabel("Híbrido", 15)}${padValue(character.isHybrid ? "Sim" : "Não", character.rolls["Hybrid"])}
${padLabel("Classe Social", 0)} ${padValue(character.socialClass, character.rolls["Social"])}
${padLabel("Vida", 15)}${padValue(character.vida)}
${padLabel("Mana", 15)}${padValue(character.mana)}

${attributeLines}

${padLabel("Raça" + (character.races.length > 1 ? "s" : ""))}${character.races.map(formatItem).join(" / ")}
${padLabel("Classe" + (character.classes.length > 1 ? "s" : ""))}${character.classes.map(formatItem).join(" / ")}

${weaponLines}
`;

      document.getElementById("result").innerHTML = result;
    }

    function deleteCharacter(id) {
      if (!confirm('Tem certeza que deseja excluir este personagem?')) {
        return;
      }

      try {
        const stored = localStorage.getItem('npcCharacters');
        if (!stored) return;

        let savedCharacters = JSON.parse(stored);
        savedCharacters = savedCharacters.filter(c => c.id !== id);

        localStorage.setItem('npcCharacters', JSON.stringify(savedCharacters));
        displaySavedCharacters();
        alert('Personagem excluído com sucesso!');
      } catch (e) {
        console.error('Erro ao excluir personagem:', e);
        alert('Erro ao excluir personagem!');
      }
    }

    function clearAllCharacters() {
      if (!confirm('Tem certeza que deseja excluir TODOS os personagens salvos? Esta ação não pode ser desfeita!')) {
        return;
      }

      try {
        localStorage.removeItem('npcCharacters');
        displaySavedCharacters();
        alert('Todos os personagens foram excluídos!');
      } catch (e) {
        console.error('Erro ao limpar personagens:', e);
        alert('Erro ao limpar personagens!');
      }
    }

    function displaySavedCharacters() {
      const container = document.getElementById('savedCharactersList');
      
      try {
        const stored = localStorage.getItem('npcCharacters');
        if (!stored) {
          container.innerHTML = '<p style="color: #888; font-style: italic;">Nenhum personagem salvo ainda.</p>';
          return;
        }

        const savedCharacters = JSON.parse(stored);
        
        if (savedCharacters.length === 0) {
          container.innerHTML = '<p style="color: #888; font-style: italic;">Nenhum personagem salvo ainda.</p>';
          return;
        }

        // Sort by timestamp (newest first)
        savedCharacters.sort((a, b) => b.id - a.id);

        const charactersHtml = savedCharacters.map(character => {
          const raceNames = character.races.map(r => r.name).join(", ");
          const classNames = character.classes.map(c => c.name).join(", ");
          
          // Mostrar os atributos na preview (apenas os que têm valor > 0 para economizar espaço)
          const attrs = character.attributes || {};
          const nonZeroAttrs = [];
          if (attrs.str > 0) nonZeroAttrs.push(`FOR: ${attrs.str}`);
          if (attrs.dex > 0) nonZeroAttrs.push(`DES: ${attrs.dex}`);
          if (attrs.con > 0) nonZeroAttrs.push(`CON: ${attrs.con}`);
          if (attrs.int > 0) nonZeroAttrs.push(`INT: ${attrs.int}`);
          if (attrs.wis > 0) nonZeroAttrs.push(`SAB: ${attrs.wis}`);
          if (attrs.cha > 0) nonZeroAttrs.push(`CAR: ${attrs.cha}`);
          
          const attributesText = nonZeroAttrs.length > 0 ? nonZeroAttrs.join(", ") : "Atributos não distribuídos";
          
          return `
            <div class="character-item">
              <div class="character-info">
                <div class="character-name">${character.name}</div>
                <div class="character-details">
                  Nível ${character.level} | ${raceNames} | ${classNames}<br>
                  ${attributesText}<br>
                  Salvo em: ${character.timestamp}
                </div>
              </div>
              <div class="character-actions">
                <button class="small-button" onclick="loadCharacter(${character.id})">Carregar</button>
                <button class="small-button delete-button" onclick="deleteCharacter(${character.id})">Excluir</button>
              </div>
            </div>
          `;
        }).join('');

        container.innerHTML = charactersHtml;

      } catch (e) {
        console.error('Erro ao exibir personagens salvos:', e);
        container.innerHTML = '<p style="color: #ff8888;">Erro ao carregar personagens salvos.</p>';
      }
    }

    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
      // Set up event listeners
      document.getElementById('levelInput').addEventListener('change', updatePoints);
      document.getElementById('characterName').addEventListener('input', updateSaveButton);
      
      // Initialize points display
      updatePoints();
      
      // Display saved characters
      displaySavedCharacters();
    });