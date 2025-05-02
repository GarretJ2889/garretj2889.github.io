// DOM Elements
const elements = {
  // Character Info
  charName: document.getElementById('charName'),
  charClass: document.getElementById('charClass'),
  charRace: document.getElementById('charRace'),
  characterLevel: document.getElementById('characterLevel'),
  hp: document.getElementById('hp'),
  ac: document.getElementById('ac'),
  initiative: document.getElementById('initiative'),
  proficiencyBonus: document.getElementById('proficiencyBonus'),
  
  // Stats
  strength: document.getElementById('strength'),
  dexterity: document.getElementById('dexterity'),
  constitution: document.getElementById('constitution'),
  intelligence: document.getElementById('intelligence'),
  wisdom: document.getElementById('wisdom'),
  charisma: document.getElementById('charisma'),
  
  // Abilities
  newAbilityName: document.getElementById('newAbilityName'),
  newAbilityDesc: document.getElementById('newAbilityDesc'),
  abilitiesList: document.getElementById('abilitiesList'),
  
  // Feats
  newFeatName: document.getElementById('newFeatName'),
  newFeatDesc: document.getElementById('newFeatDesc'),
  featsList: document.getElementById('featsList'),
  
  // Actions
  actionType: document.getElementById('actionType'),
  newActionName: document.getElementById('newActionName'),
  newActionDesc: document.getElementById('newActionDesc'),
  actionCharges: document.getElementById('actionCharges'),
  actionsList: document.getElementById('actionsList'),
  
  // Inventory
  newItem: document.getElementById('newItem'),
  newItemType: document.getElementById('newItemType'),
  newToHit: document.getElementById('newToHit'),
  newDamage: document.getElementById('newDamage'),
  newCharges: document.getElementById('newCharges'),
  inventoryList: document.getElementById('inventoryList'),
  
  // Character Management
  characterList: document.getElementById('characterList'),
  saveCharacter: document.getElementById('saveCharacter'),
  loadSelectedCharacter: document.getElementById('loadSelectedCharacter'),
  deleteCharacter: document.getElementById('deleteCharacter'),
  
  // Modals
  editItemModal: document.getElementById('editItemModal'),
  editItemName: document.getElementById('editItemName'),
  editItemType: document.getElementById('editItemType'),
  editToHit: document.getElementById('editToHit'),
  editDamage: document.getElementById('editDamage'),
  editCharges: document.getElementById('editCharges')
};

// Character Data
let characterList = [];

// Utility Functions
function calculateModifier(statValue) {
  return Math.floor((statValue - 10) / 2);
}

function formatModifier(modifier) {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

function getProficiencyBonus(level) {
  return Math.floor((level - 1) / 4) + 2;
}

// Stats and Skills Manager
class SkillsManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateAll();
  }

  setupEventListeners() {
    // Stat inputs
    document.querySelectorAll('.stat-block input[type="number"]').forEach(input => {
      input.addEventListener('input', () => this.updateAll());
    });

    // Proficiency selects
    document.querySelectorAll('.saving-throw-select, .skill-select').forEach(select => {
      select.addEventListener('change', () => this.updateAll());
    });

    // Level input
    elements.characterLevel.addEventListener('input', () => this.updateAll());
  }

  updateAll() {
    try {
      const level = parseInt(elements.characterLevel.value) || 1;
      const profBonus = getProficiencyBonus(level);
      elements.proficiencyBonus.textContent = formatModifier(profBonus);

      // Update all stats and their derivatives
      ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(stat => {
        this.updateStat(stat, profBonus);
      });
    } catch (error) {
      console.error('Update error:', error);
    }
  }

  updateStat(stat, profBonus) {
    const value = parseInt(elements[stat].value) || 10;
    const modifier = calculateModifier(value);
    
    // Update base modifier
    document.getElementById(`${stat}Modifier`).textContent = formatModifier(modifier);
    
    // Update saving throw
    const statBlock = elements[stat].closest('.stat-block');
    const saveRow = statBlock.querySelector('.saving-throw .skill-row');
    if (saveRow) {
      const isProficient = saveRow.querySelector('.saving-throw-select').value === 'proficient';
      const saveMod = isProficient ? modifier + profBonus : modifier;
      saveRow.querySelector('.skill-modifier').textContent = formatModifier(saveMod);
    }
    
    // Update skills
    statBlock.querySelectorAll('.stat-skills .skill-row').forEach(row => {
      const select = row.querySelector('.skill-select');
      const modSpan = row.querySelector('.skill-modifier');
      if (select && modSpan) {
        let skillMod = modifier;
        switch(select.value) {
          case 'half': skillMod += Math.floor(profBonus / 2); break;
          case 'proficient': skillMod += profBonus; break;
          case 'expertise': skillMod += profBonus * 2; break;
        }
        modSpan.textContent = formatModifier(skillMod);
      }
    });
  }
}

