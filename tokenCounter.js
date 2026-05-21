const textarea = document.querySelector('#inputText');
const resultEl = document.querySelector('#result');
const statChars  = document.querySelector('#stat-chars');
const statWords  = document.querySelector('#stat-words');
const statTokens = document.querySelector('#stat-tokens');
const saveBtn = document.querySelector('#save-btn');
const historyList = document.querySelector('#history-list');
const clearBtn = document.querySelector('#clear-btn');

const history = [];

function cleanText(text){
    return text.trim();
}

function splitIntoWords(text){
    return text.split(" ");
}

function removeEmptyWords(words) {
    return words.filter(
        function(word) {
            return word !== "";
        }
    );
}

function estimateTokens(words) {
    return Math.ceil(words.length * 0.75);
}

function countTokens(text) {
    const cleaned = cleanText(text);
    const words = splitIntoWords(cleaned);
    const filtered = removeEmptyWords(words);
    return estimateTokens(filtered);
}

function analyzeText(text) {
    const cleaned = cleanText(text);
    const words = splitIntoWords(cleaned);
    const filtered = removeEmptyWords(words);
  
    return {
      characters: cleaned.length,
      words: filtered.length,
      tokens: estimateTokens(filtered)
    };
}

function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) return;
    const maxTokens = Math.max(...history.map(function(e) { return e.tokens; }));

    history.forEach(function(entry) {
        const li = document.createElement('li');
        const text = document.createElement('span');
        text.textContent = entry.label + ' ' + entry.tokens + ' tokens, ' + entry.words + ' words, ' + entry.characters + ' characters';
        li.appendChild(text);
    
        if (entry.tokens === maxTokens) {
            const badge = document.createElement('span');
            badge.className = 'peak-badge';
            badge.textContent = 'Peak';
            li.appendChild(badge);
        }
    
        historyList.appendChild(li);
    });
    

}
textarea.addEventListener('input', function() {
    const analysis = analyzeText(textarea.value);

    resultEl.textContent   = 'Estimated tokens: ' + analysis.tokens;
    statChars.textContent  = 'Characters: '        + analysis.characters;
    statWords.textContent  = 'Words: '             + analysis.words;
    statTokens.textContent = 'Estimated tokens: '  + analysis.tokens;

    saveBtn.disabled = textarea.value.trim() === '';
});

saveBtn.addEventListener('click', function() {
    if (textarea.value.trim() === '') return;
    const analysis = analyzeText(textarea.value);
    analysis.label = 'Snapshot ' + (history.length + 1) + ': ';
    history.push(analysis);
    renderHistory();
});

clearBtn.addEventListener('click', function() {
    history.length=0
    renderHistory();
});