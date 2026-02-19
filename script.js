document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsSearchInput = document.getElementById('resultsSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const responseText = document.getElementById('responseText');
    const traditionalResults = document.getElementById('traditionalResults');
    const settingsModal = document.getElementById('settingsModal');
    const openSettings = document.getElementById('openSettings');
    const saveSettings = document.getElementById('saveSettings');
    
    const ollamaUrlInput = document.getElementById('ollamaUrlInput');
    const ollamaModelInput = document.getElementById('ollamaModelInput');
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

    // Carica configurazione
    const updateConfigDisplay = () => {
        const url = localStorage.getItem('ollama_url') || defaultUrl;
        const model = localStorage.getItem('ollama_model') || defaultModel;
        ollamaUrlInput.value = url;
        ollamaModelInput.value = model;
        homeModelName.textContent = `Local AI: ${model}`;
        resultBadge.textContent = model;
    };

    updateConfigDisplay();

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
            return `❌ Errore Ollama: Non riesco a connettermi a ${url}. Assicurati che Ollama sia attivo e configurato con OLLAMA_ORIGINS="*".`;
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
        // Semplice formattazione markdown-like per grassetti
        const formattedAnswer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        responseText.innerHTML = formattedAnswer;
        traditionalResults.innerHTML = generateTraditionalResults(query);
    };

    openSettings.onclick = () => settingsModal.style.display = 'block';
    saveSettings.onclick = () => {
        localStorage.setItem('ollama_url', ollamaUrlInput.value.trim() || defaultUrl);
        localStorage.setItem('ollama_model', ollamaModelInput.value.trim() || defaultModel);
        updateConfigDisplay();
        settingsModal.style.display = 'none';
    };
    window.onclick = (e) => { if(e.target == settingsModal) settingsModal.style.display = 'none'; };

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