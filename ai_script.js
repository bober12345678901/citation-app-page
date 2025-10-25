document.addEventListener('DOMContentLoaded', function() {

    // Get the elements for the chat page
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const messagesContainer = document.getElementById('chat-messages-container');

    // The 5 "unhelpful" responses
    const botResponses = [
        "What?",
        "Refresh the website.",
        "I don't know.",
        "Can you ask a question regarding the website please?",
        "Sorry, I am not programmed to help with that."
    ];

    // Check if we are on the chat page
    if (chatForm && messagesContainer) {
        
        chatForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop page reload
            
            const userInput = chatInput.value.trim();
            
            if (userInput) {
                // 1. Add the user's message to the screen
                addMessage(userInput, 'user');
                
                // 2. Clear the input field
                chatInput.value = '';
                
                // 3. Show a bot response after a short delay
                setTimeout(showBotResponse, 1000);
            }
        });
    }

    function addMessage(text, sender) {
        // Create a new message bubble
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = text;
        
        // Add it to the container
        messagesContainer.appendChild(messageElement);
        
        // Auto-scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showBotResponse() {
        // Get a random response from the list
        const randomIndex = Math.floor(Math.random() * botResponses.length);
        const response = botResponses[randomIndex];
        
        // Add the bot's message to the screen
        addMessage(response, 'bot');
    }

    // --- This part is for the contact form on contact.html ---
    // It's safe to keep it here, it will just be ignored on other pages
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('This is a demo form. No data was sent.');
        });
    }
});