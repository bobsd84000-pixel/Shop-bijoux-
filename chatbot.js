// Interface chatbot conseiller
class ChatbotConseiller {
  constructor() {
    this.messages = [];
    this.init();
  }

  init() {
    this.createUI();
    this.attachEvents();
  }

  createUI() {
    const chatbotHTML = `
      <div id="chatbot-container" class="chatbot">
        <div class="chatbot-header">
          <h3>💎 Conseiller Bijoux</h3>
          <button id="chatbot-toggle" class="chatbot-toggle">−</button>
        </div>
        <div id="chatbot-messages" class="chatbot-messages">
          <div class="message assistant">
            Bonjour! Décrivez l'occasion et votre budget, je vous recommande des bijoux 👑
          </div>
        </div>
        <div class="chatbot-input">
          <input
            id="chatbot-input"
            type="text"
            placeholder="Ex: cadeau anniversaire, 50€..."
            maxlength="200"
          />
          <button id="chatbot-send">→</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    this.injectStyles();
  }

  injectStyles() {
    const styles = `
      #chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        z-index: 9999;
      }

      .chatbot-header {
        background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
        color: white;
        padding: 15px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chatbot-header h3 {
        margin: 0;
        font-size: 16px;
      }

      .chatbot-toggle {
        background: rgba(255,255,255,0.3);
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        transition: all 0.2s;
      }

      .chatbot-toggle:hover {
        background: rgba(255,255,255,0.5);
      }

      #chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 350px;
      }

      .message {
        padding: 10px 12px;
        border-radius: 8px;
        max-width: 85%;
        font-size: 14px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .message.user {
        align-self: flex-end;
        background: #e8f4f8;
        color: #333;
      }

      .message.assistant {
        align-self: flex-start;
        background: #f5f5f5;
        color: #333;
      }

      .message.error {
        align-self: flex-start;
        background: #fee;
        color: #c00;
      }

      .produit-rec {
        align-self: flex-start;
        background: #fff8f0;
        border: 1px solid #e6b57d;
        border-radius: 8px;
        padding: 10px;
        max-width: 280px;
      }

      .produit-rec-nom {
        font-weight: bold;
        color: #8b6f47;
        margin-bottom: 4px;
      }

      .produit-rec-prix {
        color: #d4af37;
        font-size: 16px;
        font-weight: bold;
      }

      .produit-rec-desc {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }

      .chatbot-input {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid #eee;
      }

      #chatbot-input {
        flex: 1;
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 14px;
        outline: none;
      }

      #chatbot-input:focus {
        border-color: #d4af37;
        box-shadow: 0 0 4px rgba(212,175,55,0.3);
      }

      #chatbot-send {
        background: #d4af37;
        color: white;
        border: none;
        border-radius: 6px;
        width: 36px;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.2s;
      }

      #chatbot-send:hover {
        background: #c9a227;
      }

      #chatbot-send:active {
        transform: scale(0.95);
      }

      .chatbot.minimized #chatbot-messages {
        display: none;
      }

      .chatbot.minimized .chatbot-input {
        display: none;
      }

      @media (max-width: 480px) {
        #chatbot-container {
          width: 100vw;
          height: 100vh;
          bottom: 0;
          right: 0;
          border-radius: 0;
          max-height: none;
        }
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  attachEvents() {
    document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleMinimize());
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const besoin = input.value.trim();

    if (!besoin) return;

    // Afficher le message utilisateur
    this.addMessage(besoin, 'user');
    input.value = '';

    // Afficher le loader
    const messagesEl = document.getElementById('chatbot-messages');
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const response = await fetch('/api/recommandations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ besoin })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      // Afficher le conseil
      if (data.conseil) {
        this.addMessage(data.conseil, 'assistant');
      }

      // Afficher les produits recommandés
      if (data.produits && data.produits.length > 0) {
        data.produits.forEach(p => {
          this.addProduit(p);
        });
      }

      if (data.raison) {
        this.addMessage(data.raison, 'assistant');
      }
    } catch (error) {
      this.addMessage(`Erreur: ${error.message}`, 'error');
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  addMessage(text, type = 'assistant') {
    const messagesEl = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.textContent = text;
    messagesEl.appendChild(div);
  }

  addProduit(produit) {
    const messagesEl = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'produit-rec';
    div.innerHTML = `
      <div class="produit-rec-nom">${produit.nom}</div>
      <div class="produit-rec-desc">${produit.description}</div>
      <div class="produit-rec-prix">${produit.prix}€</div>
    `;
    messagesEl.appendChild(div);
  }

  toggleMinimize() {
    const container = document.getElementById('chatbot-container');
    const btn = document.getElementById('chatbot-toggle');
    container.classList.toggle('minimized');
    btn.textContent = container.classList.contains('minimized') ? '+' : '−';
  }
}

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ChatbotConseiller());
} else {
  new ChatbotConseiller();
}
