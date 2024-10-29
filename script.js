    // Global Variables and Element Selection
    //============================================================================//
// Array to hold all saved characters
let characterList = [];

// Character Management Elements
const saveCharacterButton = document.getElementById('saveCharacter');
const loadSelectedCharacterButton = document.getElementById('loadSelectedCharacter');
const deleteCharacterButton = document.getElementById('deleteCharacter');
const characterDropdown = document.getElementById('characterList');

// Inventory Management Elements
const newItemInput = document.getElementById('newItem');
const newItemTypeInput = document.getElementById('newItemType');
const newToHitInput = document.getElementById('newToHit');
const newDamageInput = document.getElementById('newDamage');
const newChargesInput = document.getElementById('newCharges');
const itemDetailsInput = document.getElementById('itemDetails');
const addItemButton = document.getElementById('addItem');
const inventoryList = document.getElementById('inventoryList');
const displayInventorySheet = document.getElementById('displayInventorySheet');

// Basic Character Info Elements
const charNameInput = document.getElementById('charName');
const charClassSelect = document.getElementById('charClass');
const charRaceSelect = document.getElementById('charRace');
const characterLevelInput = document.getElementById('characterLevel');
const hpInput = document.getElementById('hp');
const acInput = document.getElementById('ac');
const initiativeInput = document.getElementById('initiative');

// Stat Input Elements
const strengthInput = document.getElementById('strength');
const dexterityInput = document.getElementById('dexterity');
const constitutionInput = document.getElementById('constitution');
const intelligenceInput = document.getElementById('intelligence');
const wisdomInput = document.getElementById('wisdom');
const charismaInput = document.getElementById('charisma');

// Character Sheet Display Elements
const toggleViewButton = document.getElementById('toggleViewButton');
const editView = document.getElementById('editView');
const characterSheetView = document.getElementById('characterSheetView');

// Abilities, Feats, Actions, and Notes
const abilitiesList = document.getElementById('abilitiesList');
const featsList = document.getElementById('featsList');
const actionsList = document.getElementById('actionsList');
const characterNotesInput = document.getElementById('characterNotes');
const displayAbilitiesSheet = document.getElementById('displayAbilitiesSheet');
const displayFeatsSheet = document.getElementById('displayFeatsSheet');
const displayActionsSheet = document.getElementById('displayActionsSheet');
const displayNotesSheet = document.getElementById('displayNotesSheet');

// Dice Roll Elements
const diceRollResult = document.getElementById('diceRollResult');
const rollOutput = document.getElementById('rollOutput');

// Skills Management Elements
const skillSelects = document.querySelectorAll('.skill-select');
const skillsDisplay = document.getElementById('skillsDisplay');

// Inventory Edit Elements
const editItemModal = document.getElementById('editItemModal');
const editItemName = document.getElementById('editItemName');
const editItemDetails = document.getElementById('editItemDetails');
const editItemQuantity = document.getElementById('editItemQuantity');
const saveItemChangesButton = document.getElementById('saveItemChanges');
let currentEditItem = null;

// Attunement Elements
const attunementSlots = document.querySelectorAll('.attunement-slot');
let selectedAttunementSlot = null;
let dropdownOpen = false;




    // Utility Functions
    //============================================================================//