// Abilities Manager
class AbilitiesManager {
  constructor() {
    this.init();
  }

  init() {
    document.getElementById('addAbility').addEventListener('click', () => this.addAbility());
    elements.newAbilityName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addAbility();
    });
  }

  addAbility() {
    const name = elements.newAbilityName.value.trim();
    const desc = elements.newAbilityDesc.value.trim();
    
    if (!name) {
      alert('Ability name is required.');
      return;
    }
    const li = document.createElement('li');
    li.className = 'ability-item';
    li.innerHTML = `
      <div class="ability-name">${name}</div>
      <div class="ability-desc">${desc || 'No description'}</div>
      <button class="delete-ability">Delete</button>
    `;
    
    li.dataset.abilityName = name;
    li.dataset.abilityDesc = desc;

    li.querySelector('.delete-ability').addEventListener('click', () => {
      li.remove();
    });

    elements.abilitiesList.appendChild(li);
    elements.newAbilityName.value = '';
    elements.newAbilityDesc.value = '';
  }
}

// Feats Manager
class FeatsManager {
  constructor() {
    this.init();
  }

  init() {
    document.getElementById('addFeat').addEventListener('click', () => this.addFeat());
    elements.newFeatName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addFeat();
    });
  }

  addFeat() {
    const name = elements.newFeatName.value.trim();
    const desc = elements.newFeatDesc.value.trim();
    
    if (!name) {
      alert('Feat name is required.');
      return;
    }

    const li = document.createElement('li');
    li.className = 'feat-item';
    li.innerHTML = `
      <div class="feat-name">${name}</div>
      <div class="feat-desc">${desc || 'No description'}</div>
      <button class="delete-feat">Delete</button>
    `;
    
    li.dataset.featName = name;
    li.dataset.featDesc = desc;

    li.querySelector('.delete-feat').addEventListener('click', () => {
      li.remove();
    });

    elements.featsList.appendChild(li);
    elements.newFeatName.value = '';
    elements.newFeatDesc.value = '';
  }
}

// Actions Manager
class ActionsManager {
  constructor() {
    this.init();
  }

