const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Produits
const produits = [
  { id: 1, nom: 'Collier Or', prix: 45.99, description: 'Collier chaîne en or jaune 18k' },
  { id: 2, nom: 'Bracelet Argent', prix: 32.50, description: 'Bracelet en argent sterling' },
  { id: 3, nom: 'Boucles Perles', prix: 28.99, description: 'Boucles d\'oreilles en perles de culture' },
  { id: 4, nom: 'Bague Diamant', prix: 89.99, description: 'Bague solitaire diamant certifié' },
  { id: 5, nom: 'Pendentif Cristal', prix: 55.00, description: 'Pendentif cristal de roche' },
  { id: 6, nom: 'Chaîne Or Rose', prix: 65.99, description: 'Chaîne en or rose 14k' }
];

// Endpoint chatbot conseiller
app.post('/api/recommandations', async (req, res) => {
  const { besoin } = req.body;

  if (!besoin) {
    return res.status(400).json({ erreur: 'Besoin requis' });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ erreur: 'Clé API non configurée' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prompt système pour recommander des bijoux
    const catalogueJson = JSON.stringify(produits, null, 2);
    const prompt = `Tu es conseiller en bijouterie. Le client demande: "${besoin}"

Voici notre catalogue de bijoux:
${catalogueJson}

Recommande les 1-3 produits les plus adaptés à cette demande. Réponds en JSON strictement avec cette structure:
{
  "conseil": "Explication brève (1 phrase)",
  "produits_ids": [1, 2],
  "raison": "Pourquoi ces choix"
}`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // Parser la réponse JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const reponse = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

    // Enrichir avec les données complètes
    reponse.produits = reponse.produits_ids
      .map(id => produits.find(p => p.id === id))
      .filter(p => p);

    res.json(reponse);
  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({
      erreur: 'Erreur lors de la recommandation',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Boutique lancée sur http://localhost:${PORT}`);
});
