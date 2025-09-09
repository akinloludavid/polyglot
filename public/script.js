document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputText = document.getElementById('inputText');
    const targetLanguage = document.getElementById('targetLanguage');
    const translateBtn = document.getElementById('translateBtn');
    const btnText = translateBtn.querySelector('.btn-text');
    const loading = translateBtn.querySelector('.loading');
    
    const resultSection = document.getElementById('resultSection');
    const errorSection = document.getElementById('errorSection');
    const originalText = document.getElementById('originalText');
    const translatedText = document.getElementById('translatedText');
    const translatedLanguage = document.getElementById('translatedLanguage');
    const errorMessage = document.getElementById('errorMessage');

    // Language display names
    const languageNames = {
        'french': 'French (Français)',
        'german': 'German (Deutsch)',
        'spanish': 'Spanish (Español)'
    };

    // Add event listener to translate button
    translateBtn.addEventListener('click', handleTranslation);

    // Add enter key support for textarea (Ctrl+Enter or Cmd+Enter)
    inputText.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleTranslation();
        }
    });

    // Auto-resize textarea
    inputText.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Handle form validation
    function validateForm() {
        const text = inputText.value.trim();
        const language = targetLanguage.value;

        if (!text) {
            showError('Please enter some text to translate.');
            return false;
        }

        if (!language) {
            showError('Please select a target language.');
            return false;
        }

        return true;
    }

    // Handle translation request
    async function handleTranslation() {
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Hide previous results/errors
        hideResults();
        hideError();

        // Show loading state
        setLoadingState(true);

        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: inputText.value.trim(),
                    targetLanguage: targetLanguage.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Translation failed');
            }

            // Show successful translation
            showResults(data);

        } catch (error) {
            console.error('Translation error:', error);
            showError(error.message || 'An error occurred during translation. Please try again.');
        } finally {
            setLoadingState(false);
        }
    }

    // Set loading state
    function setLoadingState(isLoading) {
        translateBtn.disabled = isLoading;
        
        if (isLoading) {
            btnText.style.display = 'none';
            loading.style.display = 'inline';
        } else {
            btnText.style.display = 'inline';
            loading.style.display = 'none';
        }
    }

    // Show translation results
    function showResults(data) {
        originalText.textContent = data.originalText;
        translatedText.textContent = data.translatedText;
        translatedLanguage.textContent = `Translation (${data.targetLanguage}):`;
        
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Hide results
    function hideResults() {
        resultSection.style.display = 'none';
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Hide error message
    function hideError() {
        errorSection.style.display = 'none';
    }

    // Add some sample text for demo purposes
    const sampleTexts = [
        "Hello, how are you today?",
        "I love learning new languages.",
        "The weather is beautiful outside.",
        "Thank you for your help.",
        "I would like to order some food, please."
    ];

    // Add a subtle placeholder rotation
    let placeholderIndex = 0;
    function rotatePlaceholder() {
        inputText.placeholder = `Type your English text here... (e.g., "${sampleTexts[placeholderIndex]}")`;
        placeholderIndex = (placeholderIndex + 1) % sampleTexts.length;
    }

    // Rotate placeholder every 5 seconds
    setInterval(rotatePlaceholder, 5000);
    rotatePlaceholder(); // Set initial placeholder
});