  init() {
    document.getElementById('addAction').addEventListener('click', () => this.addAction());
    elements.newActionName.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addAction();
    });

    // Show/hide weapon inputs based on action type
    elements.actionType.addEventListener('change', () => {
      document.getElementById('weaponInputs').style.display = 
        elements.actionType.value === 'Weapon' ? 'block' : 'none';
    });
  }

  addAction() {
    const name = elements.newActionName.value.trim();
    const desc = elements.newActionDesc.value.trim();
    const type = elements.actionType.value;
    const charges = parseInt(elements.actionCharges.value) || 0;
    
    if (!name) {
      alert('Action name is required.');
      return;
    }
    if (!type) {
      alert('Please select an action type.');
      return;
    }

    const li = document.createElement('li');
    li.className = 'action-item';
    li.dataset.actionName = name;
    li.dataset.actionDesc = desc;
    li.dataset.actionType = type;
    li.dataset.actionCharges = charges;
    
    let actionHTML = `
      <div class="action-header">
        <span class="action-name">${name}</span>
        <span class="action-type">(${type})</span>
        <button class="delete-action">×</button>
      </div>
      <div class="action-desc">${desc || 'No description provided'}</div>
    `;

    if (charges > 0) {
      actionHTML += `<div class="charges-container">`;
      for (let i = 0; i < charges; i++) {
        actionHTML += `
          <label class="charge-box">
            <input type="checkbox">
            <span>Charge ${i+1}</span>
          </label>
        `;
      }
      actionHTML += `</div>`;
    }

    li.innerHTML = actionHTML;
    li.querySelector('.delete-action').addEventListener('click', () => {
      li.remove();
    });

    elements.actionsList.appendChild(li);
    this.clearForm();
  }

  clearForm() {
    elements.newActionName.value = '';
    elements.newActionDesc.value = '';
    elements.actionType.value = '';
    elements.actionCharges.value = '0';
    document.getElementById('weaponInputs').style.display = 'none';
  }
}