function getProficiencyBonus() {
    const level = parseInt(characterLevelInput.value, 10);
    return Math.floor((level - 1) / 4) + 2;
  }
  
  function calculateModifier(stat) {
    return Math.floor((stat - 10) / 2);
  }
  
  function formatModifier(modifier) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
  
  function openEditModal(itemElement) {
    const [itemName, itemDetails] = itemElement.textContent.split(' (');
    editItemName.value = itemName.trim();
    editItemDetails.value = itemDetails.replace(')', '').trim();
    editItemQuantity.value = itemElement.dataset.quantity || 1;
    currentEditItem = itemElement;
    editItemModal.style.display = 'block';
  }
  
  function closeEditModal() {
    editItemModal.style.display = 'none';
    currentEditItem = null;
  }
  
  function syncAbilities() {
    // Clear any existing abilities in the character sheet view
    displayAbilitiesSheet.innerHTML = '';
  
    // Loop through the abilities list from the edit view
    abilitiesList.querySelectorAll('li').forEach(ability => {
      // Create a new row for each ability
      const abilityRow = document.createElement('div');
      abilityRow.textContent = ability.textContent;
  
      // Append the ability row to the character sheet abilities section
      displayAbilitiesSheet.appendChild(abilityRow);
    });
  }

  function syncFeats() {
    // Clear any existing feats in the character sheet view
    displayFeatsSheet.innerHTML = '';
  
    // Loop through the feats list from the edit view
    featsList.querySelectorAll('li').forEach(feat => {
      // Create a new div for each feat
      const featRow = document.createElement('div');
      featRow.textContent = feat.textContent;
  
      // Append the feat to the character sheet feats section
      displayFeatsSheet.appendChild(featRow);
    });
  }

  function syncActions() {
    // Clear any existing feats in the character sheet view
    displayActionsSheet.innerHTML = '';
  
    // Loop through the feats list from the edit view
    actionsList.querySelectorAll('li').forEach(actions => {
      // Create a new div for each feat
      const actionsRow = document.createElement('div');
      actionsRow.textContent = actions.textContent;
  
      // Append the feat to the character sheet feats section
      displayActionsSheet.appendChild(actionsRow);
    });
  }

  function syncNotes() {
    // Clear the existing notes in the character sheet view
    displayNotesSheet.innerHTML = '';
  
    // Get the notes from the edit view
    const notesContent = characterNotesInput.value.trim();
  
    // Check if there are any notes to display
    if (notesContent) {
      const notesParagraph = document.createElement('p');
      notesParagraph.textContent = notesContent;
  
      // Append the notes to the character sheet notes section
      displayNotesSheet.appendChild(notesParagraph);
    } else {
      // If no notes, display a placeholder message
      displayNotesSheet.textContent = 'No notes available.';
    }
  }




  // Dice Rolling Logic
  //============================================================================//
  function rollD20(modifier) {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + modifier;
    return { roll, total };
  }
  
  function displayRollResult(roll, modifier, total) {
    rollOutput.textContent = `Rolled: ${roll} + ${modifier} = ${total}`;
    diceRollResult.style.display = 'block';
    setTimeout(() => (diceRollResult.style.display = 'none'), 5000);
  }
  
  document.querySelectorAll('.rollable').forEach(element => {
    element.addEventListener('click', () => {
      const modifier = parseInt(element.dataset.modifier, 10) || 0; // Get the modifier from data attribute
      const { roll, total } = rollD20(modifier); // Roll a d20 with the modifier
      displayRollResult(roll, modifier, total); // Display the result
    });
  });

  


    // Inventory and Skills Management
    //============================================================================//
    addItemButton.addEventListener('click', addItem);
    function addItem() {
        const itemName = newItemInput.value.trim();
        const itemType = newItemTypeInput.value.trim();
        const toHit = newToHitInput.value.trim();
        const damage = newDamageInput.value.trim();
        const charges = parseInt(newChargesInput.value, 10) || 0;
      
        if (!itemName) return alert('Item name is required.');
      
        const li = document.createElement('li');
        li.textContent = `${itemName} (${itemType}) - To Hit: ${toHit}, Damage: ${damage}`;
        li.dataset.charges = charges;
      
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => openEditModal(li));
        li.appendChild(editButton);
      
        inventoryList.appendChild(li);
        newItemInput.value = '';
        newItemTypeInput.value = '';
        newToHitInput.value = '';
        newDamageInput.value = '';
        newChargesInput.value = '';
      }
      
      function syncInventory() {
        displayInventorySheet.innerHTML = '';
        inventoryList.querySelectorAll('li').forEach(item => {
          const itemRow = document.createElement('div');
          itemRow.textContent = item.textContent;
      
          if (item.classList.contains('attuned-item')) {
            itemRow.classList.add('attuned-item');
          }
      
          const charges = parseInt(item.dataset.charges, 10) || 0;
          if (charges > 0) {
            const checkboxContainer = document.createElement('div');
            for (let i = 0; i < charges; i++) {
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkboxContainer.appendChild(checkbox);
            }
            itemRow.appendChild(checkboxContainer);
          }
      
          displayInventorySheet.appendChild(itemRow);
        });
      }
      function syncSkills() {
        skillsDisplay.innerHTML = '';
        document.querySelectorAll('.skill-select').forEach(select => {
          const skillName = select.previousElementSibling.textContent;
          const ability = select.getAttribute('data-ability');
          const abilityModifier = calculateModifier(document.getElementById(ability).value);
      
          const skillRow = document.createElement('div');
          skillRow.textContent = `${skillName}: ${formatModifier(abilityModifier)}`;
          skillsDisplay.appendChild(skillRow);
        });
      }
      
      // Example utility to sync inventory (add similar functions for other sections)
      function syncInventory() {
        displayInventorySheet.innerHTML = inventoryList.innerHTML;
      }





