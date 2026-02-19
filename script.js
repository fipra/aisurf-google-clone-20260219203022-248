document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsSearchInput = document.getElementById('resultsSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const aiModel = document.getElementById('aiModel');
    const modelBadge = document.getElementById('modelBadge');
    const activeModel = document.getElementById('activeModel');
    const modelIndicatorText = document.getElementById('modelIndicatorText');
    const responseText = document.getElementById('responseText');
    const traditionalResults = document.getElementById('traditionalResults');
    
    const homeMain = document.getElementById('homeMain');
    const mainHeader = document.getElementById('mainHeader');
    const mainFooter = document.getElementById('mainFooter');
    const resultsSection = document.getElementById('resultsSection');
    const backToHome = document.getElementById('backToHome');

    const modelNames = {
        'ollama': 'Ollama Locale',
        'gemini-3-flash-preview': 'Gemini-3-Flash-Preview',
        'meno-flash': 'Meno Flash',
        'meno-preview': 'Meno Preview'
    };

    const updateModelDisplay = () => {
        const selectedModel = aiModel.value;
        const modelName = modelNames[selectedModel];
        modelBadge.textContent = modelName;
        activeModel.textContent = `Risposta generata da: ${modelName}`;
        modelIndicatorText.textContent = selectedModel;
    };

    const generateAIResponse = (query, model) => {
        const responses = {
            'ollama': `🔍 **Ricerca locale per: "${query}"**\n\nBasandomi sulla mia conoscenza locale, ecco le informazioni richieste. Questo modello gira completamente sul tuo dispositivo, garantendo massima privacy. I risultati sono generati in tempo reale senza inviare dati a server esterni.`,
            'gemini-3-flash-preview': `🌟 **Gemini-3-Flash-Preview ha analizzato: "${query}"**\n\nEcco una risposta completa basata sulla mia capacità di ragionamento avanzato. Posso elaborare testo, immagini e codice per fornirti la migliore risposta possibile. La mia conoscenza è aggiornata e posso connettermi a fonti esterne se necessario.`,
            'meno-flash': `⚡ **Meno Flash risponde a: "${query}"**\n\nRisposta veloce ed efficiente! Sono ottimizzato per fornire informazioni rapide con minimo consumo energetico. Perfetto per ricerche quotidiane che richiedono velocità.`,
            'meno-preview': `🚀 **Meno Preview - Anteprima: "${query}"**\n\nStai utilizzando una versione sperimentale con funzionalità esclusive! Questa versione include capacità di ricerca avanzate e integrazione con servizi beta.`
        };
        return responses[model] || responses['gemini-3-flash-preview'];
    };

    const generateTraditionalResults = (query) => {
        const results = [
            {
                url: `https://www.example.com/${encodeURIComponent(query)}`,
                title: `${query} - Informazioni Complete`,
                description: `Trova tutte le informazioni su ${query}. Guide, tutorial e risorse aggiornate per approfondire l'argomento.`
            },
            {
                url: `https://www.wikipedia.org/wiki/${encodeURIComponent(query)}`,
                title: `${query} - Wikipedia`,
                description: `Voce enciclopedica su ${query}. Storia, caratteristiche e informazioni verificate dalla community.`
            },
            {
                url: `https://www.news.com/search/${encodeURIComponent(query)}`,
                title: `Ultime notizie su ${query}`,
                description: `Notizie recenti e aggiornamenti in tempo reale riguardanti ${query}. Fonti affidabili e verificate.`
            }
        ];

        return results.map(result => `
            <div class="result-item">
                <div class="result-url">${result.url}</div>
                <a href="#" class="result-title">${result.title}</a>
                <div class="result-description">${result.description}</div>
            </div>
        `).join('');
    };

    const performSearch = (event) => {
        const query = (resultsSection.classList.contains('active')) 
            ? resultsSearchInput.value.trim() 
            : searchInput.value.trim();

        if (!query) return;

        const selectedModel = aiModel.value;
        updateModelDisplay();

        // Prepare results view
        responseText.innerHTML = '<div class="loading">Generazione risposta in corso...</div>';
        traditionalResults.innerHTML = '';
        
        // Transition visibility
        homeMain.classList.add('hidden');
        mainHeader.classList.add('hidden');
        mainFooter.classList.add('hidden');
        resultsSection.classList.add('active');
        resultsSearchInput.value = query;

        // Simulate AI response delay
        setTimeout(() => {
            const aiResponse = generateAIResponse(query, selectedModel);
            responseText.innerHTML = aiResponse.replace(/\n/g, '<br>');
            traditionalResults.innerHTML = generateTraditionalResults(query);
        }, 600);
    };

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    resultsSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    aiModel.addEventListener('change', updateModelDisplay);

    // Return to home
    backToHome.addEventListener('click', () => {
        resultsSection.classList.remove('active');
        homeMain.classList.remove('hidden');
        mainHeader.classList.remove('hidden');
        mainFooter.classList.remove('hidden');
        searchInput.value = '';
        resultsSearchInput.value = '';
    });

    // Initialize
    updateModelDisplay();
});