// Inventory Manager
class InventoryManager {
  constructor() {
    this.currentEditItem = null;
    this.init();
  }
  attachItemEventListeners(itemElement) {
    // Edit button
    itemElement.querySelector('.edit-item').addEventListener('click', () => {
      this.openEditModal(itemElement);
    });
    
    // Delete button
    itemElement.querySelector('.delete-item').addEventListener('click', () => {
      itemElement.remove();
    });
  };
  init() {
    document.getElementById('addItem').addEventListener('click', () => this.addItem());
    elements.newItem.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addItem();
    });

    // Properly bind modal button handlers
    document.getElementById('saveItemChanges').addEventListener('click', (e) => {
      e.preventDefault();
      this.saveItemChanges();
      this.closeEditModal(); // Explicit close
    });

    document.getElementById('deleteItem').addEventListener('click', (e) => {
      e.preventDefault();
      this.deleteCurrentItem();
      this.closeEditModal(); // Explicit close
    });

    document.getElementById('cancelEdit').addEventListener('click', (e) => {
      e.preventDefault();
      this.closeEditModal();
    });

    // Close when clicking outside modal
    window.addEventListener('click', (e) => {
      if (e.target === elements.editItemModal) {
        this.closeEditModal();
      }
    });
  }


  addItem() {
    const name = elements.newItem.value.trim();
    const type = elements.newItemType.value.trim();
    const toHit = elements.newToHit.value.trim();
    const damage = elements.newDamage.value.trim();
    const charges = parseInt(elements.newCharges.value) || 0;
    
    if (!name) {
      alert('Item name is required.');
      return;
    }
  
    const li = document.createElement('li');
    li.className = 'inventory-item';
    li.innerHTML = this.createItemHTML(name, type, toHit, damage, charges);
    
    // Store data as attributes
    li.dataset.name = name;
    li.dataset.type = type;
    li.dataset.toHit = toHit;
    li.dataset.damage = damage;
    li.dataset.charges = charges;
    
    // Attach event listeners using the helper method
    this.attachItemEventListeners(li);
  
    elements.inventoryList.appendChild(li);
    this.clearForm();
  }

  createItemHTML(name, type, toHit, damage, charges) {
    return `
      <div class="inventory-item-content">
        <div class="inventory-item-name">${name}</div>
        <div class="inventory-item-type">${type || 'No type specified'}</div>
        <div class="inventory-item-stats">
          ${toHit ? `<span>To Hit: ${toHit}</span>` : ''}
          ${damage ? `<span>Damage: ${damage}</span>` : ''}
          ${charges > 0 ? `<span>Charges: ${charges}</span>` : ''}
        </div>
        <div class="inventory-item-actions">
          <button class="edit-item">Edit</button>
          <button class="delete-item">Delete</button>
        </div>
      </div>
    `;
  }

  openEditModal(itemElement) {
    itemElement.classList.add('editing');
    this.currentEditItem = itemElement;
    elements.editItemName.value = itemElement.dataset.name;
    elements.editItemType.value = itemElement.dataset.type;
    elements.editToHit.value = itemElement.dataset.toHit;
    elements.editDamage.value = itemElement.dataset.damage;
    elements.editCharges.value = itemElement.dataset.charges;
    elements.editItemModal.style.display = 'block';
  }

  saveItemChanges() {
    if (!this.currentEditItem) return;
    
    const name = elements.editItemName.value.trim();
    const type = elements.editItemType.value.trim();
    const toHit = elements.editToHit.value.trim();
    const damage = elements.editDamage.value.trim();
    const charges = parseInt(elements.editCharges.value) || 0;
    
    if (!name) {
      alert('Item name is required.');
      return;
    }
    
    // Update the item data
    this.currentEditItem.dataset.name = name;
    this.currentEditItem.dataset.type = type;
    this.currentEditItem.dataset.toHit = toHit;
    this.currentEditItem.dataset.damage = damage;
    this.currentEditItem.dataset.charges = charges;
    
    // Update the displayed item
    this.currentEditItem.innerHTML = this.createItemHTML(name, type, toHit, damage, charges);
    
    // Reattach event listeners
    this.currentEditItem.querySelector('.edit-item').addEventListener('click', () => {
      this.openEditModal(this.currentEditItem);
    });
    
    this.currentEditItem.querySelector('.delete-item').addEventListener('click', () => {
      this.currentEditItem.remove();
    });
    
    this.attachItemEventListeners(this.currentEditItem);  // <-- Add this line
  
    this.closeEditModal();
  }

  deleteCurrentItem() {
    if (this.currentEditItem) {
      this.currentEditItem.remove();
      this.closeEditModal();
    }
  }

  closeEditModal() {
    // Clear any editing state
    if (this.currentEditItem) {
      this.currentEditItem.classList.remove('editing');
    }
    
    // Hide the modal
    elements.editItemModal.style.display = 'none';
    this.currentEditItem = null;
    
    // Optional: reset form fields
    elements.editItemName.value = '';
    elements.editItemType.value = '';
    elements.editToHit.value = '';
    elements.editDamage.value = '';
    elements.editCharges.value = '';
  }

  // Updated openEditModal method
  openEditModal(itemElement) {
    // Set current item
    this.currentEditItem = itemElement;
    itemElement.classList.add('editing');
    
    // Fill form
    elements.editItemName.value = itemElement.dataset.name || '';
    elements.editItemType.value = itemElement.dataset.type || '';
    elements.editToHit.value = itemElement.dataset.toHit || '';
    elements.editDamage.value = itemElement.dataset.damage || '';
    elements.editCharges.value = itemElement.dataset.charges || '';
    
    // Show modal
    elements.editItemModal.style.display = 'block';
  }
}

// Character Manager
class CharacterManager {
  constructor() {
    if (!localStorage.getItem('characters')) {
      localStorage.setItem('characters', JSON.stringify([]));
    }
    this.init();
  }

  init() {
    // Load any saved characters
    this.loadCharacterList();
    
    // Set up event listeners
    elements.saveCharacter.addEventListener('click', () => this.saveCharacter());
    elements.loadSelectedCharacter.addEventListener('click', () => this.loadCharacter());
    elements.deleteCharacter.addEventListener('click', () => this.deleteCharacter());
  }

