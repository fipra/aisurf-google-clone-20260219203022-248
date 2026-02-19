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
    const mainSection = document.querySelector('main');
    const resultsSection = document.getElementById('resultsSection');
    const footer = document.querySelector('footer');

    const modelNames = {
        'ollama': 'Ollama Locale',
        'gemini-3-flash-preview': 'Gemini-3-Flash-Preview',
        'meno-flash': 'Meno Flash',
        'meno-preview': 'Meno Preview'
    };

    const modelResponses = {
        'ollama': {
            color: '#667eea',
            description: 'Modello locale eseguito sul tuo dispositivo. Privacy garantita, nessuna connessione internet richiesta.'
        },
        'gemini-3-flash-preview': {
            color: '#4285f4',
            description: 'Ultima versione di Gemini con capacità avanzate di ragionamento e multimodalità.'
        },
        'meno-flash': {
            color: '#ea4335',
            description: 'Versione ottimizzata per velocità e efficienza energetica.'
        },
        'meno-preview': {
            color: '#34a853',
            description: 'Versione sperimentale con funzionalità anteprima e accesso anticipato.'
        }
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
                url: `https://www.example.com/${query.replace(/\s+/g, '-')}`,
                title: `${query} - Informazioni Complete`,
                description: `Trova tutte le informazioni su ${query}. Guide, tutorial e risorse aggiornate per approfondire l'argomento.`
            },
            {
                url: `https://www.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
                title: `${query} - Wikipedia`,
                description: `Voce enciclopedica su ${query}. Storia, caratteristiche e informazioni verificate dalla community.`
            },
            {
                url: `https://www.news.com/search/${query.replace(/\s+/g, '-')}`,
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

    const performSearch = () => {
        const query = searchInput.value.trim() || resultsSearchInput.value.trim();
        if (!query) return;

        const selectedModel = aiModel.value;
        updateModelDisplay();

        // Show loading state
        responseText.innerHTML = '<div class="loading">Generazione risposta in corso...</div>';
        
        // Simulate AI response delay
        setTimeout(() => {
            const aiResponse = generateAIResponse(query, selectedModel);
            responseText.innerHTML = aiResponse.replace(/\n/g, '<br>');
            traditionalResults.innerHTML = generateTraditionalResults(query);

            // Switch to results view
            mainSection.classList.add('hidden');
            footer.classList.add('hidden');
            resultsSection.classList.add('active');
            resultsSearchInput.value = query;
        }, 800);
    };

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    resultsSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    aiModel.addEventListener('change', updateModelDisplay);

    // Return to home
    document.querySelector('.results-logo').addEventListener('click', () => {
        resultsSection.classList.remove('active');
        mainSection.classList.remove('hidden');
        footer.classList.remove('hidden');
        searchInput.value = '';
    });

    // Initialize
    updateModelDisplay();
});
