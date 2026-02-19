document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsSearchInput = document.getElementById('resultsSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const responseText = document.getElementById('responseText');
    const traditionalResults = document.getElementById('traditionalResults');
    
    const settingsModal = document.getElementById('settingsModal');
    const openSettings = document.getElementById('openSettings');
    const saveSettings = document.getElementById('saveSettings');
    const closeSettings = document.getElementById('closeSettings');
    const refreshModels = document.getElementById('refreshModels');
    
    const ollamaUrlInput = document.getElementById('ollamaUrlInput');
    const ollamaModelSelect = document.getElementById('ollamaModelSelect');
    const homeModelName = document.getElementById('homeModelName');
    const activeModelLabel = document.getElementById('activeModel');
    const resultBadge = document.getElementById('resultBadge');

    const homeMain = document.getElementById('homeMain');
    const mainHeader = document.getElementById('mainHeader');
    const mainFooter = document.getElementById('mainFooter');
    const resultsSection = document.getElementById('resultsSection');
    const backToHome = document.getElementById('backToHome');

    // Defaults
    const defaultUrl = 'http://localhost:11434';
    const defaultModel = 'llama3';

    // Funzione per caricare i modelli da Ollama
    async function fetchOllamaModels(baseUrl) {
        try {
            const response = await fetch(`${baseUrl}/api/tags`);
            if (!response.ok) throw new Error('Fallito recupero modelli');
            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('Errore fetch models:', error);
            return null;
        }
    }

    // Aggiorna la lista a discesa dei modelli
    async function updateModelDropdown() {
        const currentUrl = ollamaUrlInput.value.trim() || defaultUrl;
        const savedModel = localStorage.getItem('ollama_model') || defaultModel;
        
        ollamaModelSelect.innerHTML = '<option value="">Caricamento modelli...</option>';
        
        const models = await fetchOllamaModels(currentUrl);
        
        if (models && models.length > 0) {
            ollamaModelSelect.innerHTML = '';
            models.forEach(m => {
                const option = document.createElement('option');
                option.value = m.name;
                option.textContent = m.name;
                if (m.name === savedModel) option.selected = true;
                ollamaModelSelect.appendChild(option);
            });
        } else {
            ollamaModelSelect.innerHTML = `<option value="${savedModel}">${savedModel} (non rilevato)</option>`;
        }
    }

    // Carica configurazione iniziale
    const loadConfig = () => {
        const url = localStorage.getItem('ollama_url') || defaultUrl;
        const model = localStorage.getItem('ollama_model') || defaultModel;
        ollamaUrlInput.value = url;
        homeModelName.textContent = `Modello: ${model}`;
        resultBadge.textContent = model;
    };

    loadConfig();

    async function getAIResponse(query) {
        const url = localStorage.getItem('ollama_url') || defaultUrl;
        const model = localStorage.getItem('ollama_model') || defaultModel;
        
        try {
            const response = await fetch(`${url}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    prompt: query,
                    stream: false
                })
            });
            
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error(error);
            return `❌ Errore Ollama: Non riesco a connettermi a ${url}. Assicurati che Ollama sia attivo con OLLAMA_ORIGINS="*".`;
        }
    }

    const generateTraditionalResults = (query) => {
        const sites = ['wikipedia.org', 'github.com', 'stackoverflow.com', 'reddit.com'];
        return [1, 2, 3].map(i => `
            <div class="result-item">
                <div class="result-url">https://www.${sites[i % sites.length]}/search?q=${encodeURIComponent(query)}</div>
                <a href="#" class="result-title">${query} - Risorsa locale ${i}</a>
                <div class="result-description">Risultato sintetico per <strong>${query}</strong> generato dal sistema di ricerca integrato.</div>
            </div>
        `).join('');
    };

    const performSearch = async () => {
        const query = (resultsSection.classList.contains('active')) 
            ? resultsSearchInput.value.trim() 
            : searchInput.value.trim();

        if (!query) return;

        const model = localStorage.getItem('ollama_model') || defaultModel;

        homeMain.classList.add('hidden');
        mainHeader.classList.add('hidden');
        mainFooter.classList.add('hidden');
        resultsSection.classList.add('active');
        resultsSearchInput.value = query;

        activeModelLabel.innerHTML = `<span class="material-icons">memory</span> Generazione in corso con ${model}...`;
        responseText.innerHTML = '<span class="loading-dots">Ollama sta elaborando</span>';
        traditionalResults.innerHTML = '';

        const answer = await getAIResponse(query);
        const formattedAnswer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        responseText.innerHTML = formattedAnswer;
        traditionalResults.innerHTML = generateTraditionalResults(query);
    };

    // Eventi Modal
    openSettings.onclick = () => {
        settingsModal.style.display = 'block';
        updateModelDropdown();
    };
    
    closeSettings.onclick = () => settingsModal.style.display = 'none';
    
    refreshModels.onclick = (e) => {
        e.preventDefault();
        updateModelDropdown();
    };

    saveSettings.onclick = () => {
        const selectedModel = ollamaModelSelect.value;
        const url = ollamaUrlInput.value.trim() || defaultUrl;
        
        localStorage.setItem('ollama_url', url);
        if (selectedModel) localStorage.setItem('ollama_model', selectedModel);
        
        loadConfig();
        settingsModal.style.display = 'none';
    };

    window.onclick = (e) => { if(e.target == settingsModal) settingsModal.style.display = 'none'; };

    // Eventi Ricerca
    searchBtn.onclick = performSearch;
    searchInput.onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };
    resultsSearchInput.onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };

    backToHome.onclick = () => {
        resultsSection.classList.remove('active');
        homeMain.classList.remove('hidden');
        mainHeader.classList.remove('hidden');
        mainFooter.classList.remove('hidden');
    };
});