  saveCharacter() {
    const characterData = {
      // Basic Info
      name: elements.charName.value,
      class: elements.charClass.value,
      race: elements.charRace.value,
      level: elements.characterLevel.value,
      hp: elements.hp.value,
      ac: elements.ac.value,
      initiative: elements.initiative.value,
      
      // Stats
      stats: {
        strength: elements.strength.value,
        dexterity: elements.dexterity.value,
        constitution: elements.constitution.value,
        intelligence: elements.intelligence.value,
        wisdom: elements.wisdom.value,
        charisma: elements.charisma.value
      },
      
      // Abilities
      abilities: Array.from(elements.abilitiesList.children).map(li => ({
        name: li.dataset.abilityName,
        description: li.dataset.abilityDesc
      })),
      
      // Feats
      feats: Array.from(elements.featsList.children).map(li => ({
        name: li.dataset.featName,
        description: li.dataset.featDesc
      })),
      
      // Actions
      actions: Array.from(elements.actionsList.children).map(li => ({
        name: li.dataset.actionName,
        description: li.dataset.actionDesc,
        type: li.dataset.actionType,
        charges: li.dataset.actionCharges
      })),
      
      // Inventory
      inventory: Array.from(elements.inventoryList.children).map(li => ({
        name: li.dataset.name,
        type: li.dataset.type,
        toHit: li.dataset.toHit,
        damage: li.dataset.damage,
        charges: li.dataset.charges
      })),
      
      // Notes
      notes: elements.characterNotes.value
    };

    // Check if character already exists
    const existingIndex = characterList.findIndex(char => char.name === characterData.name);
    
    if (existingIndex >= 0) {
      // Update existing character
      characterList[existingIndex] = characterData;
    } else {
      // Add new character
      characterList.push(characterData);
    }

    // Save to localStorage
    localStorage.setItem('characters', JSON.stringify(characterList));
    this.updateCharacterDropdown();
    alert('Character saved successfully!');
  }

  loadCharacter() {
    const selectedIndex = elements.characterList.selectedIndex - 1; // Account for default option
    if (selectedIndex < 0 || selectedIndex >= characterList.length) {
      alert('Please select a valid character to load.');
      return;
    }

    const character = characterList[selectedIndex];
  
    // Load basic info
    elements.charName.value = character.name || '';
    elements.charClass.value = character.class || '';
    elements.charRace.value = character.race || '';
    elements.characterLevel.value = character.level || '';
    elements.hp.value = character.hp || '';
    elements.ac.value = character.ac || '';
    elements.initiative.value = character.initiative || '';

    // Load stats
    elements.strength.value = character.stats.strength || '10';
    elements.dexterity.value = character.stats.dexterity || '10';
    elements.constitution.value = character.stats.constitution || '10';
    elements.intelligence.value = character.stats.intelligence || '10';
    elements.wisdom.value = character.stats.wisdom || '10';
    elements.charisma.value = character.stats.charisma || '10';

    // Load abilities
    elements.abilitiesList.innerHTML = '';
    character.abilities.forEach(ability => {
      const li = document.createElement('li');
      li.className = 'ability-item';
      li.innerHTML = `
        <div class="ability-name">${ability.name}</div>
        <div class="ability-desc">${ability.description || 'No description'}</div>
        <button class="delete-ability">Delete</button>
      `;
      li.dataset.abilityName = ability.name;
      li.dataset.abilityDesc = ability.description;
      elements.abilitiesList.appendChild(li);
    });

    // Load feats
    elements.featsList.innerHTML = '';
    character.feats.forEach(feat => {
      const li = document.createElement('li');
      li.className = 'feat-item';
      li.innerHTML = `
        <div class="feat-name">${feat.name}</div>
        <div class="feat-desc">${feat.description || 'No description'}</div>
        <button class="delete-feat">Delete</button>
      `;
      li.dataset.featName = feat.name;
      li.dataset.featDesc = feat.description;
      elements.featsList.appendChild(li);
    });

    // Load actions
    elements.actionsList.innerHTML = '';
    character.actions.forEach(action => {
      const li = document.createElement('li');
      li.className = 'action-item';
      li.dataset.actionName = action.name;
      li.dataset.actionDesc = action.description;
      li.dataset.actionType = action.type;
      li.dataset.actionCharges = action.charges;
      
      let actionHTML = `
        <div class="action-header">
          <span class="action-name">${action.name}</span>
          <span class="action-type">(${action.type})</span>
          <button class="delete-action">×</button>
        </div>
        <div class="action-desc">${action.description || 'No description provided'}</div>
      `;

      const charges = parseInt(action.charges) || 0;
      if (charges > 0) {
        actionHTML += `<div class="charges-container">`;
        for (let i = 0; i < charges; i++) {
          actionHTML += `
            <label class="charge-box">
              <input type="checkbox">
              <span>Charge ${i+1}</span>
            </label>
          `;
        }
        actionHTML += `</div>`;
      }

      li.innerHTML = actionHTML;
      elements.actionsList.appendChild(li);
    });

    // Load inventory
    elements.inventoryList.innerHTML = '';
    character.inventory.forEach(item => {
      const li = document.createElement('li');
      li.className = 'inventory-item';
      li.innerHTML = `
        <div class="inventory-item-content">
          <div class="inventory-item-name">${item.name}</div>
          <div class="inventory-item-type">${item.type || 'No type specified'}</div>
          <div class="inventory-item-stats">
            ${item.toHit ? `<span>To Hit: ${item.toHit}</span>` : ''}
            ${item.damage ? `<span>Damage: ${item.damage}</span>` : ''}
            ${item.charges > 0 ? `<span>Charges: ${item.charges}</span>` : ''}
          </div>
          <div class="inventory-item-actions">
            <button class="edit-item">Edit</button>
            <button class="delete-item">Delete</button>
          </div>
        </div>
      `;
      li.dataset.name = item.name;
      li.dataset.type = item.type;
      li.dataset.toHit = item.toHit;
      li.dataset.damage = item.damage;
      li.dataset.charges = item.charges;
      elements.inventoryList.appendChild(li);
    });

    // Load notes
    elements.characterNotes.value = character.notes || '';

    // Update all modifiers
    skillsManager.updateAllModifiers();
    alert('Character loaded successfully!');
  }

