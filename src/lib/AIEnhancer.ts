/**
 * AIEnhancer - Utility for SaaS-level menu optimization.
 * In a production app, this would call a Gemini/OpenAI endpoint.
 */
export const enhanceDescription = async (name: string, currentDescription: string = ""): Promise<string> => {
    // Simulated AI latency
    await new Promise(r => setTimeout(r, 1500));

    // Simple procedural "enhancement" for demonstration
    const adjectives = ["Artisanal", "Farm-fresh", "Slow-roasted", "Exquisite", "Hand-crafted", "Chef-inspired", "Infused"];
    const finishers = ["to perfection", "with a hint of secret spices", "for the discerning palate", "with locally sourced ingredients"];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const fin = finishers[Math.floor(Math.random() * finishers.length)];

    return `${adj} ${name.toLowerCase()} preparation, ${currentDescription ? currentDescription + " and " : ""} meticulously crafted ${fin}.`;
};

export const suggestPrice = (currentPrice: number, popularityScore: number): number => {
    // If very popular, suggest a 5-10% "demand-based" increase
    if (popularityScore > 0.8) {
        return Math.round(currentPrice * 1.08);
    }
    return currentPrice;
};