// View and Character Sheet Management
//============================================================================//
toggleViewButton.addEventListener('click', () => {
    const isEditViewVisible = editView.style.display === 'block';
  
    if (isEditViewVisible) {
      // Switch to Character Sheet View
      populateCharacterSheetView();
      syncSkills();
      editView.style.display = 'none';
      characterSheetView.style.display = 'block';
      toggleViewButton.textContent = 'Switch to Edit View';
    } else {
      // Switch to Edit View
      editView.style.display = 'block';
      characterSheetView.style.display = 'none';
      toggleViewButton.textContent = 'Switch to Character Sheet View';
    }
  });
  
  function populateCharacterSheetView() {
    document.getElementById('displayNameSheet').textContent = charNameInput.value || 'Character Name';
    document.getElementById('displayClassSheet').textContent = charClassSelect.value;
    document.getElementById('displayRaceSheet').textContent = charRaceSelect.value;
    document.getElementById('displayLevelSheet').textContent = characterLevelInput.value;
    document.getElementById('displayProficiencyBonusSheet').textContent = getProficiencyBonus();
    document.getElementById('characterHpSheet').value = hpInput.value;
    document.getElementById('displayAcSheet').textContent = acInput.value;
    document.getElementById('displayInitiativeSheet').textContent = initiativeInput.value || '+0';
    syncInventory();
    syncAbilities();
    syncFeats();
    syncActions();
    syncNotes();
  }




// Character Save, Load, and Delete Logic
//============================================================================//
// Save a new character
function saveCharacter() {
    const newCharacter = {
      name: charNameInput.value,
      class: charClassSelect.value,
      race: charRaceSelect.value,
      level: characterLevelInput.value,
      hp: hpInput.value,
      ac: acInput.value,
      initiative: initiativeInput.value,
      stats: {
        strength: strengthInput.value,
        dexterity: dexterityInput.value,
        constitution: constitutionInput.value,
        intelligence: intelligenceInput.value,
        wisdom: wisdomInput.value,
        charisma: charismaInput.value,
      },
      abilities: Array.from(abilitiesList.children).map(li => li.textContent),
      feats: Array.from(featsList.children).map(li => li.textContent),
      actions: Array.from(actionsList.children).map(li => li.textContent),
      inventory: Array.from(inventoryList.children).map(li => li.textContent),
      notes: characterNotesInput.value,
    };
  
    characterList.push(newCharacter);
    localStorage.setItem('characters', JSON.stringify(characterList));
    updateCharacterDropdown();
    alert('Character saved successfully!');
  }
  
  // Load the selected character
  function loadSelectedCharacter() {
    const selectedIndex = characterDropdown.value;
    if (selectedIndex === "") return alert('Please select a character to load.');
  
    const character = characterList[selectedIndex];
  
    charNameInput.value = character.name;
    charClassSelect.value = character.class;
    charRaceSelect.value = character.race;
    characterLevelInput.value = character.level;
    hpInput.value = character.hp;
    acInput.value = character.ac;
    initiativeInput.value = character.initiative;
  
    abilitiesList.innerHTML = '';
    character.abilities.forEach(ability => {
      const li = document.createElement('li');
      li.textContent = ability;
      abilitiesList.appendChild(li);
    });
  
    featsList.innerHTML = '';
    character.feats.forEach(feat => {
      const li = document.createElement('li');
      li.textContent = feat;
      featsList.appendChild(li);
    });
  
    actionsList.innerHTML = '';
    character.actions.forEach(action => {
      const li = document.createElement('li');
      li.textContent = action;
      actionsList.appendChild(li);
    });
  
    inventoryList.innerHTML = '';
    character.inventory.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      inventoryList.appendChild(li);
    });
  
    characterNotesInput.value = character.notes;
    alert('Character loaded successfully!');
  }
  
  // Delete the selected character
  function deleteCharacter() {
    const selectedIndex = characterDropdown.value;
    if (selectedIndex === "") return alert('Please select a character to delete.');
  
    characterList.splice(selectedIndex, 1);
    localStorage.setItem('characters', JSON.stringify(characterList));
    updateCharacterDropdown();
    alert('Character deleted successfully!');
  }
  
  // Update the character dropdown with saved characters
  function updateCharacterDropdown() {
    characterDropdown.innerHTML = '<option value="">-- Select a character --</option>';
    characterList.forEach((character, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = character.name || `Character ${index + 1}`;
      characterDropdown.appendChild(option);
    });
  }
  
  // Initialize the character dropdown on page load
  document.addEventListener('DOMContentLoaded', updateCharacterDropdown);
  
  // Attach event listeners to buttons
  saveCharacterButton.addEventListener('click', saveCharacter);
  loadSelectedCharacterButton.addEventListener('click', loadSelectedCharacter);
  deleteCharacterButton.addEventListener('click', deleteCharacter);