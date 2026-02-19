document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsSearchInput = document.getElementById('resultsSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    const luckyBtn = document.getElementById('luckyBtn');
    const responseText = document.getElementById('responseText');
    const traditionalResults = document.getElementById('traditionalResults');
    
    const homeMain = document.getElementById('homeMain');
    const mainFooter = document.getElementById('mainFooter');
    const resultsSection = document.getElementById('resultsSection');

    // Toggle modalità mirror (Google -> elgooG)
    luckyBtn.onclick = () => {
        document.body.classList.toggle('mirror-mode');
        
        // Aggiorna testo bottone
        if (document.body.classList.contains('mirror-mode')) {
            luckyBtn.textContent = 'Torna normale';
        } else {
            luckyBtn.textContent = 'Mi sento fortunato';
        }
    };

    async function getAIResponse(query) {
        const url = localStorage.getItem('ollama_url') || 'http://localhost:11434';
        const model = localStorage.getItem('ollama_model') || 'llama3';
        
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
            return `❌ Errore Ollama: Non riesco a connettermi a ${url}. Assicurati che Ollama sia attivo.`;
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

        const model = localStorage.getItem('ollama_model') || 'llama3';

        homeMain.classList.add('hidden');
        mainFooter.classList.add('hidden');
        resultsSection.classList.add('active');
        resultsSearchInput.value = query;

        document.getElementById('activeModel').innerHTML = `<span class="material-icons">memory</span> Generazione in corso con ${model}...`;
        responseText.innerHTML = '<span class="loading-dots">Ollama sta elaborando</span>';
        traditionalResults.innerHTML = '';

        const answer = await getAIResponse(query);
        const formattedAnswer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        responseText.innerHTML = formattedAnswer;
        traditionalResults.innerHTML = generateTraditionalResults(query);
    };

    // Eventi Ricerca
    searchBtn.onclick = performSearch;
    searchInput.onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };
    resultsSearchInput.onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };

    // Torna alla home
    document.getElementById('resultsLogo').onclick = () => {
        resultsSection.classList.remove('active');
        homeMain.classList.remove('hidden');
        mainFooter.classList.remove('hidden');
        searchInput.value = '';
    };
});