  deleteCharacter() {
    const selectedIndex = elements.characterList.selectedIndex - 1;
    if (selectedIndex < 0 || selectedIndex >= characterList.length) {
      alert('Please select a character to delete.');
      return;
    }

    if (confirm('Are you sure you want to delete this character?')) {
      characterList.splice(selectedIndex, 1);
      localStorage.setItem('characters', JSON.stringify(characterList));
      this.updateCharacterDropdown();
      alert('Character deleted successfully!');
    }
  }

  loadCharacterList() {
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) {
      characterList = JSON.parse(savedCharacters);
      this.updateCharacterDropdown();
    }
  }

  updateCharacterDropdown() {
    elements.characterList.innerHTML = '<option value="">-- Select a character --</option>';
    characterList.forEach((character, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = character.name || `Unnamed Character ${index + 1}`;
      elements.characterList.appendChild(option);
    });
  }
}

// Declare managers globally (but initialize them inside DOMContentLoaded)
let skillsManager, abilitiesManager, featsManager, actionsManager, inventoryManager, characterManager;

document.addEventListener('DOMContentLoaded', () => {
  // Set default values for stats
  ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(stat => {
    if (elements[stat] && !elements[stat].value) elements[stat].value = '10';
  });

  // Initialize proficiency selects
  document.querySelectorAll('.saving-throw-select, .skill-select').forEach(select => {
    if (!select.value) select.value = 'none';
  });

  // Initialize all managers
  skillsManager = new SkillsManager();
  abilitiesManager = new AbilitiesManager();
  featsManager = new FeatsManager();
  actionsManager = new ActionsManager();
  inventoryManager = new InventoryManager();
  characterManager = new CharacterManager();

  // Then load characters
  characterManager.loadCharacterList();
});