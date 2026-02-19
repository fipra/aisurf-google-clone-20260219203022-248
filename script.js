document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsSearchInput = document.getElementById('resultsSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const responseText = document.getElementById('responseText');
    const traditionalResults = document.getElementById('traditionalResults');
    const settingsModal = document.getElementById('settingsModal');
    const openSettings = document.getElementById('openSettings');
    const saveSettings = document.getElementById('saveSettings');
    const apiKeyInput = document.getElementById('apiKeyInput');
    
    const homeMain = document.getElementById('homeMain');
    const mainHeader = document.getElementById('mainHeader');
    const mainFooter = document.getElementById('mainFooter');
    const resultsSection = document.getElementById('resultsSection');
    const backToHome = document.getElementById('backToHome');

    const MODEL_ID = 'gemini-3-flash-preview';

    apiKeyInput.value = localStorage.getItem('gemini_api_key') || '';

    async function getAIResponse(query, apiKey) {
        if (!apiKey) return "⚠️ Errore: Inserisci la tua API Key nelle impostazioni per utilizzare il modello Gemini.";
        
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: query }] }]
                })
            });
            
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            if (!data.candidates || data.candidates.length === 0) return "Nessuna risposta generata.";
            
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error(error);
            return `❌ Errore API (${MODEL_ID}): ${error.message}.`;
        }
    }

    const generateTraditionalResults = (query) => {
        const sites = ['wikipedia.org', 'repubblica.it', 'aranzulla.it', 'ilpost.it'];
        return [1, 2, 3].map(i => `
            <div class="result-item">
                <div class="result-url">https://www.${sites[i % sites.length]}/search?q=${encodeURIComponent(query)}</div>
                <a href="#" class="result-title">${query} - Risultato correlato ${i}</a>
                <div class="result-description">Approfondimento su <strong>${query}</strong> tramite fonti verificate. Ultime notizie e dati aggiornati.</div>
            </div>
        `).join('');
    };

    const performSearch = async () => {
        const query = (resultsSection.classList.contains('active')) 
            ? resultsSearchInput.value.trim() 
            : searchInput.value.trim();

        if (!query) return;

        const apiKey = localStorage.getItem('gemini_api_key');

        homeMain.classList.add('hidden');
        mainHeader.classList.add('hidden');
        mainFooter.classList.add('hidden');
        resultsSection.classList.add('active');
        resultsSearchInput.value = query;

        responseText.innerHTML = '<span class="loading-dots">Elaborazione in corso con Gemini 3</span>';
        traditionalResults.innerHTML = '';

        const answer = await getAIResponse(query, apiKey);
        const formattedAnswer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        responseText.innerHTML = formattedAnswer;
        traditionalResults.innerHTML = generateTraditionalResults(query);
    };

    openSettings.onclick = () => settingsModal.style.display = 'block';
    saveSettings.onclick = () => {
        localStorage.setItem('gemini_api_key', apiKeyInput.value.trim());
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